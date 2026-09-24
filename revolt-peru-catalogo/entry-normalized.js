import app from "./index.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Static assets must bypass the application router when worker-first is enabled.
    if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/assets/") || url.pathname === "/live-catalog.js" || url.pathname === "/favicon.svg" || url.pathname === "/manifest.webmanifest") {
      return env.ASSETS.fetch(request);
    }
    // Serve the same catalog shell for gender routes without redirecting to `/`.
    // The live client reads the preserved pathname and applies the correct filter.
    if (url.pathname === "/mujer" || url.pathname === "/hombre") {
      const shell = await env.ASSETS.fetch(new Request(new URL("/", request.url)));
      const headers = new Headers(shell.headers);
      headers.set("content-type", "text/html; charset=UTF-8");
      headers.set("cache-control", "no-store");
      return new Response(shell.body, { status: shell.status, headers });
    }
    const response = await app.fetch(request, env, ctx);
    if (response.headers.get("content-type")) return response;
    const headers = new Headers(response.headers);
    const path = new URL(request.url).pathname;
    if (path === "/admin" || path === "/" || path.endsWith(".html")) {
      headers.set("content-type", "text/html; charset=UTF-8");
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
