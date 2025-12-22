'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Monitor } from 'lucide-react'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Beneficios', href: '/#benefits' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contacto', href: '/#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegación principal">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group" aria-label="Ir al inicio">
            <div className="relative">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-primary-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition-opacity duration-200" />
            </div>
            <span className="font-heading font-bold text-xl text-gray-900">
              Orkiosk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 rounded-lg hover:bg-primary-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              href="/#contact"
              className="btn-primary text-sm"
            >
              Agendar Demo
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
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
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-600 hover:text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/#contact"
                className="btn-primary w-full text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agendar Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
