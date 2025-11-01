import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async sendMagicLink(loginDto: LoginAuthDto) {
    const { email } = loginDto;

    try {
      const token = this.jwtService.sign(
        { email },
        { expiresIn: '15m' }
      );

      const magicLink = `${process.env.VITE_FRONTEND_URL}/auth/verify?token=${token}`;

      console.log(`🔗 Magic link for ${email}: ${magicLink}`);

      return {
        success: true,
        message: 'Magic link sent to email',
      };
    } catch (error) {
      throw new BadRequestException('Failed to send magic link');
    }
  }

  async verifyMagicLink(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const { email } = payload;

      if (!email) {
        throw new UnauthorizedException('Invalid token');
      }

      let user = await this.db.userAccount.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.db.userAccount.create({
          data: {
            email,
            full_name: email.split('@')[0],
            password_hash: null,
            role: 'customer',
            status: 'active',
          },
        });
      }

      const sessionToken = this.jwtService.sign(
        { user_id: user.user_id, email: user.email },
        { expiresIn: '30d' }
      );

      return {
        success: true,
        token: sessionToken,
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    try {
      const { idToken } = googleAuthDto;

      // TODO: Verify with Google API - currently just decoding
      const decoded = this.jwtService.decode(idToken);
      const { email, name } = decoded as any;

      if (!email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      let user = await this.db.userAccount.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.db.userAccount.create({
          data: {
            email,
            full_name: name || email.split('@')[0],
            password_hash: null,
            role: 'customer',
            status: 'active',
          },
        });
      }

      const sessionToken = this.jwtService.sign(
        { user_id: user.user_id, email: user.email },
        { expiresIn: '30d' }
      );

      return {
        success: true,
        token: sessionToken,
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Google authentication failed');
    }
  }
}
