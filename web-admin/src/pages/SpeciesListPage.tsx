import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { animalsApi, type AnimalListParams } from '../api/animals'
import { queryKeys } from '../api/queryKeys'
import { CONSERVATION_STATUSES, type AnimalResponse, type ConservationStatus } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { ErrorAlert } from '../components/ErrorAlert'
import { IucnChip } from '../components/IucnChip'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { Spinner } from '../components/Spinner'
import { useToast } from '../components/toast/useToast'
import { useLang } from '../lib/useLang'

const PAGE_SIZE = 10

function isStatus(v: string | null): v is ConservationStatus {
  return !!v && (CONSERVATION_STATUSES as readonly string[]).includes(v)
}

export function SpeciesListPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const { isAdmin } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()

  const page = Math.max(1, Number(params.get('page')) || 1)
  const search = params.get('q') ?? ''
  const iucnParam = params.get('iucn')
  const iucnStatus: ConservationStatus | '' = isStatus(iucnParam) ? iucnParam : ''

  const [searchInput, setSearchInput] = useState(search)
  const [toDelete, setToDelete] = useState<AnimalResponse | null>(null)

  const listParams: AnimalListParams = { page, limit: PAGE_SIZE, search: search || undefined, iucnStatus, lang }
  const query = useQuery({
    queryKey: queryKeys.animalList(listParams),
    queryFn: () => animalsApi.list(listParams),
    placeholderData: keepPreviousData,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => animalsApi.remove(id),
    onSuccess: () => {
      toast.show(t('species.deleted'))
      setToDelete(null)
      void queryClient.invalidateQueries({ queryKey: queryKeys.animals })
    },
  })

  function update(next: Record<string, string | null>) {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    setParams(p)
  }

  function onSearch(e: FormEvent) {
    e.preventDefault()
    update({ q: searchInput.trim() || null, page: null })
  }

  const data = query.data

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{t('species.title')}</h1>
        <Link to="/especies/nueva" className="btn-primary">
          + {t('species.new')}
        </Link>
      </div>

      <div className="card flex flex-col gap-3 sm:flex-row sm:items-end">
        <form onSubmit={onSearch} className="flex flex-1 gap-2">
          <input
            type="search"
            className="input"
            placeholder={t('species.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label={t('species.searchPlaceholder')}
          />
          <button type="submit" className="btn-secondary">
            {t('common.search')}
          </button>
        </form>
        <div className="sm:w-64">
          <label className="label" htmlFor="iucn-filter">
            {t('species.filterIucn')}
          </label>
          <select
            id="iucn-filter"
            className="input"
            value={iucnStatus}
            onChange={(e) => update({ iucn: e.target.value || null, page: null })}
          >
            <option value="">{t('species.allCategories')}</option>
            {CONSERVATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s} – {t(`enums.iucn.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {query.isError && <ErrorAlert error={query.error} onRetry={() => void query.refetch()} />}
      {query.isPending && <Spinner />}

      {data && (
        <>
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="table-base">
              <thead>
                <tr>
                  <th>{t('species.photo')}</th>
                  <th>{t('species.commonName')}</th>
                  <th>{t('species.scientificName')}</th>
                  <th>{t('species.iucn')}</th>
                  <th>{t('species.class')}</th>
                  <th className="text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-neutral-500">
                      {t('species.empty')}
                    </td>
                  </tr>
                )}
                {data.data.map((a) => (
                  <tr key={a.id} className="hover:bg-neutral-50">
                    <td>
                      {a.photo ? (
                        <img
                          src={a.photo.thumbnailUrl || a.photo.url}
                          alt={a.commonName}
                          className="h-12 w-16 rounded object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded bg-neutral-100 text-center text-[10px] text-neutral-400">
                          {t('species.noPhoto')}
                        </div>
                      )}
                    </td>
                    <td className="font-medium">{a.commonName}</td>
                    <td className="italic">{a.scientificName}</td>
                    <td>
                      <IucnChip status={a.iucnStatus} />
                    </td>
                    <td>{t(`enums.animalClass.${a.animalClass}`)}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link to={`/especies/${a.id}/editar`} className="btn-secondary">
                          {t('common.edit')}
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => {
                              deleteMutation.reset()
                              setToDelete(a)
                            }}
                          >
                            {t('common.delete')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            onChange={(p) => update({ page: p > 1 ? String(p) : null })}
          />
        </>
      )}

      {toDelete && isAdmin && (
        <Modal
          title={t('species.deleteTitle')}
          confirmLabel={t('common.delete')}
          danger
          busy={deleteMutation.isPending}
          onCancel={() => setToDelete(null)}
          onConfirm={() => deleteMutation.mutate(toDelete.id)}
        >
          <p>{t('species.deleteConfirm', { name: toDelete.commonName })}</p>
          <ErrorAlert error={deleteMutation.error} />
        </Modal>
      )}
    </div>
  )
}
