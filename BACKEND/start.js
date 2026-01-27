#!/usr/bin/env node

/**
 * Simple diagnostic script to test backend startup
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('=== EASYSTAY BACKEND DIAGNOSTIC ===\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log('   - PORT:', process.env.PORT || 'NOT SET');
console.log('   - MONGODB_URL:', process.env.MONGODB_URL ? '✓ SET' : '✗ NOT SET');
console.log('   - ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET ? '✓ SET' : '✗ NOT SET');
console.log('   - REFRESH_TOKEN_SECRET:', process.env.REFRESH_TOKEN_SECRET ? '✓ SET' : '✗ NOT SET');
console.log('   - CORS_ORIGIN:', process.env.CORS_ORIGIN || 'NOT SET');

// Check Node version
console.log('\n2. Node Version:', process.version);

// Check dependencies
console.log('\n3. Checking Dependencies...');
try {
  import('express').then(() => console.log('   - express: ✓'));
  import('mongoose').then(() => console.log('   - mongoose: ✓'));
  import('cors').then(() => console.log('   - cors: ✓'));
} catch (e) {
  console.error('   - Missing dependencies');
}

console.log('\n4. Starting Server...\n');
console.log('If you see errors below, please share them:\n');

// Start the actual server
import('./src/main.js').catch(err => {
  console.error('ERROR STARTING SERVER:');
  console.error(err);
  process.exit(1);
});
