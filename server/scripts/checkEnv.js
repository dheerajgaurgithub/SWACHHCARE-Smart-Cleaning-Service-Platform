import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Check required environment variables
const requiredVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL'
];

console.log('=== Environment Variables Check ===');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

let allVarsPresent = true;

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    allVarsPresent = false;
  } else {
    // Don't log sensitive data
    const displayValue = varName.includes('SECRET') || varName.includes('TOKEN') || varName.includes('PASSWORD')
      ? '********' 
      : process.env[varName];
    console.log(`✅ ${varName}=${displayValue}`);
  }
});

if (!allVarsPresent) {
  console.error('\n❌ Some required environment variables are missing.');
  console.log('\nPlease ensure your .env file exists in the server directory and contains all required variables.');
  console.log('You can copy .env.example to .env and update the values.');
  process.exit(1);
}

console.log('\n✅ All required environment variables are present!');
process.exit(0);
