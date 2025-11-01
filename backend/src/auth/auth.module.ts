import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from '../database/database.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '30d' },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
