import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load client secrets from a local file or environment variables
const CREDENTIALS_PATH = path.join(__dirname, '../../credentials.json');
const TOKEN_PATH = path.join(__dirname, '../../token.json');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

let gmailClient = null;

// Initialize Gmail API client
async function initializeGmail() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}');
    
    if (!credentials.client_email || !credentials.private_key) {
      console.warn('Gmail API credentials not found. Email functionality will be disabled.');
      return false;
    }

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key.replace(/\\n/g, '\n'),
      SCOPES
    );

    gmailClient = google.gmail({ version: 'v1', auth });
    return true;
  } catch (error) {
    console.error('Error initializing Gmail client:', error);
    return false;
  }
}

// Send email using Gmail API
async function sendEmail(to, subject, htmlContent) {
  if (!gmailClient) {
    const isInitialized = await initializeGmail();
    if (!isInitialized) {
      console.error('Gmail client not initialized. Email not sent.');
      return false;
    }
  }

  try {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      htmlContent,
    ];
    
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmailClient.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log('Email sent successfully to', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  const subject = 'Your SwachhCare Verification Code';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Your OTP for email verification is:</p>
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
        <strong>${otp}</strong>
      </div>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p>Best regards,<br>SwachhCare Team</p>
    </div>
  `;

  return sendEmail(email, subject, htmlContent);
}

export { initializeGmail, sendEmail, sendOTPEmail };
