import Link from 'next/link'
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'
import HeroKiosk from './HeroKiosk'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-accent-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>Tecnología de vanguardia</span>
            </div>

            {/* Heading */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 leading-tight mb-6"
            >
              Quiscos de{' '}
              <span className="text-gradient">Autoservicio</span>{' '}
              Inteligentes
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up animate-delay-100">
              Transforma la experiencia de tus clientes con quioscos de autoservicio que reducen tiempos de espera, integran pagos y ofrecen analítica en tiempo real.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-slide-up animate-delay-200">
              <Link href="/#contact" className="btn-primary group">
                <span>Agendar Demo Gratuita</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/#benefits" className="btn-secondary">
                Ver Beneficios
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 animate-slide-up animate-delay-300">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>99.9% Uptime Garantizado</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <span>Analítica en Tiempo Real</span>
              </div>
            </div>
          </div>

          {/* Right Content - Kiosk Image */}
          <div className="relative animate-fade-in animate-delay-200">
            <HeroKiosk />
          </div>
        </div>
      </div>
    </section>
  )
}
