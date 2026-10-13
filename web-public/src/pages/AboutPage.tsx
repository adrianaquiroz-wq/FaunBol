import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { IucnChip } from '../components/IucnChip'
import { IUCN_ORDER } from '../lib/iucn'
import { SOURCES } from '../lib/sources'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function AboutPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('about.title'))

  return (
    <div className="container-page pt-10 sm:pt-14">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">{t('app.subtitle')}</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{t('about.title')}</h1>
        <p className="mt-4 font-display text-xl leading-relaxed text-ink sm:text-2xl">{t('about.lead')}</p>
      </header>

      {/* Aviso: no es para caza */}
      <section
        aria-labelledby="notice-title"
        className="mt-10 flex flex-col gap-4 rounded-(--radius-card) border border-ochre-300 bg-ochre-100 p-6 sm:flex-row sm:p-8"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8 shrink-0 text-ochre-700" aria-hidden="true" focusable="false">
          <path d="M12 3l10 18H2L12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M12 10v5M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div>
          <h2 id="notice-title" className="text-2xl font-semibold">
            {t('about.noticeTitle')}
          </h2>
          <p className="mt-2 leading-relaxed text-ink">{t('about.noticeText')}</p>
          <p className="mt-2 text-sm font-semibold text-ochre-700">{t('about.legalNote')}</p>
        </div>
      </section>

      <section className="mt-14 max-w-3xl" aria-labelledby="purpose-title">
        <h2 id="purpose-title" className="text-3xl font-semibold">
          {t('about.purposeTitle')}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">{t('about.purposeText')}</p>
      </section>

      <section className="mt-14" aria-labelledby="categories-title">
        <h2 id="categories-title" className="text-3xl font-semibold">
          {t('about.categoriesTitle')}
        </h2>
        <p className="mt-3 max-w-3xl text-ink-soft">{t('about.categoriesIntro')}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {IUCN_ORDER.map((status) => (
            <li key={status} className="card flex flex-col gap-2 p-5">
              <div>
                <IucnChip status={status} />
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{t(`iucnDesc.${status}`)}</p>
              <Link
                to={`/especies?iucnStatus=${status}`}
                className="mt-auto self-start text-sm font-medium text-forest-700 hover:text-forest-900 hover:underline"
              >
                {t('nav.species')} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="sources-title">
        <h2 id="sources-title" className="text-3xl font-semibold">
          {t('about.sourcesTitle')}
        </h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {SOURCES.map((source) => (
            <li key={source.key} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-display text-lg text-forest-900">{t(source.key)}</span>
              {source.href ? (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-forest-700 hover:text-forest-900 hover:underline"
                >
                  {source.label} <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className="text-sm text-ink-muted">{source.label}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
