import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useAnimalStats, useAnimals } from '../api/hooks'
import type { Animal, AnimalStats } from '../api/types'
import { AnimalCard, AnimalCardSkeleton } from '../components/AnimalCard'
import { AnimalPhoto } from '../components/AnimalPhoto'
import { IucnChip } from '../components/IucnChip'
import { ErrorState, StateMessage } from '../components/StateMessage'
import { IUCN_COLORS, IUCN_ORDER } from '../lib/iucn'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function HomePage() {
  const { t } = useTranslation()
  useDocumentTitle(t('home.title'))

  const cr = useAnimals({ iucnStatus: 'CR', limit: 12 })
  const crList = cr.data?.data ?? []
  const crHasPhoto = crList.some((a) => a.photo)
  // EN solo hace falta si no hay CR (destacados) o ningún CR tiene foto (portada).
  const en = useAnimals({ iucnStatus: 'EN', limit: 12 }, { enabled: cr.isSuccess && !crHasPhoto })
  const enList = en.data?.data ?? []

  const heroAnimal = crList.find((a) => a.photo) ?? enList.find((a) => a.photo) ?? null
  const heroPending = cr.isPending || (cr.isSuccess && !crHasPhoto && en.isPending && en.fetchStatus !== 'idle')

  const featuredIsCR = crList.length > 0 || !cr.isSuccess
  const featured = (featuredIsCR ? crList : enList).slice(0, 4)
  const featuredQuery = featuredIsCR ? cr : en

  return (
    <>
      <Hero animal={heroAnimal} pending={heroPending} />
      <StatsSection />

      <section className="container-page mt-20" aria-labelledby="featured-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">{t('nav.species')}</p>
            <h2 id="featured-title" className="text-3xl font-semibold sm:text-4xl">
              {featuredIsCR ? t('home.featuredTitleCR') : t('home.featuredTitleEN')}
            </h2>
            <p className="mt-2 max-w-xl text-ink-soft">{t('home.featuredIntro')}</p>
          </div>
          <Link to={`/especies?iucnStatus=${featuredIsCR ? 'CR' : 'EN'}`} className="btn btn-secondary">
            {t('home.seeAll')} <span aria-hidden="true">→</span>
          </Link>
        </div>

        {featuredQuery.isError ? (
          <ErrorState onRetry={() => void featuredQuery.refetch()} retrying={featuredQuery.isFetching} />
        ) : featuredQuery.isPending && featuredQuery.fetchStatus !== 'idle' ? (
          <FeaturedGrid>
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i}>
                <AnimalCardSkeleton />
              </li>
            ))}
          </FeaturedGrid>
        ) : featured.length === 0 ? (
          <StateMessage title={t('home.featuredEmpty')} />
        ) : (
          <FeaturedGrid>
            {featured.map((animal) => (
              <li key={animal.id}>
                <AnimalCard animal={animal} />
              </li>
            ))}
          </FeaturedGrid>
        )}
      </section>

      <section className="container-page mt-20 grid gap-5 md:grid-cols-[1.5fr_1fr]" aria-label={t('home.exploreTitle')}>
        <div className="bg-topo relative overflow-hidden rounded-(--radius-card) p-8 text-sand-50 sm:p-10">
          <p className="eyebrow mb-3 text-ochre-300">{t('nav.ecoregions')}</p>
          <h2 className="max-w-md text-3xl font-semibold text-sand-50">{t('home.exploreTitle')}</h2>
          <p className="mt-3 max-w-lg text-sand-200">{t('home.exploreText')}</p>
          <Link to="/ecorregiones" className="btn btn-light mt-6">
            {t('home.ctaEcoregions')} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="card flex flex-col justify-between p-8 sm:p-10">
          <div>
            <p className="eyebrow mb-3">{t('nav.about')}</p>
            <h2 className="text-2xl font-semibold">{t('home.aboutTitle')}</h2>
            <p className="mt-3 text-ink-soft">{t('home.aboutText')}</p>
          </div>
          <Link to="/acerca" className="btn btn-secondary mt-6 self-start">
            {t('home.aboutCta')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}

function FeaturedGrid({ children }: { children: ReactNode }) {
  return <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</ul>
}

function Hero({ animal, pending }: { animal: Animal | null; pending: boolean }) {
  const { t } = useTranslation()

  return (
    <section className="container-page grid items-center gap-10 pt-8 pb-4 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-16">
      <div>
        <p className="eyebrow mb-4">{t('home.eyebrow')}</p>
        <h1 className="text-[2.6rem] leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-[4.2rem]">
          {t('app.tagline')}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{t('home.intro')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/especies" className="btn btn-primary">
            {t('home.ctaCatalog')} <span aria-hidden="true">→</span>
          </Link>
          <Link to="/ecorregiones" className="btn btn-secondary">
            {t('home.ctaEcoregions')}
          </Link>
        </div>
      </div>

      <div className="relative">
        {/* Marco tipo "lámina" de guía de campo */}
        <div className="absolute -inset-2 -z-10 hidden rotate-2 rounded-[1.75rem] border border-sand-300 bg-sand-100 sm:block" aria-hidden="true" />
        {pending ? (
          <div className="aspect-[4/3] animate-pulse rounded-(--radius-card) bg-sand-200 lg:aspect-[5/6]" aria-hidden="true" />
        ) : animal ? (
          <figure className="overflow-hidden rounded-(--radius-card) border border-line bg-sand-50">
            <Link to={`/especies/${animal.id}`} className="block">
              <AnimalPhoto
                photo={animal.photo}
                name={animal.commonName}
                variant="full"
                eager
                className="aspect-[4/3] w-full lg:aspect-[5/6]"
              />
            </Link>
            <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span className="text-sm">
                <span className="text-ink-muted">{t('home.heroCaption')}: </span>
                <Link to={`/especies/${animal.id}`} className="font-display font-semibold text-forest-900 hover:underline">
                  {animal.commonName}
                </Link>{' '}
                <span className="text-ink-soft italic">({animal.scientificName})</span>
              </span>
              <IucnChip status={animal.iucnStatus} size="sm" />
            </figcaption>
            {animal.photo?.credit && (
              <p className="border-t border-line px-4 py-2 text-xs text-ink-muted">
                {t('animal.photoCredit', { credit: animal.photo.credit })}
              </p>
            )}
          </figure>
        ) : (
          <HeroPattern />
        )}
      </div>
    </section>
  )
}

function HeroPattern() {
  return (
    <div
      className="bg-topo relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-(--radius-card) lg:aspect-[5/6]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="h-2/3 w-2/3 text-forest-300/60">
        <path d="M40 160c0-62 38-106 120-118-8 82-50 118-120 118z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40 160c24-30 52-60 96-92" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M70 128l-6-30M92 108l-4-32M114 90l-2-28M84 122l30 4M104 100l30 2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="150" cy="150" r="18" fill="none" stroke="#c4873a" strokeWidth="2" />
      </svg>
    </div>
  )
}

function StatsSection() {
  const { t } = useTranslation()
  const stats = useAnimalStats()

  return (
    <section className="container-page mt-16" aria-labelledby="stats-title">
      <div className="card p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          <div>
            <h2 id="stats-title" className="text-2xl font-semibold sm:text-3xl">
              {t('home.statsTitle')}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{t('home.statsIntro')}</p>
          </div>
          {stats.isError ? (
            <ErrorState onRetry={() => void stats.refetch()} retrying={stats.isFetching} />
          ) : stats.data ? (
            <StatsBody stats={stats.data} />
          ) : (
            <div className="space-y-4" aria-hidden="true">
              <div className="h-12 w-32 animate-pulse rounded bg-sand-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-sand-200" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function StatsBody({ stats }: { stats: AnimalStats }) {
  const { t, i18n } = useTranslation()
  const fmt = new Intl.NumberFormat(i18n.language)
  const counts = IUCN_ORDER.map((status) => ({ status, count: stats.byIucnStatus?.[status] ?? 0 }))
  const sum = counts.reduce((acc, c) => acc + c.count, 0)

  return (
    <div>
      <p className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-semibold text-forest-900 sm:text-6xl">{fmt.format(stats.total)}</span>
        <span className="text-ink-soft">{t('home.statsTotal')}</span>
      </p>

      {sum > 0 && (
        <div
          className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-sand-200"
          role="img"
          aria-label={`${t('home.statsBarLabel')}: ${counts
            .filter((c) => c.count > 0)
            .map((c) => `${t(`iucn.${c.status}`)} ${c.count}`)
            .join(', ')}`}
        >
          {counts
            .filter((c) => c.count > 0)
            .map((c) => (
              <div
                key={c.status}
                style={{ width: `${(c.count / sum) * 100}%`, backgroundColor: IUCN_COLORS[c.status].bg }}
                className="h-full border-r-2 border-sand-50 last:border-r-0"
              />
            ))}
        </div>
      )}

      <ul className="mt-5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 xl:grid-cols-4">
        {counts.map(({ status, count }) => (
          <li key={status}>
            <Link
              to={`/especies?iucnStatus=${status}`}
              className={`flex items-center justify-between gap-2 rounded-xl border border-line px-2.5 py-2 transition-colors hover:bg-sand-100 ${
                count === 0 ? 'text-ink-muted' : ''
              }`}
            >
              <IucnChip status={status} size="sm" withName={false} />
              <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">{t(`iucn.${status}`)}</span>
              <span className={`font-display text-lg font-semibold tabular-nums ${count === 0 ? 'text-ink-muted' : 'text-forest-900'}`}>{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
