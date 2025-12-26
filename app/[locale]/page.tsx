import type { Metadata } from 'next'
import { getRecentPosts } from '@/lib/posts'
import { getTranslations, locales, type Locale, translatePost } from '@/lib/i18n'
import SiteShell from '@/components/SiteShell'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import BlogPreview from '@/components/BlogPreview'
import Contact from '@/components/Contact'

interface PageProps {
  params: { locale: Locale }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Revalidate the page every 60 seconds
export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const url = `https://orkiosk.com/${params.locale}`

  // SEO SUPER OPTIMIZATION
  // Goal: Dominate "Orkiosk" brand and "Self-Service Kiosk" keywords.
  const title = params.locale === 'en'
    ? 'Orkiosk - #1 Smart Self-Service Kiosks & Interactive POS'
    : 'Orkiosk - Líder en Quioscos de Autoservicio y POS Interactivos'

  const description = params.locale === 'en'
    ? 'Orkiosk transforms businesses with next-gen self-service kiosks, offering real-time analytics, integrated payments, and robust hardware. The smartest way to reduce wait times.'
    : 'Orkiosk transforma negocios con quioscos de autoservicio de última generación. Ofrecemos analítica en tiempo real, pagos integrados y hardware robusto. La forma inteligente de reducir filas.'

  return {
    title,
    description,
    keywords: [
      'Orkiosk',
      'Quioscos de Autoservicio',
      'Self-Service Kiosks',
      'Kioscos Interactivos',
      'Sistema POS Restaurantes',
      'Puerto Rico Technology',
      'Restaurant Automation',
      'Kioscos de Pago'
    ],
    alternates: {
      canonical: url,
      languages: {
        'es': 'https://orkiosk.com/es',
        'en': 'https://orkiosk.com/en',
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Orkiosk',
      images: [
        {
          url: 'https://orkiosk.com/images/og-home.jpg', // Ensure this exists or fallback to logo
          width: 1200,
          height: 630,
          alt: 'Orkiosk Intelligent Kiosks',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://orkiosk.com/images/og-home.jpg'],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const copy = await getTranslations(params.locale)
  const recentPosts = await getRecentPosts(3)
  const posts = await Promise.all(
    recentPosts.map((post) => translatePost(post, params.locale, false)),
  )

  return (
    <SiteShell locale={params.locale} copy={copy}>
      <Hero copy={copy.hero} />
      <Features copy={copy.features} locale={params.locale} />
      <BlogPreview posts={posts} copy={copy.blogPreview} locale={params.locale} />
      <Contact copy={copy.contact} />
    </SiteShell>
  )
}
