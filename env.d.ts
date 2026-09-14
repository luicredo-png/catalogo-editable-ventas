declare namespace Cloudflare {
  interface Env {
    FILES: R2Bucket;
    DB: D1Database;
    AUTH_SECRET?: string;
    OWNER_EMAIL?: string;
    OWNER_PASSWORD_HASH?: string;
    PHOTOROOM_API_KEY?: string;
  }
}
