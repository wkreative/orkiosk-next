'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    try {
      // Enviar a Netlify Forms (funciona automáticamente con el atributo data-netlify="true")
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as Record<string, string>).toString(),
      })

      if (response.ok) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
      }
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <section
      id="contact"
      className="py-20 md:py-32 bg-white"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
              Contacto
            </span>
            <h2
              id="contact-heading"
              className="section-title"
            >
              ¿Interesado en nuestros quioscos?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Contáctanos para agendar una demo personalizada y descubrir cómo Orkiosk puede transformar la experiencia de autoservicio en tu negocio.
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <a
                href="tel:+573000000000"
                className="flex items-center space-x-4 text-gray-600 hover:text-primary-600 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-semibold">+57 300 000 0000</p>
                </div>
              </a>

              <a
                href="mailto:info@orkiosk.com"
                className="flex items-center space-x-4 text-gray-600 hover:text-primary-600 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">info@orkiosk.com</p>
                </div>
              </a>

              <div className="flex items-center space-x-4 text-gray-600">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-semibold">Bogotá, Colombia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="bg-gray-50 rounded-3xl p-8 md:p-10">
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                  ¡Mensaje Enviado!
                </h3>
                <p className="text-gray-600 mb-6">
                  Gracias por tu interés. Nos pondremos en contacto contigo dentro de las próximas 24 horas.
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="btn-primary"
                >
                  Enviar Otro Mensaje
                </button>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Hidden input for Netlify */}
                <input type="hidden" name="form-name" value="contact" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="Tu Empresa"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="juan@empresa.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
                      placeholder="+57 300 000 0000"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 resize-none"
                    placeholder="Cuéntanos sobre tu negocio y cómo podemos ayudarte..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn-primary w-full group"
                >
                  {formStatus === 'submitting' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span>Enviar Mensaje</span>
                      <Send className="w-5 h-5 ml-2" />
                    </span>
                  )}
                </button>

                {formStatus === 'error' && (
                  <p className="text-red-600 text-sm text-center">
                    Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
