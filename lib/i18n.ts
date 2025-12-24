import { translateStrings } from './translate'
import type { Post } from './posts'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export const baseCopy = {
  header: {
    nav: [
      { name: 'Inicio', href: '/' },
      { name: 'Beneficios', href: '/#benefits' },
      { name: 'Blog', href: '/blog' },
      { name: 'Client Portal', href: 'https://orkiosk.com/admin/', external: true },
      { name: 'Contacto', href: '/#contact' },
    ],
    ctaLabel: 'Agendar Demo',
    aria: {
      navLabel: 'Navegaci?n principal',
      openMenu: 'Abrir men?',
      closeMenu: 'Cerrar men?',
    },
  },
  hero: {
    badge: 'Tecnolog?a de vanguardia',
    heading: 'Quioscos de Autoservicio Inteligentes',
    subheading:
      'Transforma la experiencia de tus clientes con quioscos de autoservicio que reducen tiempos de espera, integran pagos y ofrecen anal?tica en tiempo real.',
    ctaPrimary: 'Agendar Demo Gratuita',
    ctaSecondary: 'Ver Beneficios',
    trustPrimary: '99.9% Uptime Garantizado',
    trustSecondary: 'Anal?tica en Tiempo Real',
  },
  features: {
    label: 'Beneficios',
    title: '?Qu? hace Orkiosk por tu negocio?',
    subtitle:
      'Una soluci?n completa que combina hardware, software y anal?tica para transformar la experiencia de autoservicio en tu establecimiento.',
    items: [
      {
        name: 'Reducci?n de Tiempos de Espera',
        description:
          'Optimiza el flujo de clientes con un proceso de autoservicio r?pido e intuitivo que reduce significativamente los tiempos de espera en caja.',
      },
      {
        name: 'Pagos Integrados',
        description:
          'Acepta m?ltiples m?todos de pago incluyendo tarjetas de cr?dito, d?bito, transferencias y efectivo con nuestras integraciones POS.',
      },
      {
        name: 'Anal?tica en Tiempo Real',
        description:
          'Monitorea ventas, productos populares y comportamiento de clientes con dashboards interactivos y reportes detallados.',
      },
      {
        name: 'Sistema Seguro y Estable',
        description:
          'Infraestructura robusta con respaldo autom?tico y protecci?n de datos para garantizar la continuidad de tu negocio.',
      },
      {
        name: 'Impresora de Recibo',
        description:
          'Impresi?n r?pida y clara de recibos con personalizaci?n de ticket para incluir promociones e informaci?n de tu marca.',
      },
      {
        name: 'Experiencia Intuitiva',
        description:
          'Interfaz de usuario dise?ada para una experiencia fluida que tus clientes dominar?n desde el primer uso.',
      },
    ],
    ctaPrompt: '?Quieres conocer m?s sobre nuestras funcionalidades?',
    ctaButton: 'Habla con un Asesor',
  },
  blogPreview: {
    label: 'Blog',
    title: '?ltimos Art?culos',
    subtitle:
      'Descubre consejos, tendencias y novedades sobre optimizaci?n de negocios, transformaci?n digital y tecnolog?a de autoservicio.',
    readMore: 'Leer m?s',
    emptyMessage: 'No hay art?culos publicados a?n.',
    emptyButton: 'Crear Primer Art?culo',
    viewAll: 'Ver Todos los Art?culos',
  },
  blogPage: {
    title: 'Blog',
    description:
      'Descubre consejos, tendencias y novedades sobre optimizaci?n de negocios, transformaci?n digital y tecnolog?a de autoservicio.',
    heroTitle: 'Blog de Orkiosk',
    heroSubtitle:
      'Descubre consejos, tendencias y novedades sobre optimizaci?n de negocios, transformaci?n digital y tecnolog?a de autoservicio.',
    readMore: 'Leer m?s',
    emptyMessage: 'No hay art?culos publicados a?n.',
    emptyButton: 'Crear Primer Art?culo',
    ctaTitle: '?Quieres estar actualizado?',
    ctaBody:
      'Suscr?bete a nuestro bolet?n y recibe las ?ltimas noticias sobre tecnolog?a y optimizaci?n de negocios.',
    ctaButton: 'Cont?ctanos',
  },
  blogPost: {
    sharePrompt: '?Te gust? este art?culo? Comp?rtelo con otros',
    shareX: 'Compartir en X',
    shareFacebook: 'Compartir en Facebook',
    shareLinkedIn: 'Compartir en LinkedIn',
    shareWhatsapp: 'Compartir en WhatsApp',
    recommendedTitle: 'Publicaciones recomendadas',
  },
  contact: {
    label: 'Contacto',
    title: '?Interesado en nuestros quioscos?',
    subtitle:
      'Cont?ctanos para agendar una demo personalizada y descubrir c?mo Orkiosk puede transformar la experiencia de autoservicio en tu negocio.',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    locationLabel: 'Ubicaci?n',
    locationValue: 'San Juan, Puerto Rico',
    successTitle: '?Mensaje Enviado!',
    successBody:
      'Gracias por tu inter?s. Nos pondremos en contacto contigo dentro de las pr?ximas 24 horas.',
    successButton: 'Enviar Otro Mensaje',
    form: {
      nameLabel: 'Nombre completo *',
      companyLabel: 'Empresa',
      emailLabel: 'Email *',
      phoneLabel: 'Tel?fono',
      messageLabel: 'Mensaje *',
      namePlaceholder: 'Juan P?rez',
      companyPlaceholder: 'Tu Empresa',
      emailPlaceholder: 'juan@empresa.com',
      phonePlaceholder: '+1-787-123-4567',
      messagePlaceholder:
        'Cu?ntanos sobre tu negocio y c?mo podemos ayudarte...',
      submitIdle: 'Enviar Mensaje',
      submitLoading: 'Enviando...',
      error: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.',
    },
  },
  footer: {
    description:
      'Quioscos de autoservicio inteligentes con software, hardware y anal?tica en tiempo real para optimizar tu negocio.',
    navigationTitle: 'Navegaci?n',
    companyTitle: 'Empresa',
    legalTitle: 'Legal',
    copyright:
      '(c) {year} Orkiosk. Todos los derechos reservados. Hecho con amor en Puerto Rico.',
    ariaSocial: 'S?guenos en {name}',
    nav: {
      main: [
        { name: 'Inicio', href: '/' },
        { name: 'Beneficios', href: '/#benefits' },
        { name: 'Blog', href: '/blog' },
        { name: 'Client Portal', href: 'https://orkiosk.com/admin/', external: true },
        { name: 'Contacto', href: '/#contact' },
      ],
      company: [
        { name: 'Sobre Nosotros', href: '/#about' },
        { name: 'Productos', href: '/#products' },
        { name: 'Integraciones', href: '/#integrations' },
      ],
      legal: [
        { name: 'Pol?tica de Privacidad', href: '/privacy' },
        { name: 'T?rminos y Condiciones', href: '/terms' },
      ],
    },
  },
}

export type Translations = typeof baseCopy

const copyCache = new Map<Locale, Promise<Translations>>()

function collectStrings(
  value: unknown,
  paths: Array<(string | number)[]> = [],
  path: (string | number)[] = [],
  strings: string[] = [],
) {
  if (typeof value === 'string') {
    paths.push(path)
    strings.push(value)
    return { paths, strings }
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, paths, [...path, index], strings))
    return { paths, strings }
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, val]) => {
      if (key === 'href') {
        return
      }
      collectStrings(val, paths, [...path, key], strings)
    })
  }
  return { paths, strings }
}
function setValue(target: Record<string, unknown>, path: (string | number)[], value: string) {
  let ref: any = target
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i]
    if (ref && typeof ref === 'object') {
      ref = ref[key]
    }
  }
  const lastKey = path[path.length - 1]
  if (ref && typeof ref === 'object') {
    ref[lastKey] = value
  }
}

export async function getTranslations(locale: Locale): Promise<Translations> {
  if (locale === 'es') {
    return baseCopy
  }
  if (copyCache.has(locale)) {
    return copyCache.get(locale) as Promise<Translations>
  }

  const pending = (async () => {
    const copy = JSON.parse(JSON.stringify(baseCopy)) as Translations
    const { paths, strings } = collectStrings(copy)
    const translated = await translateStrings(strings, locale, 'es')
    translated.forEach((value, index) => {
      const path = paths[index]
      setValue(copy as unknown as Record<string, unknown>, path, value)
    })
    return copy
  })()

  copyCache.set(locale, pending)
  return pending
}

export async function translatePost(post: Post, locale: Locale, includeContent: boolean): Promise<Post> {
  if (locale === 'es') {
    return post
  }
  const fields = [post.title, post.excerpt, post.category ?? '']
  if (includeContent) {
    fields.push(post.content)
  }
  const [title, excerpt, category, content] = await translateStrings(fields, locale, 'es')
  return {
    ...post,
    title,
    excerpt,
    category: category || undefined,
    content: includeContent ? content ?? post.content : post.content,
  }
}

export function withLocale(locale: Locale, href: string): string {
  if (href.startsWith('http')) {
    return href
  }
  const normalized = href.startsWith('/') ? href : `/${href}`
  return `/${locale}${normalized}`
}
