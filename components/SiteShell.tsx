import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { withLocale, type Translations, type Locale } from '@/lib/i18n'

export default function SiteShell({
  locale,
  copy,
  children,
}: {
  locale: Locale
  copy: Translations
  children: React.ReactNode
}) {
  const headerCopy = {
    ...copy.header,
    homeHref: `/${locale}`,
    ctaHref: `/${locale}#contact`,
    nav: copy.header.nav.map((item) => ({
      ...item,
      href: withLocale(locale, item.href),
    })),
  }

  return (
    <>
      <Header copy={headerCopy} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer copy={copy.footer} locale={locale} />
    </>
  )
}
