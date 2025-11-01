import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { EmailService } from '../email/email.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async sendMagicLink(loginDto: LoginAuthDto) {
    const { email } = loginDto;

    try {
      const token = this.jwtService.sign(
        { email },
        { expiresIn: '15m' }
      );

      const frontendUrl = process.env.VITE_FRONTEND_URL || 'https://burvon-gallery.website';
      const magicLink = `${frontendUrl}/auth/verify?token=${token}`;
      
      // Always log magic link locally for testing
      console.log(`\n✨ Magic link generated:`);
      console.log(`🔗 ${magicLink}\n`);

     
      if (process.env.RESEND_API_KEY) {
        try {
          await this.emailService.sendMagicLink(email, magicLink);
          console.log(` Email sent successfully to ${email}`);
        } catch (emailError) {
          console.error(` Email send failed (will still work locally):`, emailError.message);
        }
      }
      
      return {
        success: true,
        message: 'Magic link sent to email',
      };
    } catch (error) {
      console.error(`❌ Error:`, error.message);
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
