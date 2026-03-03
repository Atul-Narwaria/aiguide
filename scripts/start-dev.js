#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
let port = 3000;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const portMatch = envContent.match(/^PORT=(\d+)$/m);
  if (portMatch) {
    port = portMatch[1];
  }
}

// Run next dev with the port
const command = process.argv[2] === 'start' 
  ? `next start -p ${port}` 
  : `next dev -p ${port}`;

console.log(`Starting on port ${port}...`);
execSync(command, { stdio: 'inherit' });
