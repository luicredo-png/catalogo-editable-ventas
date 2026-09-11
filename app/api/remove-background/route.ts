import { env } from "cloudflare:workers";
import { authorize, privateError } from "@/lib/admin-auth";

const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function POST(request: Request) {
  const admin = await authorize(request, env);
  if (admin instanceof Response) return admin;

  const apiKey = String(env.PHOTOROOM_API_KEY || "").trim();
  if (!apiKey) return privateError(503, "photoroom_not_configured");

  try {
    const incoming = await request.formData();
    const image = incoming.get("image_file");
    if (
      !(image instanceof File) ||
      !ACCEPTED_TYPES.has(image.type) ||
      image.size > 30_000_000
    ) {
      return privateError(400, "invalid_image");
    }

    const outgoing = new FormData();
    outgoing.append("image_file", image, image.name || "producto.jpg");
    outgoing.append("format", "png");
    outgoing.append("channels", "rgba");
    outgoing.append("size", "full");

    const response = await fetch("https://sdk.photoroom.com/v1/segment", {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: outgoing,
    });
    if (!response.ok) {
      console.error("photoroom_cutout_failed", response.status);
      return privateError(
        response.status === 402 || response.status === 429 ? 429 : 502,
        response.status === 402 || response.status === 429
          ? "photoroom_limit_reached"
          : "cutout_failed",
      );
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("photoroom_proxy_failed", error);
    return privateError(502, "cutout_failed");
  }
}
