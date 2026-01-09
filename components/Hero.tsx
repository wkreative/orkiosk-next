import Link from 'next/link'
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'
import HeroKiosk from './HeroKiosk'

export type HeroCopy = {
  badge: string
  heading: string
  subheading: string
  ctaPrimary: string
  ctaSecondary: string
  trustPrimary: string
  trustSecondary: string
}

const defaultCopy: HeroCopy = {
  badge: 'Tecnología de vanguardia',
  heading: 'Quioscos de Autoservicio Inteligentes',
  subheading:
    'Transforma la experiencia de tus clientes con quioscos de autoservicio que reducen tiempos de espera, integran pagos y ofrecen analítica en tiempo real.',
  ctaPrimary: 'Agendar Demo Gratuita',
  ctaSecondary: 'Ver Beneficios',
  trustPrimary: '99.9% Uptime Garantizado',
  trustSecondary: 'Analítica en Tiempo Real',
}

export default function Hero({ copy = defaultCopy }: { copy?: HeroCopy }) {
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

        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {/* High density particle set */}
          <div className="absolute top-[15%] left-[10%] w-4 h-4 bg-primary-400 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[45%] right-[15%] w-3 h-3 bg-primary-300 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[20%] left-[20%] w-2 h-2 bg-primary-200 rounded-full animate-float" style={{ animationDelay: '4s' }} />

          <div className="absolute top-[25%] right-[25%] w-3 h-3 bg-accent-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[35%] right-[10%] w-2 h-2 bg-accent-300 rounded-full animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-[60%] left-[5%] w-3 h-3 bg-accent-200 rounded-full animate-float" style={{ animationDelay: '5s' }} />

          <div className="absolute top-[10%] right-[40%] w-2 h-2 bg-primary-300/50 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-[10%] left-[40%] w-3 h-3 bg-accent-300/50 rounded-full animate-float" style={{ animationDelay: '3.5s' }} />
          <div className="absolute top-[80%] right-[30%] w-2 h-2 bg-primary-200/60 rounded-full animate-float" style={{ animationDelay: '2.5s' }} />

          {/* Darker Particles */}
          <div className="absolute top-[35%] left-[60%] w-3 h-3 bg-primary-700/40 rounded-full animate-float" style={{ animationDelay: '0.8s' }} />
          <div className="absolute bottom-[40%] left-[15%] w-2 h-2 bg-primary-800/40 rounded-full animate-float" style={{ animationDelay: '3.2s' }} />
          <div className="absolute top-[10%] left-[80%] w-4 h-4 bg-accent-600/30 rounded-full animate-float" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-[10%] right-[60%] w-3 h-3 bg-gray-600/30 rounded-full animate-float" style={{ animationDelay: '4.5s' }} />
          <div className="absolute top-[50%] right-[5%] w-2 h-2 bg-primary-900/30 rounded-full animate-float" style={{ animationDelay: '2.1s' }} />
          <div className="absolute top-[90%] left-[50%] w-3 h-3 bg-accent-700/30 rounded-full animate-float" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>{copy.badge}</span>
            </div>

            {/* Heading */}
            {/* Heading */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 dark:text-white leading-tight mb-6"
            >
              {copy.heading}
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up animate-delay-100">
              {copy.subheading}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-slide-up animate-delay-200">
              <a href="#contact" className="btn-primary group">
                <span>{copy.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#benefits" className="btn-secondary">
                {copy.ctaSecondary}
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 animate-slide-up animate-delay-300">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary-600" />
                <span>{copy.trustPrimary}</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <span>{copy.trustSecondary}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Kiosk Image */}
          <div className="relative animate-fade-in animate-delay-200">
            <div className="animate-float">
              <HeroKiosk />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
