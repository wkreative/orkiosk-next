import Link from 'next/link'
import { Monitor, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'

const currentYear = new Date().getFullYear()

const navigation = {
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
    { name: 'Política de Privacidad', href: '/privacy' },
    { name: 'Términos y Condiciones', href: '/terms' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://facebook.com/orkiosk',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/orkiosk',
      icon: Instagram,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/orkiosk',
      icon: Linkedin,
    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300" role="contentinfo">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6" aria-label="Ir al inicio">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">Orkiosk</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Quiscos de autoservicio inteligentes con software, hardware y analítica en tiempo real para optimizar tu negocio.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+573000000000" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                <span>+57 300 000 0000</span>
              </a>
              <a href="mailto:info@orkiosk.com" className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                <span>info@orkiosk.com</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5" />
                <span>Bogotá, Colombia</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Navegación</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors">
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
            <p className="text-gray-500 text-sm">
              © {currentYear} Orkiosk. Todos los derechos reservados.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Síguenos en ${item.name}`}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
