'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

export type NavItem = {
  name: string
  href: string
  external?: boolean
}

export type HeaderCopy = {
  nav: NavItem[]
  ctaLabel: string
  homeHref?: string
  ctaHref?: string
  aria: {
    navLabel: string
    openMenu: string
    closeMenu: string
  }
}

const defaultCopy: HeaderCopy = {
  nav: [
    { name: 'Inicio', href: '/' },
    { name: 'Beneficios', href: '/#benefits' },
    { name: 'Blog', href: '/blog' },
    { name: 'Client Portal', href: 'https://orkiosk.com/admin/', external: true },
    { name: 'Contacto', href: '/#contact' },
  ],
  ctaLabel: 'Agendar Demo',
  homeHref: '/',
  ctaHref: '/#contact',
  aria: {
    navLabel: 'Navegaci?n principal',
    openMenu: 'Abrir men?',
    closeMenu: 'Cerrar men?',
  },
}

export default function Header({ copy = defaultCopy }: { copy?: HeaderCopy }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const [hash, setHash] = useState('')
  const pathname = usePathname() ?? '/'
  const segments = pathname.split('/').filter(Boolean)
  const currentLocale = segments[0] === 'en' ? 'en' : 'es'
  const restPath = segments[0] === 'en' || segments[0] === 'es'
    ? `/${segments.slice(1).join('/')}`
    : pathname

  const localeHref = (locale: 'es' | 'en') => {
    const suffix = restPath === '/' ? '' : restPath
    return `/${locale}${suffix}${hash}`
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setHash(window.location.hash)
  }, [pathname])

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLangOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 backdrop-blur-lg shadow-lg'
        : 'bg-transparent'
        }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label={copy.aria.navLabel}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={copy.homeHref ?? '/'} className="flex items-center group" aria-label="Ir al inicio">
            <span className="font-logo text-2xl md:text-3xl tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
              Orkiosk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {copy.nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 rounded-lg hover:bg-primary-50"
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Language Switcher */}
          <div ref={langRef} className="hidden md:flex items-center relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
              onClick={() => setIsLangOpen((open) => !open)}
              aria-expanded={isLangOpen}
              aria-haspopup="true"
            >
              <span>{currentLocale.toUpperCase()}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <Link
                  href={localeHref('es')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsLangOpen(false)}
                >
                  Español
                </Link>
                <Link
                  href={localeHref('en')}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsLangOpen(false)}
                >
                  English
                </Link>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href={copy.ctaHref ?? '/#contact'}
              className="btn-primary text-sm"
            >
              {copy.ctaLabel}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? copy.aria.closeMenu : copy.aria.openMenu}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="mt-2 mx-3 py-4 space-y-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100">
            <div className="px-4">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                onClick={() => setIsLangOpen((open) => !open)}
                aria-expanded={isLangOpen}
                aria-haspopup="true"
              >
                <span>{currentLocale.toUpperCase()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isLangOpen && (
                <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <Link
                    href={localeHref('es')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setIsLangOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Español
                  </Link>
                  <Link
                    href={localeHref('en')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setIsLangOpen(false)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    English
                  </Link>
                </div>
              )}
            </div>
            {copy.nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href={copy.ctaHref ?? '/#contact'}
                className="btn-primary w-full text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {copy.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
