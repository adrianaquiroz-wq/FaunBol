import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { ApiError } from '../api/client'
import { useAnimal } from '../api/hooks'
import type { Animal, ConservationStatus, PopulationTrend } from '../api/types'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { IucnChip } from '../components/IucnChip'
import { ErrorState, LoadingState, StateMessage } from '../components/StateMessage'
import { splitList } from '../lib/enums'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function AnimalDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const query = useAnimal(id)
  // 404, o 400 cuando el id no es un UUID válido: en ambos casos la especie no existe.
  const notFound = query.error instanceof ApiError && (query.error.status === 404 || query.error.status === 400)

  useDocumentTitle(
    query.data ? query.data.commonName : notFound ? t('animal.notFoundTitle') : t('catalog.title'),
  )

  return (
    <div className="container-page pt-6 sm:pt-10">
      <Link
        to="/especies"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-900 hover:underline"
      >
        <span aria-hidden="true">←</span> {t('animal.back')}
      </Link>

      <div className="mt-4">
        {query.data ? (
          <AnimalDetail animal={query.data} />
        ) : notFound ? (
          <StateMessage title={t('animal.notFoundTitle')} text={t('animal.notFoundText')}>
            <Link to="/especies" className="btn btn-primary">
              {t('states.goCatalog')}
            </Link>
          </StateMessage>
        ) : query.isError ? (
          <ErrorState onRetry={() => void query.refetch()} retrying={query.isFetching} />
        ) : (
          <LoadingState />
        )}
      </div>
    </div>
  )
}

function AnimalDetail({ animal }: { animal: Animal }) {
  const { t } = useTranslation()
  const departments = splitList(animal.distribution)

  return (
    <article>
      {/* Cabecera: foto + nombres */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <figure>
          <div className="overflow-hidden rounded-(--radius-card) border border-line">
            <AnimalPhoto
              photo={animal.photo}
              name={animal.commonName}
              variant="full"
              eager
              className="aspect-[4/3] w-full"
            />
          </div>
          {animal.photo?.credit && (
            <figcaption className="mt-2 text-xs text-ink-muted">
              {t('animal.photoCredit', { credit: animal.photo.credit })}
            </figcaption>
          )}
        </figure>

        <div className="flex flex-col justify-center">
          <p className="eyebrow mb-3">{t(`animalClass.${animal.animalClass}`)}</p>
          <h1 className="text-4xl leading-tight font-semibold text-balance sm:text-5xl">{animal.commonName}</h1>
          <p className="mt-2 font-display text-xl text-ink-soft italic">{animal.scientificName}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <IucnChip status={animal.iucnStatus} size="lg" />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="text-ink-muted">{t('animal.class')}</dt>
              <dd className="mt-0.5 font-medium">{t(`animalClass.${animal.animalClass}`)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">{t('animal.trend')}</dt>
              <dd className="mt-0.5">
                <TrendBadge trend={animal.populationTrend} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Estados de conservación */}
      <section className="mt-14" aria-labelledby="status-title">
        <h2 id="status-title" className="text-3xl font-semibold">
          {t('animal.statusTitle')}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <StatusCard title={t('animal.globalTitle')} explain={t('animal.globalExplain')} status={animal.iucnStatus} />
          <StatusCard
            title={t('animal.nationalTitle')}
            explain={t('animal.nationalExplain')}
            status={animal.boliviaRedBookStatus}
          />
        </div>
      </section>

      {/* Contenido */}
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
        <div className="space-y-10">
          <TextSection title={t('animal.description')} text={animal.description} />
          <TextSection title={t('animal.habitat')} text={animal.habitat} />
          <TextSection title={t('animal.threats')} text={animal.threats} />
        </div>

        <aside className="space-y-5">
          <SideCard title={t('animal.population')}>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">{t('animal.trend')}</dt>
                <dd>
                  <TrendBadge trend={animal.populationTrend} />
                </dd>
              </div>
              {animal.estimatedPopulation !== null && animal.estimatedPopulation !== undefined && (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-ink-muted">{t('animal.estimatedPopulation')}</dt>
                  <dd className="font-display text-lg font-semibold text-forest-900">
                    <EstimatedPopulation value={animal.estimatedPopulation} />
                  </dd>
                </div>
              )}
            </dl>
          </SideCard>

          <SideCard title={t('animal.distribution')}>
            {departments.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {departments.map((dep) => (
                  <li key={dep} className="rounded-full border border-line bg-paper px-3 py-1 text-sm">
                    {dep}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">{t('animal.noData')}</p>
            )}
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">{t('animal.distributionNote')}</p>
          </SideCard>

          <SideCard title={t('animal.ecoregions')}>
            {animal.ecoregions.length > 0 ? (
              <ul className="space-y-1.5">
                {animal.ecoregions.map((eco) => (
                  <li key={eco.id}>
                    <Link
                      to={`/especies?ecoregion=${encodeURIComponent(eco.code)}`}
                      className="group inline-flex min-h-9 items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-900"
                      aria-label={t('animal.ecoregionLink', { name: eco.name })}
                    >
                      <span className="h-2 w-2 rounded-full bg-forest-500" aria-hidden="true" />
                      <span className="group-hover:underline">{eco.name}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-muted">{t('animal.noData')}</p>
            )}
          </SideCard>

          <SideCard title={t('animal.source')}>
            <p className="text-sm leading-relaxed text-ink-soft">{animal.sourceReference || t('animal.noData')}</p>
          </SideCard>
        </aside>
      </div>
    </article>
  )
}

function StatusCard({
  title,
  explain,
  status,
}: {
  title: string
  explain: string
  status: ConservationStatus | null
}) {
  const { t } = useTranslation()
  return (
    <div className="card flex flex-col gap-4 p-6">
      <h3 className="font-sans text-xs font-semibold tracking-[0.16em] text-ochre-700 uppercase">{title}</h3>
      {status ? (
        <div>
          <IucnChip status={status} size="lg" />
          <p className="mt-3 text-sm text-ink">{t(`iucnDesc.${status}`)}</p>
        </div>
      ) : (
        <div>
          <span className="inline-flex items-center rounded-full border border-dashed border-ink-muted px-3.5 py-1.5 text-sm font-semibold text-ink-soft">
            {t('animal.notAssessed')}
          </span>
          <p className="mt-3 text-sm text-ink">{t('animal.notAssessedExplain')}</p>
        </div>
      )}
      <p className="border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">{explain}</p>
    </div>
  )
}

function TextSection({ title, text }: { title: string; text: string | null }) {
  const { t } = useTranslation()
  const paragraphs = (text ?? '').split(/\n{2,}|\r\n\r\n/).filter((p) => p.trim())
  return (
    <section>
      <h2 className="mb-3 text-2xl font-semibold">{title}</h2>
      {paragraphs.length > 0 ? (
        <div className="prose-field max-w-prose text-base leading-relaxed text-ink">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-ink-muted">{t('animal.noData')}</p>
      )}
    </section>
  )
}

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="mb-3 font-sans text-xs font-semibold tracking-[0.16em] text-ochre-700 uppercase">{title}</h2>
      {children}
    </section>
  )
}

const TREND_STYLE: Record<PopulationTrend, { icon: string; className: string }> = {
  INCREASING: { icon: '↗', className: 'bg-forest-50 text-forest-800 border-forest-100' },
  STABLE: { icon: '→', className: 'bg-sand-100 text-ink border-line' },
  DECREASING: { icon: '↘', className: 'bg-[#fde8e4] text-[#9a1a07] border-[#f6c9c0]' },
  UNKNOWN: { icon: '?', className: 'bg-sand-100 text-ink-soft border-line' },
}

function TrendBadge({ trend }: { trend: PopulationTrend | null }) {
  const { t } = useTranslation()
  const key: PopulationTrend = trend ?? 'UNKNOWN'
  const style = TREND_STYLE[key]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style.className}`}>
      <span aria-hidden="true">{style.icon}</span>
      {t(`trend.${key}`)}
    </span>
  )
}

function EstimatedPopulation({ value }: { value: number }) {
  const { t, i18n } = useTranslation()
  return <>{t('animal.individuals', { value: new Intl.NumberFormat(i18n.language).format(value) })}</>
}
