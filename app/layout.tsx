import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://orkiosk.com'),
  title: {
    default: 'Orkiosk | Quioscos de Autoservicio Inteligentes',
    template: '%s | Orkiosk',
  },
  description: 'Quioscos de autoservicio inteligentes con software, hardware y analítica en tiempo real. Reduce tiempos de espera, integra pagos y optimiza tu negocio.',
  keywords: [
    'quiosco',
    'quiosco de autoservicio',
    'kiosco',
    'self-service kiosk',
    'punto de venta',
    'POS',
    'restaurante',
    'autoservicio',
    'digital signage',
    'pantallas interactivas',
    'software para restaurantes',
    'hardware POS',
    'analitica en tiempo real',
    'Puerto Rico',
    'San Juan',
    'Estados Unidos',
  ],
  authors: [{ name: 'Orkiosk', url: 'https://orkiosk.com' }],
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
  verification: {
    google: 'O0m_4qa7yRXMIwDe5yUjCW9YlmWRcb1yHfcviJ6QRGY',
  },
  openGraph: {
    type: 'website',
    locale: 'es_PR',
    url: 'https://orkiosk.com',
    siteName: 'Orkiosk',
    title: 'Orkiosk | Quioscos de Autoservicio Inteligentes',
    description: 'Quioscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
    images: [
      {
        url: 'https://orkiosk.com/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Orkiosk - Quioscos de Autoservicio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orkiosk | Quioscos de Autoservicio Inteligentes',
    description: 'Quioscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
    images: ['https://orkiosk.com/images/logo.png'],
    creator: '@orkiosk',
  },
  alternates: {
    canonical: 'https://orkiosk.com',
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
        <meta charSet="utf-8" />
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://orkiosk.com" />

        {/* JSON-LD Schema for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Orkiosk',
              url: 'https://orkiosk.com',
              logo: 'https://orkiosk.com/images/logo.png',
              description: 'Quioscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
              foundingDate: '2020',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PR',
                addressRegion: 'PR',
                addressLocality: 'San Juan',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-877-799-3720',
                contactType: 'customer service',
                availableLanguage: 'Spanish',
              },
              sameAs: [
                'https://www.facebook.com/orkiosk',
                'https://www.instagram.com/orkiosk',
                'https://www.youtube.com/@orkiosk',
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
              url: 'https://orkiosk.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://orkiosk.com/blog?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
