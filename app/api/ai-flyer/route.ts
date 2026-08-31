import { env } from 'cloudflare:workers';

const ACCEPTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const FALLBACK_FLYER_URL = 'https://catalogo-flyer-ai.luicredo.workers.dev';
const FALLBACK_FLYER_SECRET =
  '0900b56982a7c0f40d5bc8c2b6e1c1b8f97f4e5d725f56f519372edd5084fd2b';
const FALLBACK_ACCESS_CODE = 'MODA-4827';

type FlyerServiceBinding = {
  fetch(request: Request): Promise<Response>;
};

export async function POST(request: Request) {
  const flyerUrl = env.CLOUDFLARE_FLYER_URL || FALLBACK_FLYER_URL;
  const flyerSecret = env.CLOUDFLARE_FLYER_SECRET || FALLBACK_FLYER_SECRET;
  const accessCode = env.FLYER_ACCESS_CODE || FALLBACK_ACCESS_CODE;

  if (!sameSecret(request.headers.get('x-flyer-code'), accessCode)) {
    return Response.json({ error: 'invalid_access_code' }, { status: 401 });
  }

  try {
    const incoming = await request.formData();
    const prompt = String(incoming.get('prompt') || '').trim();

    if (!prompt || prompt.length > 1800) {
      return Response.json({ error: 'invalid_prompt' }, { status: 400 });
    }

    const outgoing = new FormData();
    outgoing.append('prompt', prompt);

    let imageCount = 0;

    for (let index = 0; index < 4; index += 1) {
      const image = incoming.get(`input_image_${index}`);

      if (!(image instanceof File)) continue;
      if (!ACCEPTED_TYPES.has(image.type) || image.size > 1_500_000) {
        return Response.json({ error: 'invalid_image' }, { status: 400 });
      }

      outgoing.append(
        `input_image_${imageCount}`,
        image,
        `reference-${imageCount}.${extensionFor(image.type)}`,
      );

      imageCount += 1;
    }

    if (!imageCount) {
      return Response.json({ error: 'image_required' }, { status: 400 });
    }

    const service = (env as typeof env & { FLYER_AI?: FlyerServiceBinding }).FLYER_AI;

    const target = service
      ? 'https://catalogo-flyer-ai/generate'
      : `${flyerUrl.replace(/\/$/, '')}/generate`;

    const flyerRequest = new Request(target, {
      method: 'POST',
      headers: { 'x-flyer-secret': flyerSecret },
      body: outgoing,
    });

    const response = service
      ? await service.fetch(flyerRequest)
      : await fetch(flyerRequest);

    const result = (await response.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    if (!response.ok) {
      return Response.json(
        { error: String(result.error || 'generation_failed') },
        { status: 502 },
      );
    }

    if (
      typeof result.image !== 'string' ||
      !result.image.startsWith('data:image/')
    ) {
      return Response.json({ error: 'empty_generation' }, { status: 502 });
    }

    return Response.json({ image: result.image });
  } catch {
    return Response.json({ error: 'generation_failed' }, { status: 502 });
  }
}

function extensionFor(type: string) {
  return type === 'image/jpeg' ? 'jpg' : type.split('/')[1];
}

function sameSecret(received: string | null, expected: string) {
  if (!received || received.length !== expected.length) return false;

  let different = 0;

  for (let index = 0; index < expected.length; index += 1) {
    different |= received.charCodeAt(index) ^ expected.charCodeAt(index);
  }

  return different === 0;
}
