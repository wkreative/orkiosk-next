import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://orkioskweb.netlify.app'),
  title: {
    default: 'Orkiosk | Quiscos de Autoservicio Inteligentes',
    template: '%s | Orkiosk',
  },
  description: 'Quiscos de autoservicio inteligentes con software, hardware y analítica en tiempo real. Reduce tiempos de espera, integra pagos y optimiza tu negocio.',
  keywords: [
    'quisco',
    'quisco de autoservicio',
    'kiosko',
    'self-service kiosk',
    'punto de venta',
    'POS',
    'restaurante',
    'autoservicio',
    'digital signage',
    'pantallas interactivas',
    'software para restaurantes',
    'hardware POS',
    'analítica en tiempo real',
    'Colombia',
    'Bogotá',
  ],
  authors: [{ name: 'Orkiosk', url: 'https://orkioskweb.netlify.app' }],
  creator: 'Orkiosk',
  publisher: 'Orkiosk',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://orkioskweb.netlify.app',
    siteName: 'Orkiosk',
    title: 'Orkiosk | Quiscos de Autoservicio Inteligentes',
    description: 'Quiscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Orkiosk - Quiscos de Autoservicio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orkiosk | Quiscos de Autoservicio Inteligentes',
    description: 'Quiscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
    images: ['/images/og-image.jpg'],
    creator: '@orkiosk',
  },
  alternates: {
    canonical: 'https://orkioskweb.netlify.app',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://orkioskweb.netlify.app" />

        {/* JSON-LD Schema for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Orkiosk',
              url: 'https://orkioskweb.netlify.app',
              logo: 'https://orkioskweb.netlify.app/images/logo.png',
              description: 'Quiscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
              foundingDate: '2020',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'CO',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+57-300-000-0000',
                contactType: 'customer service',
                availableLanguage: 'Spanish',
              },
              sameAs: [
                'https://www.facebook.com/orkiosk',
                'https://www.instagram.com/orkiosk',
                'https://www.linkedin.com/company/orkiosk',
              ],
            }),
          }}
        />

        {/* JSON-LD Schema for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Orkiosk',
              url: 'https://orkioskweb.netlify.app',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://orkioskweb.netlify.app/blog?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
