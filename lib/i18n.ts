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
    searchPlaceholder: 'Buscar artículos...',
    noResultsSearch: 'No se encontraron artículos con esa búsqueda.',
    noResultsCategory: 'No hay artículos en esta categoría.',
    viewAllLabel: 'Ver todos los artículos',
  },
  blogPost: {
    sharePrompt: '¿Te gustó este artículo? Compártelo con otros',
    shareX: 'Compartir en X',
    shareFacebook: 'Compartir en Facebook',
    shareLinkedIn: 'Compartir en LinkedIn',
    shareWhatsapp: 'Compartir en WhatsApp',
    recommendedTitle: 'Publicaciones recomendadas',
    commentsLabel: 'Comentarios',
    loadingComments: 'Cargando comentarios...',
    emptyComments: 'Sé el primero en comentar.',
    reply: 'Responder',
    deleteComment: 'Eliminar comentario (Admin)',
    deleteConfirm: '¿Estás seguro de que quieres eliminar este comentario?',
    deleteError: 'Error al eliminar el comentario.',
    justNow: 'Recién',
    form: {
      title: 'Deja un comentario',
      replyTitle: 'Responder',
      replyTo: 'Respondiendo a',
      cancel: 'Cancelar',
      nameLabel: 'Nombre',
      namePlaceholder: 'Tu nombre',
      contentLabel: 'Comentario',
      contentPlaceholder: 'Escribe tu opinión...',
      submit: 'Publicar Comentario',
      submitting: 'Publicando...',
      error: 'Hubo un error al publicar tu comentario. Inténtalo de nuevo.',
    },
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
      '© {year} Orkiosk. Todos los derechos reservados. Hecho con ❤️ en Puerto Rico.',
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

// Manual English translations
const enCopy: Translations = {
  header: {
    nav: [
      { name: 'Home', href: '/' },
      { name: 'Benefits', href: '/#benefits' },
      { name: 'Blog', href: '/blog' },
      { name: 'Client Portal', href: 'https://orkiosk.com/admin/', external: true },
      { name: 'Contact', href: '/#contact' },
    ],
    ctaLabel: 'Schedule Demo',
    aria: {
      navLabel: 'Main navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
    },
  },
  hero: {
    badge: 'Cutting-edge technology',
    heading: 'Smart Self-Service Kiosks',
    subheading:
      'Transform your customers experience with self-service kiosks that reduce wait times, integrate payments, and offer real-time analytics.',
    ctaPrimary: 'Schedule Free Demo',
    ctaSecondary: 'See Benefits',
    trustPrimary: '99.9% Uptime Guaranteed',
    trustSecondary: 'Real-Time Analytics',
  },
  features: {
    label: 'Benefits',
    title: 'What does Orkiosk do for your business?',
    subtitle:
      'A complete solution that combines hardware, software, and analytics to transform the self-service experience in your establishment.',
    items: [
      {
        name: 'Reduced Wait Times',
        description:
          'Optimize customer flow with a fast and intuitive self-service process that significantly reduces checkout wait times.',
      },
      {
        name: 'Integrated Payments',
        description:
          'Accept multiple payment methods including credit cards, debit cards, transfers, and cash with our POS integrations.',
      },
      {
        name: 'Real-Time Analytics',
        description:
          'Monitor sales, popular products, and customer behavior with interactive dashboards and detailed reports.',
      },
      {
        name: 'Secure and Stable System',
        description:
          'Robust infrastructure with automatic backup and data protection to ensure business continuity.',
      },
      {
        name: 'Receipt Printer',
        description:
          'Fast and clear receipt printing with ticket customization to include promotions and your brand information.',
      },
      {
        name: 'Intuitive Experience',
        description:
          'User interface designed for a smooth experience that your customers will master from the first use.',
      },
    ],
    ctaPrompt: 'Want to learn more about our features?',
    ctaButton: 'Talk to an Advisor',
  },
  blogPreview: {
    label: 'Blog',
    title: 'Latest Articles',
    subtitle:
      'Discover tips, trends, and news about business optimization, digital transformation, and self-service technology.',
    readMore: 'Read more',
    emptyMessage: 'No articles published yet.',
    emptyButton: 'Create First Article',
    viewAll: 'View All Articles',
  },
  blogPage: {
    title: 'Blog',
    description:
      'Blog about self-service technology, resource optimization, and the best practices to grow your business.',
    heroTitle: 'Orkiosk Blog',
    heroSubtitle:
      'Tips, trends, and news to optimize your business and stay up to date with self-service technology.',
    readMore: 'Read more',
    emptyMessage: 'No articles published yet.',
    emptyButton: 'Start Writing',
    ctaTitle: 'Ready to transform your business?',
    ctaBody: 'Schedule a personalized demo and discover how our kiosks can optimize your operations.',
    ctaButton: 'Schedule Demo',
    searchPlaceholder: 'Search articles...',
    noResultsSearch: 'No articles found with that search.',
    noResultsCategory: 'No articles in this category.',
    viewAllLabel: 'View all articles',
  },
  blogPost: {
    sharePrompt: 'Did you like this article? Share it with others',
    shareX: 'Share on X',
    shareFacebook: 'Share on Facebook',
    shareLinkedIn: 'Share on LinkedIn',
    shareWhatsapp: 'Share on WhatsApp',
    recommendedTitle: 'Recommended posts',
    commentsLabel: 'Comments',
    loadingComments: 'Loading comments...',
    emptyComments: 'Be the first to comment.',
    reply: 'Reply',
    deleteComment: 'Delete comment (Admin)',
    deleteConfirm: 'Are you sure you want to delete this comment?',
    deleteError: 'Error deleting comment.',
    justNow: 'Just now',
    form: {
      title: 'Leave a comment',
      replyTitle: 'Reply',
      replyTo: 'Replying to',
      cancel: 'Cancel',
      nameLabel: 'Name',
      namePlaceholder: 'Your name',
      contentLabel: 'Comment',
      contentPlaceholder: 'Write your opinion...',
      submit: 'Post Comment',
      submitting: 'Posting...',
      error: 'There was an error posting your comment. Please try again.',
    },
  },
  contact: {
    label: 'Contact',
    title: 'Interested in our kiosks?',
    subtitle:
      'Contact us to schedule a personalized demo and discover how Orkiosk can transform the self-service experience in your business.',
    whatsappLabel: 'WhatsApp',
    emailLabel: 'Email',
    locationLabel: 'Location',
    locationValue: 'San Juan, Puerto Rico',
    successTitle: 'Message Sent!',
    successBody:
      'Thank you for your interest. We will contact you within the next 24 hours.',
    successButton: 'Send Another Message',
    form: {
      nameLabel: 'Full name *',
      companyLabel: 'Company',
      emailLabel: 'Email *',
      phoneLabel: 'Phone',
      messageLabel: 'Message *',
      namePlaceholder: 'John Doe',
      companyPlaceholder: 'Your Company',
      emailPlaceholder: 'john@company.com',
      phonePlaceholder: '+1-787-123-4567',
      messagePlaceholder:
        'Tell us about your business and how we can help...',
      submitIdle: 'Send Message',
      submitLoading: 'Sending...',
      error: 'There was an error sending the message. Please try again.',
    },
  },
  footer: {
    description:
      'Smart self-service kiosks with software, hardware, and real-time analytics to optimize your business.',
    navigationTitle: 'Navigation',
    companyTitle: 'Company',
    legalTitle: 'Legal',
    copyright:
      '© {year} Orkiosk. All rights reserved. Made with ❤️ in Puerto Rico.',
    ariaSocial: 'Follow us on {name}',
    nav: {
      main: [
        { name: 'Home', href: '/' },
        { name: 'Benefits', href: '/#benefits' },
        { name: 'Blog', href: '/blog' },
        { name: 'Client Portal', href: 'https://orkiosk.com/admin/', external: true },
        { name: 'Contact', href: '/#contact' },
      ],
      company: [
        { name: 'About Us', href: '/#about' },
        { name: 'Products', href: '/#products' },
        { name: 'Integrations', href: '/#integrations' },
      ],
      legal: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms and Conditions', href: '/terms' },
      ],
    },
  },
}

export async function getTranslations(locale: Locale): Promise<Translations> {
  if (locale === 'en') {
    return enCopy
  }
  return baseCopy
}

export async function translatePost(post: Post, locale: Locale, includeContent: boolean): Promise<Post> {
  // Return Spanish post as-is
  if (locale === 'es') {
    return post
  }

  // For English, use manual translations if available, otherwise fallback to Spanish
  const category = post.categoryEn || post.category;

  // Normalize inconsistent categories (Temporary fix for data inconsistency)
  const normalizedCategory = category === 'Business Optimization and Growth'
    ? 'Business Optimization & Growth'
    : category;

  return {
    ...post,
    title: post.titleEn || post.title,
    excerpt: post.excerptEn || post.excerpt,
    category: normalizedCategory,
    content: includeContent ? (post.contentEn || post.content) : post.content,
    enableComments: post.enableComments,
  }
}

export function withLocale(locale: Locale, href: string): string {
  if (href.startsWith('http')) {
    return href
  }
  const normalized = href.startsWith('/') ? href : `/${href}`
  return `/${locale}${normalized}`
}
