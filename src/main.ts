import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import type { Request, Response } from 'express';

let cachedApp: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://nexus-wear-dashboard.vercel.app',
      'https://nexus-wear-tawny.vercel.app',
      'https://nexus-wear-theta.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nexus Wear Backend')
    .setDescription('The Nexus Wear API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  if (process.env.VERCEL) {
    await app.init(); // no listen
    return app.getHttpAdapter().getInstance();
  } else {
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`🚀 Server running at http://localhost:${port}`);
  }
}

// Only export handler when running on Vercel
if (process.env.VERCEL) {
  const handler = async (req: Request, res: Response) => {
    if (!cachedApp) cachedApp = await bootstrap();
    return cachedApp(req, res);
  };
  module.exports = handler;
} else {
  bootstrap();
}
