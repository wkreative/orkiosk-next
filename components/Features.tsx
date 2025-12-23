import { Clock, CreditCard, BarChart3, Shield, Printer, Users } from 'lucide-react'

export type FeatureItem = {
  name: string
  description: string
  icon: typeof Clock
  color: string
}

export type FeaturesCopy = {
  label: string
  title: string
  subtitle: string
  items: Array<{ name: string; description: string }>
  ctaPrompt: string
  ctaButton: string
}

const defaultItems = [
  {
    name: 'Reducci?n de Tiempos de Espera',
    description:
      'Optimiza el flujo de clientes con un proceso de autoservicio r?pido e intuitivo que reduce significativamente los tiempos de espera en caja.',
    icon: Clock,
    color: 'bg-blue-500',
  },
  {
    name: 'Pagos Integrados',
    description:
      'Acepta m?ltiples m?todos de pago incluyendo tarjetas de cr?dito, d?bito, transferencias y efectivo con nuestras integraciones POS.',
    icon: CreditCard,
    color: 'bg-green-500',
  },
  {
    name: 'Anal?tica en Tiempo Real',
    description:
      'Monitorea ventas, productos populares y comportamiento de clientes con dashboards interactivos y reportes detallados.',
    icon: BarChart3,
    color: 'bg-purple-500',
  },
  {
    name: 'Sistema Seguro y Estable',
    description:
      'Infraestructura robusta con respaldo autom?tico y protecci?n de datos para garantizar la continuidad de tu negocio.',
    icon: Shield,
    color: 'bg-red-500',
  },
  {
    name: 'Impresora de Recibo',
    description:
      'Impresi?n r?pida y clara de recibos con personalizaci?n de ticket para incluir promociones e informaci?n de tu marca.',
    icon: Printer,
    color: 'bg-orange-500',
  },
  {
    name: 'Experiencia Intuitiva',
    description:
      'Interfaz de usuario dise?ada para una experiencia fluida que tus clientes dominar?n desde el primer uso.',
    icon: Users,
    color: 'bg-teal-500',
  },
]

const defaultCopy: FeaturesCopy = {
  label: 'Beneficios',
  title: '?Qu? hace Orkiosk por tu negocio?',
  subtitle:
    'Una soluci?n completa que combina hardware, software y anal?tica para transformar la experiencia de autoservicio en tu establecimiento.',
  items: defaultItems.map(({ name, description }) => ({ name, description })),
  ctaPrompt: '?Quieres conocer m?s sobre nuestras funcionalidades?',
  ctaButton: 'Habla con un Asesor',
}

export default function Features({ copy = defaultCopy, locale = 'es' }: { copy?: FeaturesCopy; locale?: string }) {
  const contactHref = `/${locale}#contact`
  const features: FeatureItem[] = defaultItems.map((item, index) => ({
    ...item,
    name: copy.items[index]?.name ?? item.name,
    description: copy.items[index]?.description ?? item.description,
  }))

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
            {copy.label}
          </span>
          <h2
            id="features-heading"
            className="section-title"
          >
            {copy.title}
          </h2>
          <p className="section-subtitle mt-4">
            {copy.subtitle}
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
            {copy.ctaPrompt}
          </p>
          <a href={contactHref} className="btn-primary">
            {copy.ctaButton}
          </a>
        </div>
      </div>
    </section>
  )
}
