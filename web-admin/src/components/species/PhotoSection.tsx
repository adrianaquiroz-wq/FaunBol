import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { animalsApi } from '../../api/animals'
import { queryKeys } from '../../api/queryKeys'
import type { AnimalFullResponse } from '../../api/types'
import { useToast } from '../toast/useToast'
import { ErrorAlert } from '../ErrorAlert'
import { Modal } from '../Modal'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

export function PhotoSection({ animal }: { animal: AnimalFullResponse }) {
  const { t } = useTranslation()
  const toast = useToast()
  const queryClient = useQueryClient()
  const fileInput = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [credit, setCredit] = useState(animal.photo?.credit ?? '')
  const [fileError, setFileError] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

  // Release the object URL of the preview.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function onUpdated(updated: AnimalFullResponse) {
    queryClient.setQueryData(queryKeys.animalFull(animal.id), updated)
    void queryClient.invalidateQueries({ queryKey: ['animals', 'list'] })
  }

  function clearFile() {
    setFile(null)
    setPreviewUrl(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  const upload = useMutation({
    mutationFn: (f: File) => animalsApi.uploadPhoto(animal.id, f, credit),
    onSuccess: (updated) => {
      onUpdated(updated)
      clearFile()
      setCredit(updated.photo?.credit ?? '')
      toast.show(t('photo.uploaded'))
    },
  })

  const remove = useMutation({
    mutationFn: () => animalsApi.removePhoto(animal.id),
    onSuccess: (updated) => {
      onUpdated(updated)
      setConfirmRemove(false)
      setCredit('')
      toast.show(t('photo.removed'))
    },
  })

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    upload.reset()
    setFileError(null)
    const f = e.target.files?.[0] ?? null
    if (!f) return clearFile()
    if (!ACCEPTED.includes(f.type)) {
      clearFile()
      return setFileError(t('errors.PHOTO_INVALID_TYPE'))
    }
    if (f.size > MAX_BYTES) {
      clearFile()
      return setFileError(t('errors.PHOTO_TOO_LARGE'))
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function onUpload() {
    if (!file) return setFileError(t('errors.PHOTO_REQUIRED'))
    upload.mutate(file)
  }

  const photo = animal.photo

  return (
    <section className="card space-y-4">
      <h2 className="text-lg font-semibold">{t('photo.title')}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="label">{t('photo.current')}</p>
          {photo ? (
            <figure>
              <img
                src={photo.thumbnailUrl || photo.url}
                alt={animal.commonNameEs}
                className="max-h-56 rounded border border-neutral-200 object-cover"
              />
              {photo.credit && (
                <figcaption className="mt-1 text-xs text-neutral-500">© {photo.credit}</figcaption>
              )}
            </figure>
          ) : (
            <p className="text-sm text-neutral-500">{t('photo.none')}</p>
          )}
          {photo && (
            <button
              type="button"
              className="btn-danger mt-3"
              onClick={() => {
                remove.reset()
                setConfirmRemove(true)
              }}
            >
              {t('photo.remove')}
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="photo-file">
              {t('photo.file')}
            </label>
            <input
              ref={fileInput}
              id="photo-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-200 file:px-3 file:py-1.5 file:text-sm"
              onChange={onFileChange}
            />
          </div>
          {previewUrl && (
            <div>
              <p className="label">{t('photo.preview')}</p>
              <img src={previewUrl} alt="" className="max-h-48 rounded border border-neutral-200 object-cover" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="photo-credit">
              {t('photo.credit')} <span className="font-normal text-neutral-500">({t('common.optional')})</span>
            </label>
            <input
              id="photo-credit"
              className="input"
              placeholder={t('photo.creditPlaceholder')}
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
            />
          </div>
          {fileError && (
            <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
              {fileError}
            </p>
          )}
          <ErrorAlert error={upload.error} />
          <button type="button" className="btn-primary" disabled={upload.isPending || !file} onClick={onUpload}>
            {upload.isPending ? t('photo.uploading') : t('photo.upload')}
          </button>
        </div>
      </div>

      {confirmRemove && (
        <Modal
          title={t('photo.remove')}
          confirmLabel={t('photo.remove')}
          danger
          busy={remove.isPending}
          onCancel={() => setConfirmRemove(false)}
          onConfirm={() => remove.mutate()}
        >
          <p>{t('photo.removeConfirm')}</p>
          <ErrorAlert error={remove.error} />
        </Modal>
      )}
    </section>
  )
}
