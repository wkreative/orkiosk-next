import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'

export type FooterLink = {
  name: string
  href: string
}

export type FooterCopy = {
  description: string
  navigationTitle: string
  companyTitle: string
  legalTitle: string
  copyright: string
  ariaSocial: string
  nav: {
    main: FooterLink[]
    company: FooterLink[]
    legal: FooterLink[]
  }
}

const defaultCopy: FooterCopy = {
  description:
    'Quioscos de autoservicio inteligentes con software, hardware y anal?tica en tiempo real para optimizar tu negocio.',
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
      { name: 'Contacto', href: '/#contact' },
    ],
    company: [
      { name: 'Sobre Nosotros', href: '/#about' },
      { name: 'Productos', href: '/#products' },
      { name: 'Integraciones', href: '/#integrations' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/terms-conditions-privacy-policy' },
      { name: 'Copyright', href: '/copyright' },
    ],
  },
}

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/orkiosk', icon: Facebook },
  { name: 'Instagram', href: 'https://instagram.com/orkiosk', icon: Instagram },
  {
    name: 'X',
    href: 'https://x.com/orkiosk',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  { name: 'YouTube', href: 'https://www.youtube.com/@orkiosk', icon: Youtube },
]

export default function Footer({ copy = defaultCopy, locale = 'es' }: { copy?: FooterCopy; locale?: string }) {
  const currentYear = new Date().getFullYear()
  const prefixHref = (href: string) => {
    if (href.startsWith('http')) {
      return href
    }
    return `/${locale}${href}`
  }

  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center mb-6" aria-label="Ir al inicio">
              <span className="font-logo text-lg md:text-xl tracking-tight text-white">
                Orkiosk
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              {copy.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="https://wa.me/18777993720"
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M16 3C9.383 3 4 8.383 4 15c0 2.348.737 4.643 2.117 6.56L4 29l7.622-2.078A12.92 12.92 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10a10.9 10.9 0 0 1-4.1-.8l-.6-.24-4.53 1.23 1.24-4.42-.27-.63A9.9 9.9 0 0 1 6 15c0-5.514 4.486-10 10-10zm-4.1 5.7c-.2 0-.4.08-.54.22-.46.46-1.2 1.24-1.2 2.5 0 1.26.92 2.48 1.05 2.66.13.18 1.79 2.87 4.34 3.92 2.14.9 2.58.72 3.05.67.46-.05 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.05-.1-.2-.16-.41-.26-.2-.1-1.2-.6-1.38-.67-.18-.07-.31-.1-.44.1-.13.2-.5.67-.62.8-.12.13-.23.15-.44.05-.2-.1-.86-.32-1.64-1.02-.6-.54-1-1.21-1.12-1.41-.12-.2-.01-.32.09-.42.1-.1.20-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.01-.35-.05-.1-.44-1.07-.6-1.47-.16-.38-.33-.33-.44-.33z"
                  />
                </svg>
                <span>+1-877-799-3720</span>
              </a>
              <a href="mailto:info@orkiosk.com" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@orkiosk.com</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>San Juan, Puerto Rico</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">{copy.navigationTitle}</h3>
            <ul className="space-y-3">
              {copy.nav.main.map((item) => (
                <li key={item.name}>
                  <Link href={prefixHref(item.href)} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">{copy.companyTitle}</h3>
            <ul className="space-y-3">
              {copy.nav.company.map((item) => (
                <li key={item.name}>
                  <Link href={prefixHref(item.href)} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">{copy.legalTitle}</h3>
            <ul className="space-y-3">
              {copy.nav.legal.map((item) => (
                <li key={item.name}>
                  <Link href={prefixHref(item.href)} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm text-center md:text-left">
              {copy.copyright.replace('{year}', String(currentYear))}
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={copy.ariaSocial.replace('{name}', item.name)}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}

              {/* Theme Toggle Divider */}
              <div className="w-px h-6 bg-gray-700 mx-1 hidden md:block" />

              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
