import { Injectable, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    
    
    if (apiKey && apiKey !== 're_test_key_here') {
      this.resend = new Resend(apiKey);
    } else {
      throw new BadRequestException('Email service not configured');
    }
  }

  async sendMagicLink(email: string, magicLink: string) {
    
    if (!this.resend) {
      throw new BadRequestException('Email service not configured');
    }

    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@burvon-gallery.website';
      const result = await this.resend.emails.send({
        from: fromAddress,
        to: email,
        subject: 'Your BURVON Gallery Login Link',
        html: this.getMagicLinkTemplate(magicLink, email),
      });


      return { success: true, message: 'Magic link sent to email' };
    } catch (error) {
      console.error('❌ Resend error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  private getMagicLinkTemplate(magicLink: string, email: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #181818; }
            .subtitle { font-size: 12px; color: #959595; margin-top: 5px; }
            .content { margin: 30px 0; line-height: 1.6; color: #333; }
            .button-container { text-align: center; margin: 40px 0; }
            .button { 
              background-color: #FFF7DC;
              color: #181818;
              padding: 14px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: inline-block;
            }
            .button:hover { background-color: #ffe9b3; }
            .footer { 
              text-align: center; 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #eee;
              font-size: 12px;
              color: #959595;
            }
            .link-text { 
              word-break: break-all; 
              background: #f9f9f9;
              padding: 12px;
              border-radius: 4px;
              font-size: 12px;
              color: #666;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BURVON</div>
              <div class="subtitle">REVELED BY ALL</div>
            </div>

            <div class="content">
              <p>Hello,</p>
              <p>We received a request to log in to your BURVON Gallery account with this email address: <strong>${email}</strong></p>
              <p>Click the button below to verify your email and log in. This link expires in 15 minutes.</p>
            </div>

            <div class="button-container">
              <a href="${magicLink}" class="button">Verify & Login</a>
            </div>

            <div class="content">
              <p>Or copy and paste this link in your browser:</p>
              <div class="link-text">${magicLink}</div>
            </div>

            <div class="content">
              <p>If you didn't request this email, you can safely ignore it.</p>
              <p>Best regards,<br>The BURVON Team</p>
            </div>

            <div class="footer">
              <p>&copy; 2025 BURVON Gallery. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
