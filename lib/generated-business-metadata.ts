import type { Metadata } from "next";

import {
  generatedBusinessHeroDefaults,
  generatedBusinessTemplates,
  type GeneratedBusinessKey,
} from "./generated-business-catalogs";

const origin = new URL("https://catalogo-editable-ventas.luicredo.workers.dev");

const descriptions: Record<GeneratedBusinessKey, string> = {
  "comida-rapida": "Combos, hamburguesas, pizzas y antojos listos para pedir directamente por WhatsApp.",
  "detalles-romanticos": "Regalos, flores y sorpresas premium para celebrar momentos inolvidables.",
  "zapatos-mujer": "Tacones, zapatillas, botines y sandalias para cada estilo. Compra directa por WhatsApp.",
  perfumeria: "Fragancias florales, cítricas, orientales y frescas para encontrar tu aroma ideal.",
  postres: "Tortas, cupcakes y postres artesanales preparados para compartir, regalar y celebrar.",
};

export function generatedBusinessMetadata(key: GeneratedBusinessKey): Metadata {
  const template = generatedBusinessTemplates[key];
  const hero = generatedBusinessHeroDefaults[key].heroImage
    .split("|||")
    .find((url) => !url.endsWith(".mp4"));
  const title = `${template.store.name} | ${template.store.catalogTitle}`;
  const description = descriptions[key];
  return {
    metadataBase: origin,
    title,
    description,
    alternates: { canonical: `/${key}` },
    openGraph: {
      type: "website",
      locale: "es_PE",
      url: `/${key}`,
      siteName: template.store.name,
      title,
      description,
      images: hero
        ? [{ url: hero, width: 720, height: 1280, alt: template.store.catalogTitle }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: hero ? [hero] : [],
    },
  };
}
