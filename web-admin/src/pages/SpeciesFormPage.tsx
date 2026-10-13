import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { animalsApi } from '../api/animals'
import { queryKeys } from '../api/queryKeys'
import { ErrorAlert } from '../components/ErrorAlert'
import { Spinner } from '../components/Spinner'
import { PhotoSection } from '../components/species/PhotoSection'
import { SpeciesForm } from '../components/species/SpeciesForm'
import { useToast } from '../components/toast/useToast'
import {
  emptySpeciesValues,
  toAnimalInput,
  toFormValues,
  type SpeciesFormValues,
} from '../lib/speciesForm'

/** /especies/nueva and /especies/:id/editar */
export function SpeciesFormPage() {
  const { id } = useParams()
  return id ? <EditSpecies key={id} id={id} /> : <CreateSpecies />
}

function BackLink() {
  const { t } = useTranslation()
  return (
    <Link to="/especies" className="text-sm text-green-700 hover:underline">
      ← {t('common.back')}
    </Link>
  )
}

function CreateSpecies() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (values: SpeciesFormValues) => animalsApi.create(toAnimalInput(values)),
    onSuccess: (created) => {
      queryClient.setQueryData(queryKeys.animalFull(created.id), created)
      void queryClient.invalidateQueries({ queryKey: ['animals', 'list'] })
      void navigate(`/especies/${created.id}/editar`, { replace: true, state: { justCreated: true } })
    },
  })

  return (
    <div className="space-y-4">
      <BackLink />
      <h1 className="text-2xl font-semibold">{t('form.createTitle')}</h1>
      <SpeciesForm
        initialValues={emptySpeciesValues()}
        submitLabel={t('form.create')}
        submitting={create.isPending}
        submitError={create.error}
        onSubmit={(values) => create.mutate(values)}
      />
      <p className="card text-sm text-neutral-500">{t('photo.availableAfterCreate')}</p>
    </div>
  )
}

function EditSpecies({ id }: { id: string }) {
  const { t } = useTranslation()
  const toast = useToast()
  const location = useLocation()
  const queryClient = useQueryClient()
  const justCreated = (location.state as { justCreated?: boolean } | null)?.justCreated === true

  const query = useQuery({
    queryKey: queryKeys.animalFull(id),
    queryFn: () => animalsApi.getFull(id),
  })

  const update = useMutation({
    mutationFn: (values: SpeciesFormValues) => animalsApi.update(id, toAnimalInput(values)),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.animalFull(id), updated)
      void queryClient.invalidateQueries({ queryKey: ['animals', 'list'] })
      toast.show(t('form.updated'))
    },
  })

  return (
    <div className="space-y-4">
      <BackLink />
      <h1 className="text-2xl font-semibold">
        {t('form.editTitle')}
        {query.data && <span className="ml-2 font-normal text-neutral-500 italic">{query.data.scientificName}</span>}
      </h1>

      {justCreated && (
        <p className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-900">
          {t('form.created')}
        </p>
      )}

      {query.isPending && <Spinner />}
      {query.isError && (
        <div className="space-y-2">
          <p className="text-sm text-neutral-600">{t('form.loadError')}</p>
          <ErrorAlert error={query.error} onRetry={() => void query.refetch()} />
        </div>
      )}

      {query.data && (
        <>
          <PhotoSection animal={query.data} />
          <SpeciesForm
            initialValues={toFormValues(query.data)}
            submitLabel={t('form.saveChanges')}
            submitting={update.isPending}
            submitError={update.error}
            onSubmit={(values) => update.mutate(values)}
          />
        </>
      )}
    </div>
  )
}
