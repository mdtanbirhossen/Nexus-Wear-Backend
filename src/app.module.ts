import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CustomerModule } from './customer/module/customer.module';
import * as dotenv from 'dotenv';
import { R2UploadModule } from './r2-upload/module/r2-upload.module';
import { RoleModule } from './role/module/role.module';
import { AuthModule } from './auth/module/auth.module';
import { AdminModule } from './admin/module/admin.module';
import { CategoryModule } from './category/module/category.module';
import { SubcategoryModule } from './subcategory/module/subcategory.module';
import { ColorModule } from './color/module/color.module';
import { SizeModule } from './size/module/size.module';
import { OrderModule } from './order/module/order.module';
import { PaymentModule } from './payment/module/payment.module';
import { AddressModule } from './address/module/address.module';
import { CartModule } from './cart/module/cart.module';
import { WishlistModule } from './wishlist/module/wishlist.module';
import { ContactModule } from './contact/module/contact.module';
import { FaqModule } from './faq/module/faq.module';
import { ReviewModule } from './review/module/review.module';
import { BannerModule } from './banner/module/banner.module';
import { SubscriberModule } from './subscriber/module/subscriber.module';
import { StatisticsModule } from './statistics/module/statistics.module';
import { AddressBookModule } from './address-book/module/address-book.module';
import { NotificationModule } from './notification/module/notification.module';
import { ProductModule } from './product/module/product.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomerModule,
    R2UploadModule,
    RoleModule,
    AuthModule,
    AdminModule,
    CategoryModule,
    SubcategoryModule,
    ColorModule,
    SizeModule,
    OrderModule,
    PaymentModule,
    AddressModule,
    CartModule,
    WishlistModule,
    ContactModule,
    FaqModule,
    ReviewModule,
    BannerModule,
    SubscriberModule,
    StatisticsModule,
    NotificationModule,
    AddressBookModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
