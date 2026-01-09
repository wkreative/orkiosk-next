'use client'

import { useState } from 'react'
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react'

export type ContactCopy = {
  label: string
  title: string
  subtitle: string
  whatsappLabel: string
  emailLabel: string
  locationLabel: string
  locationValue: string
  successTitle: string
  successBody: string
  successButton: string
  form: {
    nameLabel: string
    companyLabel: string
    emailLabel: string
    phoneLabel: string
    messageLabel: string
    namePlaceholder: string
    companyPlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    messagePlaceholder: string
    submitIdle: string
    submitLoading: string
    error: string
  }
}

const defaultCopy: ContactCopy = {
  label: 'Contacto',
  title: '?Interesado en nuestros quioscos?',
  subtitle:
    'Cont?ctanos para agendar una demo personalizada y descubrir c?mo Orkiosk puede transformar la experiencia de autoservicio en tu negocio.',
  whatsappLabel: 'WhatsApp',
  emailLabel: 'Email',
  locationLabel: 'Ubicaci?n',
  locationValue: 'San Juan, Puerto Rico',
  successTitle: '?Mensaje Enviado!',
  successBody:
    'Gracias por tu inter?s. Nos pondremos en contacto contigo dentro de las pr?ximas 24 horas.',
  successButton: 'Enviar Otro Mensaje',
  form: {
    nameLabel: 'Nombre completo *',
    companyLabel: 'Empresa',
    emailLabel: 'Email *',
    phoneLabel: 'Tel?fono',
    messageLabel: 'Mensaje *',
    namePlaceholder: 'Juan P?rez',
    companyPlaceholder: 'Tu Empresa',
    emailPlaceholder: 'juan@empresa.com',
    phonePlaceholder: '+1-787-123-4567',
    messagePlaceholder: 'Cu?ntanos sobre tu negocio y c?mo podemos ayudarte...',
    submitIdle: 'Enviar Mensaje',
    submitLoading: 'Enviando...',
    error: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.',
  },
}

export default function Contact({ copy = defaultCopy }: { copy?: ContactCopy }) {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormStatus('submitting')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', 'YOUR_ACCESS_KEY_HERE') // Will be replaced with actual key
    formData.append('subject', 'Nuevo mensaje de contacto - Orkiosk.com')
    formData.append('from_name', 'Orkiosk Website')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setFormStatus('success')
          ; (e.target as HTMLFormElement).reset()
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
      className="py-20 md:py-32 bg-white dark:bg-black transition-colors duration-300"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Content */}
          <div>
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
              {copy.label}
            </span>
            <h2
              id="contact-heading"
              className="section-title dark:text-white"
            >
              {copy.title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {copy.subtitle}
            </p>

            {/* Contact Info */}
            <div className="space-y-6">
              <a
                href="https://wa.me/18777993720"
                className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-gray-700 transition-colors">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M16 3C9.383 3 4 8.383 4 15c0 2.348.737 4.643 2.117 6.56L4 29l7.622-2.078A12.92 12.92 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10a10.9 10.9 0 0 1-4.1-.8l-.6-.24-4.53 1.23 1.24-4.42-.27-.63A9.9 9.9 0 0 1 6 15c0-5.514 4.486-10 10-10zm-4.1 5.7c-.2 0-.4.08-.54.22-.46.46-1.2 1.24-1.2 2.5 0 1.26.92 2.48 1.05 2.66.13.18 1.79 2.87 4.34 3.92 2.14.9 2.58.72 3.05.67.46-.05 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.05-.1-.2-.16-.41-.26-.2-.1-1.2-.6-1.38-.67-.18-.07-.31-.1-.44.1-.13.2-.5.67-.62.8-.12.13-.23.15-.44.05-.2-.1-.86-.32-1.64-1.02-.6-.54-1-1.21-1.12-1.41-.12-.2-.01-.32.09-.42.1-.1.2-.23.3-.35.1-.12.13-.2.2-.33.07-.13.03-.25-.01-.35-.05-.1-.44-1.07-.6-1.47-.16-.38-.33-.33-.44-.33z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{copy.whatsappLabel}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">1-877-799-3720</p>
                </div>
              </a>

              <a
                href="mailto:info@orkiosk.com"
                className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-gray-700 transition-colors">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{copy.emailLabel}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">info@orkiosk.com</p>
                </div>
              </a>

              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <div className="w-12 h-12 bg-primary-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{copy.locationLabel}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{copy.locationValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-10">
            {formStatus === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-500" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {copy.successTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {copy.successBody}
                </p>
                <button
                  onClick={() => setFormStatus('idle')}
                  className="btn-primary"
                >
                  {copy.successButton}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {copy.form.nameLabel}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-all duration-200"
                      placeholder={copy.form.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {copy.form.companyLabel}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-all duration-200"
                      placeholder={copy.form.companyPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {copy.form.emailLabel}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-all duration-200"
                      placeholder={copy.form.emailPlaceholder}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      {copy.form.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-all duration-200"
                      placeholder={copy.form.phonePlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {copy.form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-all duration-200 resize-none"
                    placeholder={copy.form.messagePlaceholder}
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
                      {copy.form.submitLoading}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span>{copy.form.submitIdle}</span>
                      <Send className="w-5 h-5 ml-2" />
                    </span>
                  )}
                </button>

                {formStatus === 'error' && (
                  <p className="text-red-600 text-sm text-center">
                    {copy.form.error}
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
