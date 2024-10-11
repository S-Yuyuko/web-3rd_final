import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine if the environment is development or production
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Load SSL certificates for HTTPS (Let's Encrypt)
const httpsOptions = {
  key: readFileSync('/etc/letsencrypt/live/wuwarren.com/privkey.pem'),
  cert: readFileSync('/etc/letsencrypt/live/wuwarren.com/cert.pem'),
  ca: readFileSync('/etc/letsencrypt/live/wuwarren.com/chain.pem'),
};

app.prepare().then(() => {
  console.log(`Next.js app is prepared in ${dev ? 'development' : 'production'} mode.`);
  
  // Create HTTPS server with SSL certificates
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url || '', true);

    // Handle all requests with Next.js
    handle(req, res, parsedUrl);
  }).listen(443, (err) => {
    if (err) throw err;
    console.log('> Server running at https://wuwarren.com:443');
  });
}).catch((err) => {
  console.error('Error during app preparation:', err);
});
