// Utility to obfuscate IDs in URLs using AES-GCM via Web Crypto
// Note: In a client-side app this is obfuscation, not true security.

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const BASE_ITERATIONS = 100000;
const IV_LENGTH = 12; // AES-GCM recommended IV length

let cachedKey: CryptoKey | null = null;

function getPassphrase(): string {
  // Public env var, fine for obfuscation
  return import.meta.env.VITE_URL_ID_KEY || 'resume-builder-urlid-key';
}

function getSalt(): Uint8Array {
  const saltString = import.meta.env.VITE_URL_ID_SALT || 'resume-builder-urlid-salt';
  return textEncoder.encode(saltString);
}

async function getKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  const passphrase = getPassphrase();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: getSalt(),
      iterations: BASE_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  cachedKey = key;
  return key;
}

function toBase64Url(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string): Uint8Array {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4;
  if (pad) base64 += '='.repeat(4 - pad);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function encodeId(plainId: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cipher = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    textEncoder.encode(plainId)
  );
  // Concatenate IV + cipher
  const combined = new Uint8Array(iv.length + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), iv.length);
  return toBase64Url(combined.buffer);
}

export async function decodeId(encoded: string): Promise<string> {
  try {
    const raw = fromBase64Url(encoded);
    const iv = raw.slice(0, IV_LENGTH);
    const cipher = raw.slice(IV_LENGTH);
    const key = await getKey();
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      cipher
    );
    return textDecoder.decode(plain);
  } catch (_) {
    // Fallback: if decode fails, return original string
    return encoded;
  }
}

