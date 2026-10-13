import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useEcoregions } from '../api/hooks'
import type { Ecoregion } from '../api/types'
import { ErrorState, StateMessage } from '../components/StateMessage'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function EcoregionsPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('ecoregions.title'))
  const query = useEcoregions()

  return (
    <div className="container-page pt-10 sm:pt-14">
      <header className="max-w-3xl">
        <p className="eyebrow mb-3">{t('app.subtitle')}</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{t('ecoregions.title')}</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">{t('ecoregions.intro')}</p>
      </header>

      <div className="mt-10">
        {query.isError && !query.data ? (
          <ErrorState onRetry={() => void query.refetch()} retrying={query.isFetching} />
        ) : !query.data ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="card h-56 animate-pulse bg-sand-100" />
            ))}
          </ul>
        ) : query.data.length === 0 ? (
          <StateMessage title={t('ecoregions.emptyTitle')} text={t('ecoregions.emptyText')} />
        ) : (
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {query.data.map((eco, i) => (
              <li key={eco.id}>
                <EcoregionCard ecoregion={eco} index={i + 1} />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

function EcoregionCard({ ecoregion, index }: { ecoregion: Ecoregion; index: number }) {
  const { t } = useTranslation()
  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="font-display text-sm text-ochre-700 italic" aria-hidden="true">
          {String(index).padStart(2, '0')}
        </span>
        <span className="rounded-full bg-forest-50 px-2.5 py-1 text-xs font-semibold text-forest-800">
          {t('ecoregions.count', { count: ecoregion.animalCount })}
        </span>
      </div>
      <h2 className="mt-3 text-2xl leading-snug font-semibold">{ecoregion.name}</h2>
      {ecoregion.description && (
        <p className="mt-2 line-clamp-5 flex-1 text-sm leading-relaxed text-ink-soft">{ecoregion.description}</p>
      )}
      <Link
        to={`/especies?ecoregion=${encodeURIComponent(ecoregion.code)}`}
        className="btn btn-secondary mt-5 self-start"
        aria-label={t('ecoregions.seeSpeciesOf', { name: ecoregion.name })}
      >
        {t('ecoregions.seeSpecies')} <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
