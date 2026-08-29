const MODEL = "@cf/black-forest-labs/flux-2-klein-4b";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ ok: true, model: "flux-2-klein-4b" });
    }
    if (request.method !== "POST" || url.pathname !== "/generate") {
      return Response.json({ error: "not_found" }, { status: 404 });
    }
    if (!env.FLYER_SECRET || !sameSecret(request.headers.get("x-flyer-secret"), env.FLYER_SECRET)) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    try {
      const incoming = await request.formData();
      const prompt = String(incoming.get("prompt") || "").trim();
      if (!prompt || prompt.length > 1800) {
        return Response.json({ error: "invalid_prompt" }, { status: 400 });
      }

      const form = new FormData();
      form.append("prompt", prompt);
      form.append("width", "1024");
      form.append("height", "1280");
      form.append("guidance", "4");

      let imageCount = 0;
      for (let index = 0; index < 4; index += 1) {
        const image = incoming.get(`input_image_${index}`);
        if (!(image instanceof File)) continue;
        if (!/^image\/(png|jpeg|webp)$/.test(image.type) || image.size > 1_500_000) {
          return Response.json({ error: "invalid_image" }, { status: 400 });
        }
        form.append(`input_image_${imageCount}`, image, `reference-${imageCount}.${extensionFor(image.type)}`);
        imageCount += 1;
      }
      if (!imageCount) return Response.json({ error: "image_required" }, { status: 400 });

      const serialized = new Response(form);
      const result = await env.AI.run(MODEL, {
        multipart: {
          body: serialized.body,
          contentType: serialized.headers.get("content-type") || "multipart/form-data",
        },
      });
      const image = result && typeof result === "object" && "image" in result ? result.image : null;
      if (typeof image !== "string" || !image) {
        return Response.json({ error: "empty_generation" }, { status: 502 });
      }
      return Response.json({ image: `data:image/png;base64,${image}` });
    } catch (error) {
      console.error("flyer_generation_failed", error);
      return Response.json({ error: "generation_failed" }, { status: 502 });
    }
  },
};

function extensionFor(type) {
  return type === "image/jpeg" ? "jpg" : type.split("/")[1];
}

function sameSecret(received, expected) {
  if (!received || received.length !== expected.length) return false;
  let different = 0;
  for (let index = 0; index < expected.length; index += 1) {
    different |= received.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return different === 0;
}
