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
      product(201, "Hamburguesa Doble", "HAMBURGUESAS", "Doble carne, cheddar, vegetales frescos y pan brioche", 24.9, 29.9, "/api/media/asset-public-94655763-b696-4a31-a942-d20e36f1f21d.png", foodOptions),
      product(202, "Pollo Broaster", "POLLO", "Pollo dorado y crocante con salsa cremosa", 22.9, 26.9, "/api/media/asset-public-b90c4b63-6e48-4899-b59f-545a7e21b1b0.png", foodOptions),
      product(203, "Salchipapa Especial", "PIQUEOS", "Papas doradas, salchicha y selección de salsas", 18.9, 22.9, "/api/media/asset-public-7bf3b152-b2db-47f1-a9ba-7b7553c1621d.png", foodOptions),
      product(204, "Pizza Pepperoni", "PIZZAS", "Masa artesanal, mozzarella y abundante pepperoni", 34.9, 39.9, "/api/media/asset-public-ca406182-2b14-4fe6-9b00-4f39244d7b2b.png", foodOptions),
      product(205, "Hot Dog Supreme", "SÁNDWICHES", "Salchicha parrillera, cebolla crocante y salsas", 15.9, 18.9, "/api/media/asset-public-fd915498-cb13-496e-8492-3407122c9fb4.png", foodOptions),
      product(206, "Alitas BBQ", "ALITAS", "Alitas glaseadas en salsa BBQ con acabado ahumado", 27.9, 32.9, "/api/media/asset-public-169eee96-7952-4bf0-834e-6281dad8e3b9.png", foodOptions),
      product(207, "Sándwich Crispy", "SÁNDWICHES", "Pollo extra crocante, vegetales y salsa de la casa", 21.9, 25.9, "/api/media/asset-public-a60df949-1caf-4a5e-8529-1b55cb59981e.png", foodOptions),
      product(208, "Papas Loaded", "PIQUEOS", "Papas, cheddar, tocino, cebollín y salsa cremosa", 19.9, 23.9, "/api/media/asset-public-24773d3d-0765-4e37-a517-9038a9555328.png", foodOptions),
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
      product(701, "Ramo de Rosas", "RAMOS", "Rosas rojas y rosadas con envoltura premium", 89, 109, "/api/media/asset-public-d5d0fc4e-54dd-4730-8d1a-177a8c9a482b.png", giftOptions),
      product(702, "Corazón de Chocolates", "CHOCOLATES", "Selección de chocolates artesanales en caja corazón", 55, 69, "/api/media/asset-public-98e5913e-0fd7-498e-9562-f79a549af546.png", giftOptions),
      product(703, "Desayuno Sorpresa", "SORPRESAS", "Desayuno completo con flores y presentación especial", 79, 95, "/api/media/asset-public-c1657d7a-5bff-4c55-8ed5-74813ccb9bec.png", giftOptions),
      product(704, "Osito con Corazón", "PELUCHES", "Peluche suave con corazón y rosa decorativa", 45, 55, "/api/media/asset-public-94468907-ffa6-4b1c-908f-e123ef0a0778.png", giftOptions),
      product(705, "Globos de Corazón", "GLOBOS", "Arreglo de globos rojos, rosados y rose gold", 59, 72, "/api/media/asset-public-67edfa55-fb73-412c-95f5-aed94572bf7c.png", giftOptions),
      product(706, "Caja Premium de Rosas", "ROSAS", "Rosas frescas en caja elegante con lazo satinado", 99, 119, "/api/media/asset-public-4619105b-a53f-45b4-bbd5-d41cfbde11aa.png", giftOptions),
      product(707, "Canasta Spa", "SPA", "Set de autocuidado con vela, sales y detalles florales", 85, 105, "/api/media/asset-public-06bd7fe6-4fd0-4222-8b61-44171c582ed5.png", giftOptions),
      product(708, "Regalo de Aniversario", "ANIVERSARIO", "Rosas, chocolates, vela y recuerdo en presentación premium", 129, 155, "/api/media/asset-public-5b531807-91d9-412c-929e-3e90d89fb3bc.png", giftOptions),
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
      product(601, "Tacón Negro Gala", "TACONES", "Punta fina, silueta elegante y acabado premium", 139, 169, "/api/media/asset-public-e8f4f884-d374-4b31-9ca5-0de37186ac3c.png", shoeOptions),
      product(602, "Sneaker Blanco Chic", "ZAPATILLAS", "Diseño limpio, suela ligera y comodidad diaria", 119, 149, "/api/media/asset-public-64bbb81e-b755-4cfa-b3ff-e584ba19181f.png", shoeOptions),
      product(603, "Botín Camel Urban", "BOTINES", "Cuero camel, tacón medio y costuras refinadas", 159, 195, "/api/media/asset-public-33487c2c-675e-44bf-9850-d26fdacfbc7b.png", shoeOptions),
      product(604, "Sandalia Dorada Glow", "SANDALIAS", "Tiras delicadas y brillo metálico para ocasiones especiales", 129, 159, "/api/media/asset-public-42e573d2-eaa5-46ee-aad2-549be4f30bf5.png", shoeOptions),
      product(605, "Mocasín Burgundy", "MOCASINES", "Cuero pulido, herraje elegante y tacón bajo", 109, 135, "/api/media/asset-public-4a620c27-9bb0-4b86-aa79-a1146108d73c.png", shoeOptions),
      product(606, "Balerina Nude", "BALERINAS", "Punta redondeada, lazo delicado y ajuste suave", 89, 109, "/api/media/asset-public-4bbd975c-9e6b-47a3-bba9-b38a53450cd7.png", shoeOptions),
      product(607, "Plataforma Negra", "PLATAFORMAS", "Tiras anchas y plataforma cómoda de estilo moderno", 129, 159, "/api/media/asset-public-e014bcde-ce6a-4a23-8daf-fe5792f61a60.png", shoeOptions),
      product(608, "Bota Alta Noir", "BOTAS", "Bota alta de cuero con silueta estilizada", 189, 229, "/api/media/asset-public-7a715e76-77ac-4d47-ae0a-3177c10e8ed5.png", shoeOptions),
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
      product(801, "Essence Floral", "FLORALES", "Aroma de rosas suaves con fondo almizclado", 149, 179, "/api/media/asset-public-b8c15f02-2855-4cd6-ac54-a5c61f463897.png", perfumeOptions),
      product(802, "Citrus Lumière", "CÍTRICOS", "Notas luminosas de limón, neroli y flores blancas", 139, 169, "/api/media/asset-public-5fb2a20a-029f-4e77-af94-30a1f36b603e.png", perfumeOptions),
      product(803, "Ambre Oriental", "ORIENTALES", "Ámbar cálido, resinas y un toque especiado", 179, 215, "/api/media/asset-public-283b2807-94df-48c4-bff4-7e7f8a529931.png", perfumeOptions),
      product(804, "Bleu Frais", "FRESCOS", "Acordes acuáticos y florales de sensación limpia", 159, 189, "/api/media/asset-public-39c92357-a89b-487a-95f4-686ee906db85.png", perfumeOptions),
      product(805, "Vanille Douce", "DULCES", "Vainilla cremosa y flores suaves de larga duración", 149, 179, "/api/media/asset-public-bb0c0aca-c726-4405-8bb9-5797da69a6e8.png", perfumeOptions),
      product(806, "Bois Intense", "AMADERADOS", "Cedro oscuro, vetiver y ámbar sofisticado", 189, 225, "/api/media/asset-public-0710e0c9-bbc4-4d56-adfe-567822cdf099.png", perfumeOptions),
      product(807, "Rouge Fruit", "FRUTALES", "Frutos rojos, granada y pétalos aterciopelados", 145, 175, "/api/media/asset-public-aba9a329-983b-4f7a-b8e6-2216f082ad96.png", perfumeOptions),
      product(808, "Aqua Cristal", "ACUÁTICOS", "Aroma transparente, limpio y refrescante", 139, 169, "/api/media/asset-public-8c2a1db3-25d4-4e5d-97fb-f99d3373bbf1.png", perfumeOptions),
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
      product(901, "Torta de Chocolate", "TORTAS", "Capas de chocolate intenso con ganache brillante", 65, 78, "/api/media/asset-public-4debf36f-ae62-40b1-8fc9-0ed26eaece3b.png", dessertOptions),
      product(902, "Cheesecake de Frutos Rojos", "CHEESECAKES", "Cheesecake cremoso con frutos rojos y salsa artesanal", 55, 65, "/api/media/asset-public-24cdcb7a-0494-4f03-993d-1a282226520b.png", dessertOptions),
      product(903, "Cupcakes Surtidos", "CUPCAKES", "Vainilla y chocolate con cremas y frutos frescos", 36, 44, "/api/media/asset-public-f54b8ca9-9f8f-4817-a1a4-942d74596a74.png", dessertOptions),
      product(904, "Tres Leches", "TORTAS", "Bizcocho húmedo, crema suave, canela y fresa", 42, 50, "/api/media/asset-public-a2ec3574-9287-4ce4-9ba0-cb5d27b9f68b.png", dessertOptions),
      product(905, "Brownies Fudge", "BROWNIES", "Brownies intensos con centro húmedo y chocolate", 30, 36, "/api/media/asset-public-588af874-7c0b-43c4-9a5e-930c1d0e55f1.png", dessertOptions),
      product(906, "Donas Artesanales", "DONAS", "Glaseados de chocolate, frutos rojos y vainilla", 28, 34, "/api/media/asset-public-3a028470-85ec-4139-a479-a0b62ba0fff4.png", dessertOptions),
      product(907, "Macarons Franceses", "MACARONS", "Surtido delicado de pistacho, frutos rojos y chocolate", 38, 46, "/api/media/asset-public-437034f4-0631-4bb3-93cc-665cf6de3a83.png", dessertOptions),
      product(908, "Tartaleta de Frutas", "TARTALETAS", "Crema de vainilla y frutas frescas sobre masa crocante", 58, 69, "/api/media/asset-public-ae54e838-ab7f-467c-931e-30a9d3f87ef9.png", dessertOptions),
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
    heroImage: "/api/media/asset-public-cb099910-0339-451d-b52a-4cfb150a08c6.png|||/api/media/asset-public-94655763-b696-4a31-a942-d20e36f1f21d.png|||/api/media/asset-public-ca406182-2b14-4fe6-9b00-4f39244d7b2b.png|||/api/media/asset-public-a60df949-1caf-4a5e-8529-1b55cb59981e.png|||/api/media/asset-public-c057888d-962f-4623-997e-306d4d0568c9.mp4",
    heroEyebrow: "ANTOJO DEL DÍA",
    heroDescription: "Combos irresistibles, listos para pedir sin esperar.",
    heroHighlight: "RÁPIDO Y DELICIOSO",
    heroCtaLabel: "Ver el menú",
  },
  "detalles-romanticos": {
    heroImage: "/api/media/asset-public-49f2c97f-fe4f-4559-8a45-056335b4bba9.png|||/api/media/asset-public-d5d0fc4e-54dd-4730-8d1a-177a8c9a482b.png|||/api/media/asset-public-94468907-ffa6-4b1c-908f-e123ef0a0778.png|||/api/media/asset-public-06bd7fe6-4fd0-4222-8b61-44171c582ed5.png|||/api/media/asset-public-9a0e8689-d19e-4220-9b33-fb7b78757ced.mp4",
    heroEyebrow: "SORPRESAS CON AMOR",
    heroDescription: "Regalos preparados para celebrar momentos inolvidables.",
    heroHighlight: "HECHO PARA EMOCIONAR",
    heroCtaLabel: "Ver detalles",
  },
  "zapatos-mujer": {
    heroImage: "/api/media/asset-public-ebf1373f-b3ad-4da4-a50c-cf7a0adacfa7.png|||/api/media/asset-public-e8f4f884-d374-4b31-9ca5-0de37186ac3c.png|||/api/media/asset-public-42e573d2-eaa5-46ee-aad2-549be4f30bf5.png|||/api/media/asset-public-e014bcde-ce6a-4a23-8daf-fe5792f61a60.png|||/api/media/asset-public-c1460bc4-0371-4306-bcaf-b6f1efa6366f.mp4",
    heroEyebrow: "NUEVA COLECCIÓN",
    heroDescription: "Tacones, zapatillas, botines y sandalias para cada estilo.",
    heroHighlight: "CAMINA CON ESTILO",
    heroCtaLabel: "Ver zapatos",
  },
  perfumeria: {
    heroImage: "/api/media/asset-public-126ad922-ca11-4082-be2c-fc389e0ee80b.png|||/api/media/asset-public-b8c15f02-2855-4cd6-ac54-a5c61f463897.png|||/api/media/asset-public-39c92357-a89b-487a-95f4-686ee906db85.png|||/api/media/asset-public-aba9a329-983b-4f7a-b8e6-2216f082ad96.png|||/api/media/asset-public-1a2d1bac-917b-4412-99aa-76df664acc9a.mp4",
    heroEyebrow: "AROMAS INOLVIDABLES",
    heroDescription: "Encuentra la fragancia que expresa tu personalidad.",
    heroHighlight: "TU ESENCIA, TU FIRMA",
    heroCtaLabel: "Descubrir fragancias",
  },
  postres: {
    heroImage: "/api/media/asset-public-6c4def82-4b5b-43a3-9487-4ad348441020.png|||/api/media/asset-public-4debf36f-ae62-40b1-8fc9-0ed26eaece3b.png|||/api/media/asset-public-a2ec3574-9287-4ce4-9ba0-cb5d27b9f68b.png|||/api/media/asset-public-437034f4-0631-4bb3-93cc-665cf6de3a83.png|||/api/media/asset-public-47b75864-2b70-4509-be07-8a398c60a050.mp4",
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

