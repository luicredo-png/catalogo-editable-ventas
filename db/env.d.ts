declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    FILES: R2Bucket;
    CLOUDFLARE_FLYER_URL: string;
    CLOUDFLARE_FLYER_SECRET: string;
    FLYER_ACCESS_CODE: string;
  }
}
