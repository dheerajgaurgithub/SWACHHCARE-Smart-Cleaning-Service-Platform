import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

// Check if .env exists, if not create it from .env.example
if (!fs.existsSync(envPath)) {
  try {
    // Read the example file
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    // Set default values
    const envContent = envExample
      .replace('NODE_ENV=development', 'NODE_ENV=development')
      .replace('PORT=5000', 'PORT=5000')
      .replace('MONGODB_URI=mongodb://localhost:27017/swachhcare', 'MONGODB_URI=mongodb://localhost:27017/swachhcare')
      .replace('JWT_SECRET=your_jwt_secret_key_here', `JWT_SECRET=${crypto.randomBytes(32).toString('hex')}`)
      .replace('JWT_EXPIRES_IN=90d', 'JWT_EXPIRES_IN=90d')
      .replace('JWT_COOKIE_EXPIRES_IN=90', 'JWT_COOKIE_EXPIRES_IN=90')
      .replace('SESSION_SECRET=your_session_secret_here', `SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}`);
    
    // Write the new .env file
    fs.writeFileSync(envPath, envContent);
    console.log('Created .env file with default values');
  } catch (error) {
    console.error('Error creating .env file:', error);
    process.exit(1);
  }
} else {
  console.log('.env file already exists');
}

console.log('Setup complete. Please restart your server.');
