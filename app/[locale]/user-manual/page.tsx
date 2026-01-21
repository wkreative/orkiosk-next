import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/pages'
import { getTranslations, translatePage, locales, type Locale } from '@/lib/i18n'
import SiteShell from '@/components/SiteShell'
import ManualSidebar from '@/components/manual/ManualSidebar'
import ManualSearch from '@/components/manual/ManualSearch'
import ManualMobileNav from '@/components/manual/ManualMobileNav'
import { extractSections, injectIds } from '@/lib/manual-utils'

interface Props {
    params: { locale: Locale }
}

export async function generateStaticParams() {
    return locales.map((locale) => ({ locale }))
}

// Revalidate every 60 seconds during active debugging
export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const page = await getPageBySlug('user-manual')
    if (!page) return { title: 'User Manual - Orkiosk' }

    const translated = await translatePage(page, params.locale)
    const title = translated.seoTitle || translated.title
    const description = translated.metaDescription || translated.title

    return {
        title,
        description,
        alternates: {
            canonical: `https://orkiosk.com/${params.locale}/user-manual`,
        },
        openGraph: {
            title,
            description,
            type: 'website',
        },
    }
}

export default async function UserManualPage({ params }: Props) {
    const page = await getPageBySlug('user-manual')
    const copy = await getTranslations(params.locale)

    if (!page || !page.published) {
        notFound()
    }

    const translated = await translatePage(page, params.locale)
    const sections = extractSections(translated.content)
    const processedContent = injectIds(translated.content)

    return (
        <SiteShell locale={params.locale} copy={copy}>
            <div className="bg-gray-50/50 min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header & Search */}
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                            {translated.title}
                        </h1>
                        <p className="text-lg text-gray-600 mb-10">
                            {params.locale === 'es'
                                ? 'Todo lo que necesitas saber para dominar tu panel de Orkiosk.'
                                : 'Everything you need to know to master your Orkiosk dashboard.'}
                        </p>
                        <ManualSearch sections={sections} locale={params.locale} />
                        <ManualMobileNav sections={sections} locale={params.locale} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar - Desktop */}
                        <aside className="lg:w-72 flex-shrink-0">
                            <ManualSidebar sections={sections} locale={params.locale} />
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 lg:p-16 overflow-hidden">
                            <div
                                className="prose prose-lg prose-primary max-w-none 
                  prose-headings:font-heading prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-3xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-4 prose-h2:mt-12
                  prose-h3:text-xl prose-h3:mt-8
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-strong:text-gray-900
                  prose-li:text-gray-600
                  prose-img:rounded-2xl prose-img:shadow-lg
                  "
                                dangerouslySetInnerHTML={{ __html: processedContent }}
                            />

                            {/* Footer of the content */}
                            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                                <p>
                                    {params.locale === 'es'
                                        ? '¿No encuentras lo que buscas?'
                                        : "Can't find what you're looking for?"}
                                    {' '}
                                    <a href={`/${params.locale}#contact`} className="text-primary-600 font-medium hover:underline">
                                        {params.locale === 'es' ? 'Contáctanos' : 'Contact support'}
                                    </a>
                                </p>
                                <p>
                                    {params.locale === 'es' ? 'Última actualización' : 'Last updated'}: {new Date().toLocaleDateString(params.locale)}
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </SiteShell>
    )
}
