// src/auth/module/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // Add this import // Add this import (adjust path if needed)
import { JwtStrategy } from '../guard/jwt.strategy';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AdminGuard } from '../guard/admin.guard';
import { SelfOrAdminGuard } from '../guard/self-or-admin.guard';
import { AuthService } from '../service/auth.service';
import { Role } from 'src/role/entity/role.entity';
import { RoleGuard } from '../guard/role.guard';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([Role]), // This makes Repository<Role> available
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:  '24h',
        },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RoleGuard,
    AdminGuard,
    SelfOrAdminGuard,
    AuthService,
  ],
  exports: [
    JwtModule,
    JwtStrategy,
    JwtAuthGuard,
    RoleGuard,
    AdminGuard,
    SelfOrAdminGuard,
    AuthService,
  ],
})
export class AuthModule {}
