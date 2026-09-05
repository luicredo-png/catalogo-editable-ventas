import { randomBytes, scrypt, timingSafeEqual, createHmac } from 'node:crypto';
const cost = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
function derive(password: string, salt: string): Promise<Buffer> { return new Promise((resolve, reject) => scrypt(password, salt, 32, cost, (error, key) => error ? reject(error) : resolve(key))); }
export async function hashPassword(password: string) { if (password.length < 12 || password.length > 128) throw new Error('password_length'); const salt = randomBytes(16).toString('hex'); return 'scrypt-v1$' + salt + '$' + (await derive(password, salt)).toString('hex'); }
export async function verifyPassword(password: string, encoded: string) { if (!/^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{64}$/.test(encoded) || password.length > 128) return false; const [, salt, value] = encoded.split('$'); return timingSafeEqual(await derive(password, salt), Buffer.from(value, 'hex')); }
export const randomSession = () => randomBytes(32).toString('hex');
export const sessionDigest = (token: string, secret: string) => createHmac('sha256', secret).update(token).digest('hex');
