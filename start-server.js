#!/usr/bin/env node
const { spawn } = require('child_process');

const port = process.env.PORT || '3001';

console.log(`Starting Remotion Studio on port ${port}...`);

const studio = spawn('npx', ['remotion', 'studio', '--port', port], {
  stdio: 'inherit',
  env: process.env
});

studio.on('error', (err) => {
  console.error('Failed to start Remotion Studio:', err);
  process.exit(1);
});

studio.on('exit', (code) => {
  process.exit(code);
});
