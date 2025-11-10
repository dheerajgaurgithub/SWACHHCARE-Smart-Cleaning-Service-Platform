import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisify fs.readFile
const readFile = promisify(fs.readFile);

// Initialize the Gmail API client
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

export class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(' ')[0] : 'User';
    this.from = `SWACHHCARE <${process.env.EMAIL_FROM}>`;
  }

  async createTransport() {
    try {
      // Use environment variables directly
      const { 
        GMAIL_CLIENT_ID: client_id, 
        GMAIL_CLIENT_SECRET: client_secret, 
        GMAIL_REDIRECT_URI: redirect_uri,
        GMAIL_REFRESH_TOKEN: refresh_token
      } = process.env;

      if (!client_id || !client_secret) {
        throw new Error('Missing Gmail OAuth2 credentials');
      }
      
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uri || 'http://localhost:5000/oauth2callback'
      );

      // Set the Gmail API credentials
      oAuth2Client.setCredentials({
        refresh_token: refresh_token,
        // Optionally include other tokens if available
        access_token: process.env.GMAIL_ACCESS_TOKEN,
        expiry_date: process.env.GMAIL_TOKEN_EXPIRY ? parseInt(process.env.GMAIL_TOKEN_EXPIRY) : null
      });

      // Refresh the access token if needed
      if (!oAuth2Client.credentials.access_token && refresh_token) {
        const { tokens } = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(tokens);
      }

      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      return gmail;
    } catch (error) {
      console.error('Error creating Gmail transport:', error);
      throw new Error('Failed to initialize email service');
    }
  }

  async send(template, subject, templateVars = {}) {
    try {
      // Read email template
      let html = '';
      const templatePath = path.join(__dirname, '..', 'views', 'email', `${template}.html`);
      
      try {
        html = await readFile(templatePath, 'utf-8');
      } catch (error) {
        console.warn(`Template file not found: ${templatePath}. Using default template.`);
        html = this.getDefaultTemplate(templateVars.message || 'Hello from SWACHHCARE');
      }

      // Replace template variables
      Object.entries(templateVars).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

      // Create email message
      const message = [
        `From: ${this.from}`,
        `To: ${this.to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        html,
      ].join('\n');

      // Encode the message in base64
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send the email
      const gmail = await this.createTransport();
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log(`Email sent to ${this.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to SWACHHCARE!', {
      firstName: this.firstName,
      message: 'Thank you for joining SWACHHCARE. We are excited to have you on board!',
    });
  }

  async sendPasswordReset(url) {
    await this.send('passwordReset', 'Your password reset token (valid for 10 minutes)', {
      firstName: this.firstName,
      url,
      message: 'You requested a password reset. Please click the button below to reset your password:',
    });
  }

  async sendOTP(otp) {
    await this.send('otp', 'Your OTP for SWACHHCARE', {
      firstName: this.firstName,
      otp,
      message: 'Your One Time Password (OTP) for verification is:',
    });
  }

  getDefaultTemplate(message) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
            .button {
              display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #4CAF50;
              color: white; text-decoration: none; border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SWACHHCARE</h1>
            </div>
            <div class="content">
              <p>Hello ${this.firstName},</p>
              <p>${message}</p>
              <p>If you did not request this, please ignore this email.</p>
              <p>Best regards,<br/>The SWACHHCARE Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} SWACHHCARE. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default Email;
