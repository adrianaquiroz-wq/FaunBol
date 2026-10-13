import { useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ecoregionsApi } from '../../api/ecoregions'
import { queryKeys } from '../../api/queryKeys'
import { ANIMAL_CLASSES, CONSERVATION_STATUSES, POPULATION_TRENDS } from '../../api/types'
import {
  validateSpecies,
  type SpeciesFormErrors,
  type SpeciesFormValues,
} from '../../lib/speciesForm'
import { useLang } from '../../lib/useLang'
import { ErrorAlert } from '../ErrorAlert'
import { Field } from '../Field'
import { Spinner } from '../Spinner'

type TextKey = Exclude<keyof SpeciesFormValues, 'ecoregionIds'>

interface Props {
  initialValues: SpeciesFormValues
  submitLabel: string
  submitting: boolean
  submitError: unknown
  onSubmit: (values: SpeciesFormValues) => void
}

export function SpeciesForm({ initialValues, submitLabel, submitting, submitError, onSubmit }: Props) {
  const { t } = useTranslation()
  const lang = useLang()
  const [values, setValues] = useState<SpeciesFormValues>(initialValues)
  const [errors, setErrors] = useState<SpeciesFormErrors>({})

  const ecoregions = useQuery({
    queryKey: queryKeys.ecoregions(lang),
    queryFn: () => ecoregionsApi.list(lang),
  })

  function set(key: TextKey, value: string) {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function toggleEcoregion(id: string) {
    setValues((v) => ({
      ...v,
      ecoregionIds: v.ecoregionIds.includes(id)
        ? v.ecoregionIds.filter((x) => x !== id)
        : [...v.ecoregionIds, id],
    }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateSpecies(values)
    setErrors(found)
    if (Object.keys(found).length === 0) onSubmit(values)
  }

  /** Text input bound to a form key. */
  const input = (key: TextKey, extra?: { type?: string; italic?: boolean }) => (
    <input
      id={key}
      type={extra?.type ?? 'text'}
      min={extra?.type === 'number' ? 0 : undefined}
      step={extra?.type === 'number' ? 1 : undefined}
      className={`input ${extra?.italic ? 'italic' : ''} ${errors[key] ? 'border-red-500' : ''}`}
      value={values[key]}
      onChange={(e) => set(key, e.target.value)}
    />
  )

  const textarea = (key: TextKey, rows = 4) => (
    <textarea
      id={key}
      rows={rows}
      className={`input ${errors[key] ? 'border-red-500' : ''}`}
      value={values[key]}
      onChange={(e) => set(key, e.target.value)}
    />
  )

  /** A Spanish/English pair: side by side on desktop, stacked on mobile. */
  const pair = (label: string, esKey: TextKey, enKey: TextKey, kind: 'input' | 'textarea', esRequired: boolean) => (
    <div className="grid gap-4 md:grid-cols-2">
      <Field id={esKey} label={`${label} (${t('form.spanish')})`} required={esRequired} error={errors[esKey]}>
        {kind === 'input' ? input(esKey) : textarea(esKey)}
      </Field>
      <Field id={enKey} label={`${label} (${t('form.english')})`} optional error={errors[enKey]}>
        {kind === 'input' ? input(enKey) : textarea(enKey)}
      </Field>
    </div>
  )

  const hasErrors = Object.values(errors).some(Boolean)

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <p className="text-sm text-neutral-600">
        {t('form.requiredHint')} {t('form.enOptional')}
      </p>

      <section className="card space-y-4">
        {pair(t('form.commonName'), 'commonNameEs', 'commonNameEn', 'input', true)}
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="scientificName" label={t('form.scientificName')} required error={errors.scientificName}>
            {input('scientificName', { italic: true })}
          </Field>
          <Field id="animalClass" label={t('form.animalClass')} required error={errors.animalClass}>
            <select id="animalClass" className="input" value={values.animalClass} onChange={(e) => set('animalClass', e.target.value)}>
              <option value="">{t('form.selectPlaceholder')}</option>
              {ANIMAL_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {t(`enums.animalClass.${c}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="iucnStatus" label={t('form.iucnStatus')} required error={errors.iucnStatus}>
            <select id="iucnStatus" className="input" value={values.iucnStatus} onChange={(e) => set('iucnStatus', e.target.value)}>
              <option value="">{t('form.selectPlaceholder')}</option>
              {CONSERVATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} – {t(`enums.iucn.${s}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="boliviaRedBookStatus" label={t('form.boliviaRedBookStatus')}>
            <select
              id="boliviaRedBookStatus"
              className="input"
              value={values.boliviaRedBookStatus}
              onChange={(e) => set('boliviaRedBookStatus', e.target.value)}
            >
              <option value="">{t('form.notEvaluated')}</option>
              {CONSERVATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} – {t(`enums.iucn.${s}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="populationTrend" label={t('form.populationTrend')}>
            <select
              id="populationTrend"
              className="input"
              value={values.populationTrend}
              onChange={(e) => set('populationTrend', e.target.value)}
            >
              <option value="">{t('form.notSpecified')}</option>
              {POPULATION_TRENDS.map((p) => (
                <option key={p} value={p}>
                  {t(`enums.trend.${p}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="estimatedPopulation" label={t('form.estimatedPopulation')} optional error={errors.estimatedPopulation}>
            {input('estimatedPopulation', { type: 'number' })}
          </Field>
        </div>
      </section>

      <section className="card space-y-4">
        {pair(t('form.habitat'), 'habitatEs', 'habitatEn', 'textarea', true)}
        {pair(t('form.description'), 'descriptionEs', 'descriptionEn', 'textarea', false)}
        {pair(t('form.threats'), 'threatsEs', 'threatsEn', 'textarea', false)}
      </section>

      <section className="card space-y-4">
        <Field
          id="distribution"
          label={t('form.distribution')}
          required
          help={t('form.distributionHelp')}
          error={errors.distribution}
        >
          {input('distribution')}
        </Field>
        <Field id="sourceReference" label={t('form.sourceReference')} required error={errors.sourceReference}>
          {textarea('sourceReference', 2)}
        </Field>
        <fieldset>
          <legend className="label">{t('form.ecoregions')}</legend>
          {ecoregions.isPending && <Spinner />}
          {ecoregions.isError && (
            <ErrorAlert error={ecoregions.error} onRetry={() => void ecoregions.refetch()} />
          )}
          {ecoregions.data && (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ecoregions.data.map((eco) => (
                <label key={eco.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-green-700"
                    checked={values.ecoregionIds.includes(eco.id)}
                    onChange={() => toggleEcoregion(eco.id)}
                  />
                  {eco.name}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </section>

      {hasErrors && <p className="text-sm text-red-700">{t('form.fixErrors')}</p>}
      <ErrorAlert error={submitError} />

      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? t('common.saving') : submitLabel}
        </button>
      </div>
    </form>
  )
}
