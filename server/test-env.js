import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);

// Try to load .env file
const envPath = path.join(__dirname, '.env');
console.log('Looking for .env at:', envPath);

try {
  if (envPath) {
    dotenv.config({ path: envPath });
    console.log('✅ .env file loaded successfully');
  } else {
    console.log('ℹ️ Using environment variables from process');
  }

  // Test some environment variables
  console.log('\nEnvironment Variables:');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('PORT:', process.env.PORT || 'not set');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'set' : 'not set');
  console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? 'set' : 'not set');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'set' : 'not set');

} catch (error) {
  console.error('❌ Error loading .env file:', error);
}
