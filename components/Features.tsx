import { Clock, CreditCard, BarChart3, Shield, Printer, Users } from 'lucide-react'

const features = [
  {
    name: 'Reducción de Tiempos de Espera',
    description: 'Optimiza el flujo de clientes con un proceso de autoservicio rápido e intuitivo que reduce significativamente los tiempos de espera en caja.',
    icon: Clock,
    color: 'bg-blue-500',
  },
  {
    name: 'Pagos Integrados',
    description: 'Acepta múltiples métodos de pago incluyendo tarjetas de crédito, débito, transferencias y efectivo con nuestras integraciones POS.',
    icon: CreditCard,
    color: 'bg-green-500',
  },
  {
    name: 'Analítica en Tiempo Real',
    description: 'Monitorea ventas, productos populares y comportamiento de clientes con dashboards interactivos y reportes detallados.',
    icon: BarChart3,
    color: 'bg-purple-500',
  },
  {
    name: 'Sistema Seguro y Estable',
    description: 'Infraestructura robusta con respaldo automático y protección de datos para garantizar la continuidad de tu negocio.',
    icon: Shield,
    color: 'bg-red-500',
  },
  {
    name: 'Impresora de Recibo',
    description: 'Impresión rápida y clara de recibos con personalización de ticket para incluir promociones y información de tu marca.',
    icon: Printer,
    color: 'bg-orange-500',
  },
  {
    name: 'Experiencia Intuitiva',
    description: 'Interfaz de usuario diseñada para una experiencia fluida que tus clientes dominarán desde el primer uso.',
    icon: Users,
    color: 'bg-teal-500',
  },
]

export default function Features() {
  return (
    <section
      id="benefits"
      className="py-20 md:py-32 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
            Beneficios
          </span>
          <h2
            id="features-heading"
            className="section-title"
          >
            ¿Qué hace Orkiosk por tu negocio?
          </h2>
          <p className="section-subtitle mt-4">
            Una solución completa que combina hardware, software y analítica para transformar la experiencia de autoservicio en tu establecimiento.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.name}
              className="group card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                {feature.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ¿Quieres conocer más sobre nuestras funcionalidades?
          </p>
          <a href="/#contact" className="btn-primary">
            Habla con un Asesor
          </a>
        </div>
      </div>
    </section>
  )
}
