import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { useAnimals, useEcoregion, useEcoregions } from '../api/hooks'
import { ANIMAL_CLASSES, type AnimalFilters } from '../api/types'
import { AnimalCard, AnimalCardSkeleton } from '../components/AnimalCard'
import { Pagination } from '../components/Pagination'
import { ErrorState, StateMessage } from '../components/StateMessage'
import { isAnimalClass, isConservationStatus } from '../lib/enums'
import { IUCN_ORDER } from '../lib/iucn'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const PAGE_SIZE = 12
const SEARCH_DEBOUNCE_MS = 300

type ParamKey = 'search' | 'iucnStatus' | 'animalClass' | 'ecoregion' | 'page'

/** Lee y valida los filtros desde la query string. */
function readFilters(params: URLSearchParams): Required<Pick<AnimalFilters, 'page' | 'limit'>> & AnimalFilters {
  const iucn = params.get('iucnStatus')
  const cls = params.get('animalClass')
  const page = Number.parseInt(params.get('page') ?? '1', 10)
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    limit: PAGE_SIZE,
    search: params.get('search')?.trim() || undefined,
    iucnStatus: isConservationStatus(iucn) ? iucn : undefined,
    animalClass: isAnimalClass(cls) ? cls : undefined,
    ecoregion: params.get('ecoregion') || undefined,
  }
}

export function CatalogPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('catalog.title'))

  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => readFilters(params), [params])
  const urlSearch = filters.search ?? ''

  const animals = useAnimals(filters)
  const ecoregions = useEcoregions()
  const selectedEcoregion = useEcoregion(filters.ecoregion)

  /** Actualiza parámetros de la URL; cualquier cambio de filtro vuelve a la página 1. */
  const update = useCallback(
    (changes: Partial<Record<ParamKey, string | null>>, options: { replace?: boolean } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === undefined || value === '') next.delete(key)
            else next.set(key, value)
          }
          if (!('page' in changes)) next.delete('page')
          if (next.get('page') === '1') next.delete('page')
          return next
        },
        { replace: options.replace },
      )
    },
    [setParams],
  )

  // Búsqueda con debounce. El input es local; se sincroniza si la URL cambia (atrás/adelante).
  const [searchInput, setSearchInput] = useState(urlSearch)
  const [lastUrlSearch, setLastUrlSearch] = useState(urlSearch)
  if (urlSearch !== lastUrlSearch) {
    setLastUrlSearch(urlSearch)
    setSearchInput(urlSearch)
  }

  useEffect(() => {
    const value = searchInput.trim()
    if (value === urlSearch) return
    const timer = window.setTimeout(() => update({ search: value || null }, { replace: true }), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [searchInput, urlSearch, update])

  const hasFilters = Boolean(filters.search || filters.iucnStatus || filters.animalClass || filters.ecoregion)

  const clearFilters = () => {
    setSearchInput('')
    setParams(new URLSearchParams())
  }

  const goToPage = (page: number) => {
    update({ page: String(page) })
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const data = animals.data

  return (
    <div className="container-page pt-10 sm:pt-14">
      <header className="max-w-2xl">
        <p className="eyebrow mb-3">{t('app.subtitle')}</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{t('catalog.title')}</h1>
        <p className="mt-3 text-lg text-ink-soft">{t('catalog.intro')}</p>
      </header>

      {/* Filtros */}
      <section aria-label={t('catalog.filtersLabel')} className="card mt-8 p-4 sm:p-5">
        <form
          role="search"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]"
          onSubmit={(e) => {
            e.preventDefault()
            update({ search: searchInput.trim() || null })
          }}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="search" className="text-xs font-semibold text-ink-soft">
              {t('catalog.searchLabel')}
            </label>
            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                id="search"
                type="search"
                className="field pl-9"
                placeholder={t('catalog.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <FilterSelect
            id="iucnStatus"
            label={t('catalog.iucnLabel')}
            value={filters.iucnStatus ?? ''}
            onChange={(v) => update({ iucnStatus: v })}
            options={IUCN_ORDER.map((s) => ({ value: s, label: `${s} · ${t(`iucn.${s}`)}` }))}
          />
          <FilterSelect
            id="animalClass"
            label={t('catalog.classLabel')}
            value={filters.animalClass ?? ''}
            onChange={(v) => update({ animalClass: v })}
            options={ANIMAL_CLASSES.map((c) => ({ value: c, label: t(`animalClass.${c}`) }))}
          />
          <FilterSelect
            id="ecoregion"
            label={t('catalog.ecoregionLabel')}
            value={filters.ecoregion ?? ''}
            onChange={(v) => update({ ecoregion: v })}
            options={withSelected(
              (ecoregions.data ?? []).map((e) => ({ value: e.code, label: e.name })),
              filters.ecoregion,
              selectedEcoregion.data?.name,
            )}
          />
        </form>
      </section>

      {filters.ecoregion && selectedEcoregion.data && (
        <aside className="mt-5 rounded-(--radius-card) border border-forest-100 bg-forest-50 p-5">
          <p className="eyebrow mb-1">{t('catalog.ecoregionBanner')}</p>
          <h2 className="text-2xl font-semibold">{selectedEcoregion.data.name}</h2>
          {selectedEcoregion.data.description && (
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">{selectedEcoregion.data.description}</p>
          )}
        </aside>
      )}

      {/* Resultados */}
      <section id="results" aria-labelledby="results-count" className="mt-8 scroll-mt-24">
        <div className="mb-5 flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p id="results-count" className="text-sm font-medium text-ink-soft" aria-live="polite">
            {data ? t('catalog.results', { count: data.total }) : animals.isPending ? t('states.loading') : ''}
            {animals.isFetching && animals.isPlaceholderData && (
              <span className="ml-2 text-ink-muted">· {t('catalog.updating')}</span>
            )}
          </p>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn btn-secondary min-h-10 py-1.5">
              <span aria-hidden="true">×</span> {t('catalog.clear')}
            </button>
          )}
        </div>

        {animals.isError && !data ? (
          <ErrorState onRetry={() => void animals.refetch()} retrying={animals.isFetching} />
        ) : !data ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <AnimalCardSkeleton />
              </li>
            ))}
          </ul>
        ) : data.data.length === 0 ? (
          <StateMessage title={t('catalog.emptyTitle')} text={t('catalog.emptyText')}>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn btn-primary">
                {t('catalog.clear')}
              </button>
            )}
          </StateMessage>
        ) : (
          <>
            <ul
              className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
                animals.isPlaceholderData ? 'opacity-60' : ''
              }`}
            >
              {data.data.map((animal) => (
                <li key={animal.id}>
                  <AnimalCard animal={animal} />
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Pagination page={data.page} totalPages={data.totalPages} onChange={goToPage} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}

interface Option {
  value: string
  label: string
}

/** Garantiza que el valor seleccionado (p. ej. de un deep link) exista en las opciones. */
function withSelected(options: Option[], selected: string | undefined, selectedLabel: string | undefined): Option[] {
  if (!selected || options.some((o) => o.value === selected)) return options
  return [...options, { value: selected, label: selectedLabel ?? selected }]
}

interface FilterSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string | null) => void
  options: Option[]
}

function FilterSelect({ id, label, value, onChange, options }: FilterSelectProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-ink-soft">
        {label}
      </label>
      <select
        id={id}
        className="field select-field"
        value={value}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">{t('catalog.all')}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
