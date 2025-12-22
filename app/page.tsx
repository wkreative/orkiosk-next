import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import BlogPreview from '@/components/BlogPreview'
import Contact from '@/components/Contact'

export const metadata: Metadata = {
  title: 'Quiscos de Autoservicio Inteligentes',
  description: 'Orkiosk ofrece quioscos de autoservicio inteligentes con software, hardware y analítica en tiempo real. Reduce tiempos de espera, integra pagos y optimiza tu negocio.',
  openGraph: {
    title: 'Orkiosk | Quiscos de Autoservicio Inteligentes',
    description: 'Quiscos de autoservicio inteligentes con software, hardware y analítica en tiempo real.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <BlogPreview />
      <Contact />
    </>
  )
}
