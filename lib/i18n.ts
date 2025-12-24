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
      navLabel: 'Navegación principal',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
    },
  },
  hero: {
    badge: 'Tecnología de vanguardia',
    heading: 'Quioscos de Autoservicio Inteligentes',
    subheading:
      'Transforma la experiencia de tus clientes con quioscos de autoservicio que reducen tiempos de espera, integran pagos y ofrecen analítica en tiempo real.',
    ctaPrimary: 'Agendar Demo Gratuita',
    ctaSecondary: 'Ver Beneficios',
    trustPrimary: '99.9% Uptime Garantizado',
    trustSecondary: 'Analítica en Tiempo Real',
  },
  features: {
    label: 'Beneficios',
    title: '¿Qué hace Orkiosk por tu negocio?',
    subtitle:
      'Una solución completa que combina hardware, software y analítica para transformar la experiencia de autoservicio en tu establecimiento.',
    items: [
      {
        name: 'Reducción de Tiempos de Espera',
        description:
          'Optimiza el flujo de clientes con un proceso de autoservicio rápido e intuitivo que reduce significativamente los tiempos de espera en caja.',
      },
      {
        name: 'Pagos Integrados',
        description:
          'Acepta múltiples métodos de pago incluyendo tarjetas de crédito, débito, transferencias y efectivo con nuestras integraciones POS.',
      },
      {
        name: 'Analítica en Tiempo Real',
        description:
          'Monitorea ventas, productos populares y comportamiento de clientes con dashboards interactivos y reportes detallados.',
      },
      {
        name: 'Sistema Seguro y Estable',
        description:
          'Infraestructura robusta con respaldo automático y protección de datos para garantizar la continuidad de tu negocio.',
      },
      {
        name: 'Impresora de Recibo',
        description:
          'Impresión rápida y clara de recibos con personalización de ticket para incluir promociones e información de tu marca.',
      },
      {
        name: 'Experiencia Intuitiva',
        description:
          'Interfaz de usuario diseñada para una experiencia fluida que tus clientes dominarán desde el primer uso.',
      },
    ],
    ctaPrompt: '¿Quieres conocer más sobre nuestras funcionalidades?',
    ctaButton: 'Habla con un Asesor',
  },
  blogPreview: {
    label: 'Blog',
    title: 'Últimos Artículos',
    subtitle:
      'Descubre consejos, tendencias y novedades sobre optimización de negocios, transformación digital y tecnología de autoservicio.',
    readMore: 'Leer más',
    emptyMessage: 'No hay artículos publicados aún.',
    emptyButton: 'Crear Primer Artículo',
    viewAll: 'Ver Todos los Artículos',
  },
  blogPage: {
    title: 'Blog',
    description:
      'Descubre consejos, tendencias y novedades sobre optimización de negocios, transformación digital y tecnología de autoservicio.',
    heroTitle: 'Blog de Orkiosk',
    heroSubtitle:
      'Descubre consejos, tendencias y novedades sobre optimización de negocios, transformación digital y tecnología de autoservicio.',
    readMore: 'Leer más',
    emptyMessage: 'No hay artículos publicados aún.',
    emptyButton: 'Crear Primer Artículo',
    ctaTitle: '¿Quieres estar actualizado?',
    ctaBody:
      'Suscríbete a nuestro boletín y recibe las últimas noticias sobre tecnología y optimización de negocios.',
    ctaButton: 'Contáctanos',
  },
  blogPost: {
    sharePrompt: '¿Te gustó este artículo? Compártelo con otros',
    shareX: 'Compartir en X',
    shareFacebook: 'Compartir en Facebook',
    shareLinkedIn: 'Compartir en LinkedIn',
    shareWhatsapp: 'Compartir en WhatsApp',
    recommendedTitle: 'Publicaciones recomendadas',
  },
  contact: {
    label: 'Contacto',
    title: '¿Interesado en nuestros quioscos?',
    subtitle:
      'Contáctanos para agendar una demo personalizada y descubrir cómo Orkiosk puede transformar la experiencia de autoservicio en tu negocio.',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    locationLabel: 'Ubicación',
    locationValue: 'San Juan, Puerto Rico',
    successTitle: '¡Mensaje Enviado!',
    successBody:
      'Gracias por tu interés. Nos pondremos en contacto contigo dentro de las próximas 24 horas.',
    successButton: 'Enviar Otro Mensaje',
    form: {
      nameLabel: 'Nombre completo *',
      companyLabel: 'Empresa',
      emailLabel: 'Email *',
      phoneLabel: 'Teléfono',
      messageLabel: 'Mensaje *',
      namePlaceholder: 'Juan Pérez',
      companyPlaceholder: 'Tu Empresa',
      emailPlaceholder: 'juan@empresa.com',
      phonePlaceholder: '+1-787-123-4567',
      messagePlaceholder:
        'Cuéntanos sobre tu negocio y cómo podemos ayudarte...',
      submitIdle: 'Enviar Mensaje',
      submitLoading: 'Enviando...',
      error: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.',
    },
  },
  footer: {
    description:
      'Quioscos de autoservicio inteligentes con software, hardware y analítica en tiempo real para optimizar tu negocio.',
    navigationTitle: 'Navegación',
    companyTitle: 'Empresa',
    legalTitle: 'Legal',
    copyright:
      '(c) {year} Orkiosk. Todos los derechos reservados. Hecho con ❤️ en Puerto Rico.',
    ariaSocial: 'Síguenos en {name}',
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
        { name: 'Política de Privacidad', href: '/privacy' },
        { name: 'Términos y Condiciones', href: '/terms' },
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
