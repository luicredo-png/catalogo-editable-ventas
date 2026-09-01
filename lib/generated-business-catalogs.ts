import type { TemplateProduct, TemplateStore } from "./catalog-templates";

export type GeneratedBusinessKey =
  | "comida-rapida"
  | "detalles-romanticos"
  | "zapatos-mujer"
  | "perfumeria"
  | "postres";

type GeneratedTemplate = {
  label: string;
  store: TemplateStore;
  products: TemplateProduct[];
};

const foodOptions = [
  { name: "Tamaño", values: ["Personal", "Mediano", "Grande"] },
  { name: "Combo", values: ["Solo producto", "Con papas", "Papas + bebida"] },
];
const giftOptions = [
  { name: "Presentación", values: ["Clásica", "Premium"] },
  { name: "Dedicatoria", values: ["Sin tarjeta", "Con tarjeta personalizada"] },
];
const shoeOptions = [
  { name: "Color", values: ["Como la foto", "Negro", "Nude"] },
  { name: "Talla", values: ["35", "36", "37", "38", "39", "40"] },
];
const perfumeOptions = [
  { name: "Tamaño", values: ["30 ml", "50 ml", "100 ml"] },
  { name: "Presentación", values: ["Perfume", "Perfume + caja de regalo"] },
];
const dessertOptions = [
  { name: "Tamaño", values: ["Personal", "Mediano", "Grande"] },
  { name: "Dedicatoria", values: ["Sin dedicatoria", "Con dedicatoria"] },
];

const product = (
  id: number,
  name: string,
  category: string,
  description: string,
  price: number,
  oldPrice: number,
  image: string,
  options: TemplateProduct["options"],
): TemplateProduct => ({
  id,
  name,
  category,
  description,
  price,
  oldPrice,
  image,
  options,
  active: true,
  whatsappMessage:
    "Hola, quiero pedir {producto}.\n{opciones}\nPrecio: S/ {precio}",
});

export const generatedBusinessTemplates: Record<
  GeneratedBusinessKey,
  GeneratedTemplate
> = {
  "comida-rapida": {
    label: "Comida rápida",
    store: {
      name: "CRUNCH",
      whatsapp: "51999999999",
      slug: "comida-rapida",
      accent: "#ffcf24",
      backgroundColor: "#180807",
      backgroundImage: "",
      fontFamily: "Trebuchet MS",
      catalogTitle: "ANTOJOS SIN ESPERA",
      logoUrl: "",
    },
    products: [
      product(201, "Hamburguesa Doble", "HAMBURGUESAS", "Doble carne, cheddar, vegetales frescos y pan brioche", 24.9, 29.9, "/api/media/asset-public-f2d47cc7-2d7a-45f4-b959-7069c704260c.webp", foodOptions),
      product(202, "Pollo Broaster", "POLLO", "Pollo dorado y crocante con salsa cremosa", 22.9, 26.9, "/api/media/asset-public-dc0db878-be53-4c99-9f41-6d2b11925f32.webp", foodOptions),
      product(203, "Salchipapa Especial", "PIQUEOS", "Papas doradas, salchicha y selección de salsas", 18.9, 22.9, "/api/media/asset-public-a492e4f4-d4c3-4b20-b7a2-e4ab4f4ea249.webp", foodOptions),
      product(204, "Pizza Pepperoni", "PIZZAS", "Masa artesanal, mozzarella y abundante pepperoni", 34.9, 39.9, "/api/media/asset-public-96765299-8090-4c3f-b271-b781442ecbc4.webp", foodOptions),
      product(205, "Hot Dog Supreme", "SÁNDWICHES", "Salchicha parrillera, cebolla crocante y salsas", 15.9, 18.9, "/api/media/asset-public-7ad13592-e4d5-4202-a7bd-3d20d543787f.webp", foodOptions),
      product(206, "Alitas BBQ", "ALITAS", "Alitas glaseadas en salsa BBQ con acabado ahumado", 27.9, 32.9, "/api/media/asset-public-216a4ec2-1645-4e97-ba1c-11144fdb9328.webp", foodOptions),
      product(207, "Sándwich Crispy", "SÁNDWICHES", "Pollo extra crocante, vegetales y salsa de la casa", 21.9, 25.9, "/api/media/asset-public-74f9249f-6fb2-42fe-9b61-5544f1ebcc4a.webp", foodOptions),
      product(208, "Papas Loaded", "PIQUEOS", "Papas, cheddar, tocino, cebollín y salsa cremosa", 19.9, 23.9, "/api/media/asset-public-012f942c-ae8e-4f30-8e2d-c701a6a594c2.webp", foodOptions),
    ],
  },
  "detalles-romanticos": {
    label: "Detalles románticos",
    store: {
      name: "AMOR & DETALLES",
      whatsapp: "51999999999",
      slug: "detalles-romanticos",
      accent: "#ee668d",
      backgroundColor: "#2b101c",
      backgroundImage: "",
      fontFamily: "Georgia",
      catalogTitle: "DETALLES QUE ENAMORAN",
      logoUrl: "",
    },
    products: [
      product(701, "Ramo de Rosas", "RAMOS", "Rosas rojas y rosadas con envoltura premium", 89, 109, "/api/media/asset-public-752b985f-8209-4d93-8768-8f0938139ff8.webp", giftOptions),
      product(702, "Corazón de Chocolates", "CHOCOLATES", "Selección de chocolates artesanales en caja corazón", 55, 69, "/api/media/asset-public-cf6c2b5c-a9b6-480f-b86e-36178557456c.webp", giftOptions),
      product(703, "Desayuno Sorpresa", "SORPRESAS", "Desayuno completo con flores y presentación especial", 79, 95, "/api/media/asset-public-1810b99a-eeb8-441d-bc4f-8f85f9809879.webp", giftOptions),
      product(704, "Osito con Corazón", "PELUCHES", "Peluche suave con corazón y rosa decorativa", 45, 55, "/api/media/asset-public-2ec0d48c-a4dc-44ae-9cdf-52381ef11e2f.webp", giftOptions),
      product(705, "Globos de Corazón", "GLOBOS", "Arreglo de globos rojos, rosados y rose gold", 59, 72, "/api/media/asset-public-e6f6a355-6fd3-43f6-85cb-a3afca7247b9.webp", giftOptions),
      product(706, "Caja Premium de Rosas", "ROSAS", "Rosas frescas en caja elegante con lazo satinado", 99, 119, "/api/media/asset-public-30e58b9a-a569-42f8-8acd-e3a4843b6c4f.webp", giftOptions),
      product(707, "Canasta Spa", "SPA", "Set de autocuidado con vela, sales y detalles florales", 85, 105, "/api/media/asset-public-62e0a3d0-1935-4d93-b121-de7ea5920d6c.webp", giftOptions),
      product(708, "Regalo de Aniversario", "ANIVERSARIO", "Rosas, chocolates, vela y recuerdo en presentación premium", 129, 155, "/api/media/asset-public-1f719500-77de-436a-97d7-3cbd5f671bfe.webp", giftOptions),
    ],
  },
  "zapatos-mujer": {
    label: "Zapatos para mujer",
    store: {
      name: "LUNA SHOES",
      whatsapp: "51999999999",
      slug: "zapatos-mujer",
      accent: "#d9a09c",
      backgroundColor: "#1d1018",
      backgroundImage: "",
      fontFamily: "Inter",
      catalogTitle: "PASOS CON ESTILO",
      logoUrl: "",
    },
    products: [
      product(601, "Tacón Negro Gala", "TACONES", "Punta fina, silueta elegante y acabado premium", 139, 169, "/api/media/asset-public-7b654ad7-6df1-4c60-88de-bd631ac3032c.webp", shoeOptions),
      product(602, "Sneaker Blanco Chic", "ZAPATILLAS", "Diseño limpio, suela ligera y comodidad diaria", 119, 149, "/api/media/asset-public-8888ae68-845a-496b-9341-d16a0e626fab.webp", shoeOptions),
      product(603, "Botín Camel Urban", "BOTINES", "Cuero camel, tacón medio y costuras refinadas", 159, 195, "/api/media/asset-public-410896bd-e00b-4b71-b5c1-62acc2d9301d.webp", shoeOptions),
      product(604, "Sandalia Dorada Glow", "SANDALIAS", "Tiras delicadas y brillo metálico para ocasiones especiales", 129, 159, "/api/media/asset-public-c2af5e04-2315-4e70-bbb0-37a59eef7848.webp", shoeOptions),
      product(605, "Mocasín Burgundy", "MOCASINES", "Cuero pulido, herraje elegante y tacón bajo", 109, 135, "/api/media/asset-public-55bbf804-3c88-480b-9b6b-f6108cbe69bb.webp", shoeOptions),
      product(606, "Balerina Nude", "BALERINAS", "Punta redondeada, lazo delicado y ajuste suave", 89, 109, "/api/media/asset-public-abdb5143-29d8-4f2a-9c3e-cda49aa8484b.webp", shoeOptions),
      product(607, "Plataforma Negra", "PLATAFORMAS", "Tiras anchas y plataforma cómoda de estilo moderno", 129, 159, "/api/media/asset-public-4f236331-fc37-406d-81ce-bc4a9fcbd626.webp", shoeOptions),
      product(608, "Bota Alta Noir", "BOTAS", "Bota alta de cuero con silueta estilizada", 189, 229, "/api/media/asset-public-6f003842-d020-4e5b-b452-e4921fae36ee.webp", shoeOptions),
    ],
  },
  perfumeria: {
    label: "Perfumería",
    store: {
      name: "ÉCLAT",
      whatsapp: "51999999999",
      slug: "perfumeria",
      accent: "#78aef8",
      backgroundColor: "#06101e",
      backgroundImage: "",
      fontFamily: "Georgia",
      catalogTitle: "FRAGANCIAS QUE DEJAN HUELLA",
      logoUrl: "",
    },
    products: [
      product(801, "Essence Floral", "FLORALES", "Aroma de rosas suaves con fondo almizclado", 149, 179, "/api/media/asset-public-9cd7ed8e-54b9-479f-96de-2d39fdac5e98.webp", perfumeOptions),
      product(802, "Citrus Lumière", "CÍTRICOS", "Notas luminosas de limón, neroli y flores blancas", 139, 169, "/api/media/asset-public-c0f00e20-b8d6-495f-84f3-ea8e9e95cf19.webp", perfumeOptions),
      product(803, "Ambre Oriental", "ORIENTALES", "Ámbar cálido, resinas y un toque especiado", 179, 215, "/api/media/asset-public-73e3237e-9039-494c-ba0d-32899dbf2ece.webp", perfumeOptions),
      product(804, "Bleu Frais", "FRESCOS", "Acordes acuáticos y florales de sensación limpia", 159, 189, "/api/media/asset-public-82ae076f-56d6-4539-bec0-6eb5d00878a5.webp", perfumeOptions),
      product(805, "Vanille Douce", "DULCES", "Vainilla cremosa y flores suaves de larga duración", 149, 179, "/api/media/asset-public-d3d544bb-6fdf-467f-ab09-846e5affc920.webp", perfumeOptions),
      product(806, "Bois Intense", "AMADERADOS", "Cedro oscuro, vetiver y ámbar sofisticado", 189, 225, "/api/media/asset-public-42db0514-1da0-4ca8-adfd-d91c2fe637da.webp", perfumeOptions),
      product(807, "Rouge Fruit", "FRUTALES", "Frutos rojos, granada y pétalos aterciopelados", 145, 175, "/api/media/asset-public-b22bf6ed-e3f5-42ed-a33b-34a588904eb4.webp", perfumeOptions),
      product(808, "Aqua Cristal", "ACUÁTICOS", "Aroma transparente, limpio y refrescante", 139, 169, "/api/media/asset-public-746a8e5f-1bb9-4f79-8779-a4f6a9d64fac.webp", perfumeOptions),
    ],
  },
  postres: {
    label: "Postres",
    store: {
      name: "DULCE MOMENTO",
      whatsapp: "51999999999",
      slug: "postres",
      accent: "#e7829e",
      backgroundColor: "#291619",
      backgroundImage: "",
      fontFamily: "Georgia",
      catalogTitle: "POSTRES PARA CELEBRAR",
      logoUrl: "",
    },
    products: [
      product(901, "Torta de Chocolate", "TORTAS", "Capas de chocolate intenso con ganache brillante", 65, 78, "/api/media/asset-public-17762621-4326-47ac-9119-f2f4054b4c05.webp", dessertOptions),
      product(902, "Cheesecake de Frutos Rojos", "CHEESECAKES", "Cheesecake cremoso con frutos rojos y salsa artesanal", 55, 65, "/api/media/asset-public-47ff7b2f-a7fa-46f4-b177-904888e552ff.webp", dessertOptions),
      product(903, "Cupcakes Surtidos", "CUPCAKES", "Vainilla y chocolate con cremas y frutos frescos", 36, 44, "/api/media/asset-public-63357b96-bd04-4eca-8d47-9c1b50f1f653.webp", dessertOptions),
      product(904, "Tres Leches", "TORTAS", "Bizcocho húmedo, crema suave, canela y fresa", 42, 50, "/api/media/asset-public-fc765e96-06db-46b4-b67f-62a9cfec5ce2.webp", dessertOptions),
      product(905, "Brownies Fudge", "BROWNIES", "Brownies intensos con centro húmedo y chocolate", 30, 36, "/api/media/asset-public-b90d094b-4d79-4004-858e-9235599cc7f3.webp", dessertOptions),
      product(906, "Donas Artesanales", "DONAS", "Glaseados de chocolate, frutos rojos y vainilla", 28, 34, "/api/media/asset-public-f7767e38-91c2-41f6-a2f1-e1c919e3a044.webp", dessertOptions),
      product(907, "Macarons Franceses", "MACARONS", "Surtido delicado de pistacho, frutos rojos y chocolate", 38, 46, "/api/media/asset-public-0bb783f6-b0fe-4310-b44d-b16fd0634406.webp", dessertOptions),
      product(908, "Tartaleta de Frutas", "TARTALETAS", "Crema de vainilla y frutas frescas sobre masa crocante", 58, 69, "/api/media/asset-public-4281d302-5de5-4b3e-b478-a8acddd80fd2.webp", dessertOptions),
    ],
  },
};

export const generatedBusinessHeroDefaults: Record<
  GeneratedBusinessKey,
  {
    heroImage: string;
    heroEyebrow: string;
    heroDescription: string;
    heroHighlight: string;
    heroCtaLabel: string;
  }
> = {
  "comida-rapida": {
    heroImage: "/api/media/asset-public-aa76dd70-009a-40f0-a309-6cfce437fc8d.webp|||/api/media/asset-public-f2d47cc7-2d7a-45f4-b959-7069c704260c.webp|||/api/media/asset-public-96765299-8090-4c3f-b271-b781442ecbc4.webp|||/api/media/asset-public-74f9249f-6fb2-42fe-9b61-5544f1ebcc4a.webp|||/api/media/asset-public-c057888d-962f-4623-997e-306d4d0568c9.mp4",
    heroEyebrow: "ANTOJO DEL DÍA",
    heroDescription: "Combos irresistibles, listos para pedir sin esperar.",
    heroHighlight: "RÁPIDO Y DELICIOSO",
    heroCtaLabel: "Ver el menú",
  },
  "detalles-romanticos": {
    heroImage: "/api/media/asset-public-a9999ed5-7af7-4e42-8932-7edaef40a893.webp|||/api/media/asset-public-752b985f-8209-4d93-8768-8f0938139ff8.webp|||/api/media/asset-public-2ec0d48c-a4dc-44ae-9cdf-52381ef11e2f.webp|||/api/media/asset-public-62e0a3d0-1935-4d93-b121-de7ea5920d6c.webp|||/api/media/asset-public-9a0e8689-d19e-4220-9b33-fb7b78757ced.mp4",
    heroEyebrow: "SORPRESAS CON AMOR",
    heroDescription: "Regalos preparados para celebrar momentos inolvidables.",
    heroHighlight: "HECHO PARA EMOCIONAR",
    heroCtaLabel: "Ver detalles",
  },
  "zapatos-mujer": {
    heroImage: "/api/media/asset-public-259ecf77-64cd-4fe2-bb21-d175334d86f5.webp|||/api/media/asset-public-7b654ad7-6df1-4c60-88de-bd631ac3032c.webp|||/api/media/asset-public-c2af5e04-2315-4e70-bbb0-37a59eef7848.webp|||/api/media/asset-public-4f236331-fc37-406d-81ce-bc4a9fcbd626.webp|||/api/media/asset-public-c1460bc4-0371-4306-bcaf-b6f1efa6366f.mp4",
    heroEyebrow: "NUEVA COLECCIÓN",
    heroDescription: "Tacones, zapatillas, botines y sandalias para cada estilo.",
    heroHighlight: "CAMINA CON ESTILO",
    heroCtaLabel: "Ver zapatos",
  },
  perfumeria: {
    heroImage: "/api/media/asset-public-4d4d06e6-9962-43dd-8a2d-24fd2497905a.webp|||/api/media/asset-public-9cd7ed8e-54b9-479f-96de-2d39fdac5e98.webp|||/api/media/asset-public-82ae076f-56d6-4539-bec0-6eb5d00878a5.webp|||/api/media/asset-public-b22bf6ed-e3f5-42ed-a33b-34a588904eb4.webp|||/api/media/asset-public-1a2d1bac-917b-4412-99aa-76df664acc9a.mp4",
    heroEyebrow: "AROMAS INOLVIDABLES",
    heroDescription: "Encuentra la fragancia que expresa tu personalidad.",
    heroHighlight: "TU ESENCIA, TU FIRMA",
    heroCtaLabel: "Descubrir fragancias",
  },
  postres: {
    heroImage: "/api/media/asset-public-aa1a4afa-4985-46a3-b1d9-1b9412800844.webp|||/api/media/asset-public-17762621-4326-47ac-9119-f2f4054b4c05.webp|||/api/media/asset-public-fc765e96-06db-46b4-b67f-62a9cfec5ce2.webp|||/api/media/asset-public-0bb783f6-b0fe-4310-b44d-b16fd0634406.webp|||/api/media/asset-public-47b75864-2b70-4509-be07-8a398c60a050.mp4",
    heroEyebrow: "RECIÉN PREPARADOS",
    heroDescription: "Postres artesanales para compartir, regalar y celebrar.",
    heroHighlight: "UN MOMENTO MÁS DULCE",
    heroCtaLabel: "Ver postres",
  },
};

export function isGeneratedBusinessKey(
  key: string,
): key is GeneratedBusinessKey {
  return key in generatedBusinessTemplates;
}
