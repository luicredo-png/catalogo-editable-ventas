export type LandingItem={icon:string;title:string;description:string};
export type AccountingLanding={
 brand:string;logoImage:string;whatsapp:string;topNotice:string;brochureLabel:string;
 bodyFont:string;headingFont:string;heroSize:number;headingSize:number;bodySize:number;
 heroEyebrow:string;heroTitle:string;heroDescription:string;heroButton:string;heroImage:string;heroTextEffect:'classic'|'dia';headerLayout:'compact'|'logo-first';
 pillars:LandingItem[];
 aboutTitle:string;aboutText:string;aboutImage:string;experienceValue:string;experienceLabel:string;
 approachTitle:string;approachText:string;approachImage:string;approachPoints:LandingItem[];
 servicesTitle:string;servicesIntro:string;services:LandingItem[];
 whyTitle:string;whyText:string;whyImage:string;reasons:LandingItem[];
 ctaTitle:string;ctaText:string;ctaButton:string;ctaImage:string;
 address:string;phone:string;email:string;instagram:string;facebook:string;tiktokUrl:string;locationUrl:string;clientLogos:string[];showClientMarquee:boolean;
};

export const accountingIconKeys=['ledger','chart','growth','shield','balance','people','briefcase','target','folder','calculator','check','building'];

export const defaultAccountingLanding:AccountingLanding={
 brand:'FORCH LAU',logoImage:'/forchlu-logo-premium.webp',whatsapp:'51999999999',
 bodyFont:'outfit',headingFont:'space',heroSize:100,headingSize:100,bodySize:100,
 topNotice:'Decisiones claras empiezan con números bien ordenados.',brochureLabel:'SOLICITAR PRESENTACIÓN',
 heroEyebrow:'ESTUDIO CONTABLE · LIMA',heroTitle:'Transformamos tu contabilidad en una herramienta estratégica',heroDescription:'Acompañamos a empresas y emprendedores con servicios contables, tributarios y financieros que convierten la información en mejores decisiones.',heroButton:'AGENDA UNA CONSULTA',heroImage:'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=84',heroTextEffect:'classic',headerLayout:'compact',
 pillars:[
  {icon:'ledger',title:'Planificación contable',description:'Orden y control para tu operación.'},
  {icon:'chart',title:'Información para decidir',description:'Reportes claros y oportunos.'},
  {icon:'growth',title:'Crecimiento con respaldo',description:'Estrategia financiera sostenible.'}
 ],
 aboutTitle:'Relaciones que fortalecen negocios',aboutText:'El verdadero valor está en acompañar de cerca. Más que procesar información, construimos una alianza con respuestas claras, criterio profesional y atención constante.',aboutImage:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=84',experienceValue:'15+',experienceLabel:'Años de experiencia',
 approachTitle:'Pensamiento claro, resultados sólidos',approachText:'La claridad financiera es la base de decisiones empresariales inteligentes. Integramos contabilidad, tributación y análisis para darte una visión completa del negocio.',approachImage:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=84',approachPoints:[
  {icon:'check',title:'Historial comprobado',description:'Experiencia acompañando empresas de distintos sectores.'},
  {icon:'target',title:'Enfoque orientado a resultados',description:'Diagnósticos y estrategias que se convierten en acciones.'},
  {icon:'people',title:'Socios estratégicos, no solo asesores',description:'Entendemos tu operación antes de recomendar.'}
 ],
 servicesTitle:'Tu aliado contable y empresarial',servicesIntro:'Soluciones diseñadas para ordenar, proteger e impulsar tu negocio.',services:[
  {icon:'calculator',title:'Outsourcing contable',description:'Gestión contable completa con información actualizada.'},
  {icon:'briefcase',title:'Consultoría de negocios',description:'Análisis para decisiones comerciales y financieras.'},
  {icon:'chart',title:'Auditoría contable y financiera',description:'Revisiones que fortalecen transparencia y sostenibilidad.'},
  {icon:'balance',title:'Asesoría tributaria',description:'Prevención de riesgos y cumplimiento oportuno.'},
  {icon:'growth',title:'Planeamiento financiero',description:'Proyecciones y control para un crecimiento saludable.'},
  {icon:'folder',title:'Gestión laboral y societaria',description:'Soporte en planillas, contratos y trámites empresariales.'}
 ],
 whyTitle:'¿Por qué elegirnos?',whyText:'Cada empresa es única. Diseñamos una atención cercana que combina experiencia, flexibilidad y una mirada práctica de los resultados.',whyImage:'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=84',reasons:[
  {icon:'target',title:'Soluciones personalizadas',description:'Estrategias alineadas a tu industria y tamaño.'},
  {icon:'growth',title:'Enfoque en resultados',description:'Información que impulsa decisiones rentables.'},
  {icon:'shield',title:'Experiencia y respaldo',description:'Procesos confiables para operar con tranquilidad.'},
  {icon:'people',title:'Atención cercana',description:'Comunicación directa y acompañamiento constante.'}
 ],
 ctaTitle:'Es momento de impulsar tu negocio',ctaText:'Conversemos sobre tus necesidades y encuentra una estrategia contable diseñada para tu realidad.',ctaButton:'SOLICITA ASESORÍA',ctaImage:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=84',
 address:'Av. Principal 123 · San Isidro, Lima',phone:'(+51) 999 999 999',email:'contacto@nexocontable.pe',instagram:'',facebook:'',tiktokUrl:'',locationUrl:'',clientLogos:[],showClientMarquee:true
};

function text(value:unknown,fallback:string,max=500){return typeof value==='string'?value.slice(0,max):fallback}
const fontKeys=['outfit','space','inter','playfair','oswald','cinzel'];
function font(value:unknown,fallback:string){return typeof value==='string'&&fontKeys.includes(value)?value:fallback}
function percent(value:unknown,fallback:number,min:number,max:number){const number=Number(value);return Number.isFinite(number)?Math.max(min,Math.min(max,Math.round(number))):fallback}
function items(value:unknown,fallback:LandingItem[],max:number){if(!Array.isArray(value))return fallback;return value.slice(0,max).map((item,index)=>{const base=fallback[index]||fallback[0];const raw=item&&typeof item==='object'?item as Record<string,unknown>:{};return{icon:accountingIconKeys.includes(String(raw.icon))?String(raw.icon):base.icon,title:text(raw.title,base.title,100),description:text(raw.description,base.description,240)}})}
export function normalizeAccountingLanding(value:unknown):AccountingLanding{
 const raw=value&&typeof value==='object'?value as Record<string,unknown>:{};const d={...defaultAccountingLanding,apachTitle:defaultAccountingLanding.approachTitle};
 return{brand:text(raw.brand,d.brand,80),logoImage:text(raw.logoImage,d.logoImage,900),whatsapp:text(raw.whatsapp,d.whatsapp,24),bodyFont:font(raw.bodyFont,d.bodyFont),headingFont:font(raw.headingFont,d.headingFont),heroSize:percent(raw.heroSize,d.heroSize,70,130),headingSize:percent(raw.headingSize,d.headingSize,75,130),bodySize:percent(raw.bodySize,d.bodySize,80,130),topNotice:text(raw.topNotice,d.topNotice,160),brochureLabel:text(raw.brochureLabel,d.brochureLabel,60),heroEyebrow:text(raw.heroEyebrow,d.heroEyebrow,80),heroTitle:text(raw.heroTitle,d.heroTitle,180),heroDescription:text(raw.heroDescription,d.heroDescription,380),heroButton:text(raw.heroButton,d.heroButton,60),heroImage:text(raw.heroImage,d.heroImage,900),heroTextEffect:raw.heroTextEffect==='dia'?'dia':'classic',headerLayout:raw.headerLayout==='logo-first'?'logo-first':'compact',pillars:items(raw.pillars,d.pillars,3),aboutTitle:text(raw.aboutTitle,d.aboutTitle,140),aboutText:text(raw.aboutText,d.aboutText,700),aboutImage:text(raw.aboutImage,d.aboutImage,900),experienceValue:text(raw.experienceValue,d.experienceValue,20),experienceLabel:text(raw.experienceLabel,d.experienceLabel,60),approachTitle:text(raw.approachTitle,d.apachTitle,140),approachText:text(raw.approachText,d.approachText,700),approachImage:text(raw.approachImage,d.approachImage,900),approachPoints:items(raw.approachPoints,d.approachPoints,3),servicesTitle:text(raw.servicesTitle,d.servicesTitle,140),servicesIntro:text(raw.servicesIntro,d.servicesIntro,300),services:items(raw.services,d.services,6),whyTitle:text(raw.whyTitle,d.whyTitle,120),whyText:text(raw.whyText,d.whyText,600),whyImage:text(raw.whyImage,d.whyImage,900),reasons:items(raw.reasons,d.reasons,4),ctaTitle:text(raw.ctaTitle,d.ctaTitle,140),ctaText:text(raw.ctaText,d.ctaText,360),ctaButton:text(raw.ctaButton,d.ctaButton,60),ctaImage:text(raw.ctaImage,d.ctaImage,900),address:text(raw.address,d.address,180),phone:text(raw.phone,d.phone,40),email:text(raw.email,d.email,120),instagram:text(raw.instagram,d.instagram,500),facebook:text(raw.facebook,d.facebook,500),tiktokUrl:text(raw.tiktokUrl,d.tiktokUrl,500),locationUrl:text(raw.locationUrl,d.locationUrl,500),clientLogos:Array.isArray(raw.clientLogos)?raw.clientLogos.filter((value):value is string=>typeof value==='string').slice(0,20).map(value=>value.slice(0,900)):[],showClientMarquee:raw.showClientMarquee!==false}
}
