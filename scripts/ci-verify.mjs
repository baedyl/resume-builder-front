#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve } from 'path';

function fail(msg) {
  console.error(`CI VERIFY FAILED: ${msg}`);
  process.exit(1);
}

// 1) Verify required envs exist at build time
const requiredEnv = [
  'VITE_AUTH0_DOMAIN',
  'VITE_AUTH0_CLIENT_ID',
  'VITE_API_URL',
  'VITE_API_AUDIENCE',
  'VITE_STRIPE_PUBLIC_KEY'
];

const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  fail(`Missing required env vars: ${missing.join(', ')}`);
}

// 2) Ensure the axios fetch adapter is not present in the final bundle
const distDir = resolve(process.cwd(), 'dist', 'assets');
if (!existsSync(distDir)) {
  // Not built yet; skip and let build step run first
  console.log('dist/assets not found; skipping axios bundle check. Run after build.');
  process.exit(0);
}

const files = readdirSync(distDir).filter((f) => f.endsWith('.js'));
let foundFetchAdapter = false;
for (const f of files) {
  const p = resolve(distDir, f);
  const content = readFileSync(p, 'utf8');
  if (content.includes('axios/lib/adapters/fetch') || content.includes('globalFetchAPI') || content.includes('utils.global') || content.includes('Unknown host:')) {
    foundFetchAdapter = true;
    console.error(`Found suspicious axios fetch adapter references in ${f}`);
  }
}

if (foundFetchAdapter) {
  fail('Axios fetch adapter detected in production bundle. Ensure aliases and runtime shim are applied.');
}

console.log('CI verify passed.');


