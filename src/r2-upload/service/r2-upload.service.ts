import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';

@Injectable()
export class R2UploadService {
  private readonly s3: AWS.S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('R2_BUCKET_NAME') || 'dress-hut';

    this.s3 = new AWS.S3({
      endpoint: this.configService.get<string>('R2_ENDPOINT'),
      accessKeyId: this.configService.get<string>('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('SECRET_ACCESS_KEY'),
      signatureVersion: 'v4', // Important for R2
    });

    console.log('✅ R2 Initialized with bucket:', this.bucketName);
  }

  private async uploadFile(
    file: Express.Multer.File,
    key: string,
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: mime.lookup(file.originalname) || 'application/octet-stream',
    };

    try {
      await this.s3.putObject(params).promise();
      // Construct public URL manually
      const publicUrl = `${this.configService.get<string>('R2_Public_ENDPOINT')}/${key}`;
      return publicUrl;
    } catch (error) {
      console.error(`R2 upload failed for key "${key}":`, error.message);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  private generateKey(folder: string, id: string, filename: string): string {
    return `${folder}/${id}/${Date.now()}-${filename}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const urlPath = new URL(fileUrl).pathname;
      const key = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;

      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise();

      console.log('✅ File deleted from R2:', key);
    } catch (error) {
      console.error(`Failed to delete file from R2: ${error.message}`);
    }
  }

  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    if (!fileUrls || fileUrls.length === 0) return;

    try {
      const deleteParams = {
        Bucket: this.bucketName,
        Delete: {
          Objects: fileUrls.map((url) => {
            const urlPath = new URL(url).pathname;
            const key = urlPath.startsWith('/')
              ? urlPath.substring(1)
              : urlPath;
            return { Key: key };
          }),
        },
      };

      await this.s3.deleteObjects(deleteParams).promise();
    } catch (error) {
      console.error('Error deleting multiple files from R2:', error);
    }
  }

  // upload image method
  async uploadImage(
    file: Express.Multer.File,
    id: string,
    folderName: string,
  ): Promise<string> {
    const key = this.generateKey(folderName, id, file.originalname);
    return this.uploadFile(file, key);
  }

}
