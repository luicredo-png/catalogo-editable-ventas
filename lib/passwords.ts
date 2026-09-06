import { randomBytes, scrypt, timingSafeEqual, createHmac } from 'node:crypto';
const cost = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
function derive(password: string, salt: string): Promise<Buffer> { return new Promise((resolve, reject) => scrypt(password, salt, 32, cost, (error, key) => error ? reject(error) : resolve(key))); }
const pbkdf2Iterations = 210000;
const encoder = new TextEncoder();
const toHex = (value: ArrayBuffer | Uint8Array) => Array.from(value instanceof Uint8Array ? value : new Uint8Array(value), (byte) => byte.toString(16).padStart(2, '0')).join('');
async function derivePbkdf2(password: string, salt: Uint8Array, iterations: number) {
 const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
 return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}
export async function hashPassword(password: string) {
 if (password.length < 12 || password.length > 128) throw new Error('password_length');
 const salt = crypto.getRandomValues(new Uint8Array(16));
 return `pbkdf2-v1$${pbkdf2Iterations}$${toHex(salt)}$${toHex(await derivePbkdf2(password, salt, pbkdf2Iterations))}`;
}
export async function verifyPassword(password: string, encoded: string) {
 if (password.length > 128) return false;
 const modern = encoded.match(/^pbkdf2-v1\$(\d{6})\$([a-f0-9]{32})\$([a-f0-9]{64})$/);
 if (modern) {
  const iterations = Number(modern[1]);
  if (iterations < 100000 || iterations > 600000) return false;
  return timingSafeEqual(Buffer.from(await derivePbkdf2(password, Buffer.from(modern[2], 'hex'), iterations)), Buffer.from(modern[3], 'hex'));
 }
 if (!/^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{64}$/.test(encoded)) return false;
 const [, salt, value] = encoded.split('$');
 return timingSafeEqual(await derive(password, salt), Buffer.from(value, 'hex'));
}
export const randomSession = () => randomBytes(32).toString('hex');
export const sessionDigest = (token: string, secret: string) => createHmac('sha256', secret).update(token).digest('hex');
