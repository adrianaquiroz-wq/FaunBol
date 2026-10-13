import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { queryKeys } from '../api/queryKeys'
import { USER_STATUSES, type UserResponse, type UserStatus } from '../api/types'
import { usersApi } from '../api/users'
import { ErrorAlert } from '../components/ErrorAlert'
import { Modal } from '../components/Modal'
import { Spinner } from '../components/Spinner'
import { useToast } from '../components/toast/useToast'
import { errorText } from '../lib/errors'
import { formatDate, useLang } from '../lib/useLang'

const STATUS_STYLE: Record<UserStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-900',
  APPROVED: 'bg-green-100 text-green-900',
  REJECTED: 'bg-red-100 text-red-900',
  DISABLED: 'bg-neutral-200 text-neutral-700',
}

type Dialog = { kind: 'reject' | 'disable'; user: UserResponse } | null

function isUserStatus(v: string | null): v is UserStatus {
  return !!v && (USER_STATUSES as readonly string[]).includes(v)
}

export function UsersPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('estado')
  const status: UserStatus = isUserStatus(statusParam) ? statusParam : 'PENDING'

  const [dialog, setDialog] = useState<Dialog>(null)
  const [reason, setReason] = useState('')

  const query = useQuery({
    queryKey: queryKeys.usersByStatus(status),
    queryFn: () => usersApi.list({ status }),
  })

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.users })

  const approve = useMutation({
    mutationFn: (id: string) => usersApi.approve(id),
    onSuccess: () => {
      toast.show(t('users.approved'))
      void refresh()
    },
    onError: (err) => {
      toast.show(errorText(err, t), 'error')
      void refresh()
    },
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => usersApi.reject(id, reason),
    onSuccess: () => {
      toast.show(t('users.rejected'))
      setDialog(null)
      void refresh()
    },
  })

  const disable = useMutation({
    mutationFn: (id: string) => usersApi.disable(id),
    onSuccess: () => {
      toast.show(t('users.disabled'))
      setDialog(null)
      void refresh()
    },
  })

  function openDialog(kind: 'reject' | 'disable', user: UserResponse) {
    reject.reset()
    disable.reset()
    setReason('')
    setDialog({ kind, user })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('users.title')}</h1>

      <div className="flex flex-wrap gap-1 border-b border-neutral-200" role="tablist">
        {USER_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={s === status}
            onClick={() => setParams(s === 'PENDING' ? {} : { estado: s })}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              s === status
                ? 'border-green-700 text-green-800'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {t(`users.tabs.${s}`)}
          </button>
        ))}
      </div>

      {query.isPending && <Spinner />}
      {query.isError && <ErrorAlert error={query.error} onRetry={() => void query.refetch()} />}

      {query.data && (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="table-base">
            <thead>
              <tr>
                <th>{t('users.name')}</th>
                <th>{t('users.email')}</th>
                <th>{t('users.institution')}</th>
                <th>{t('users.requestReason')}</th>
                <th>{t('users.role')}</th>
                <th>{t('users.status')}</th>
                <th>{t('users.date')}</th>
                <th className="text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {query.data.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-neutral-500">
                    {t('users.empty')}
                  </td>
                </tr>
              )}
              {query.data.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50">
                  <td className="font-medium">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.institution}</td>
                  <td className="max-w-xs text-neutral-700">
                    {u.requestReason || '—'}
                    {u.status === 'REJECTED' && u.rejectionReason && (
                      <p className="mt-1 text-xs text-red-700">
                        {t('users.rejectionReason')}: {u.rejectionReason}
                      </p>
                    )}
                  </td>
                  <td>{t(`enums.role.${u.role}`)}</td>
                  <td>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLE[u.status]}`}>
                      {t(`enums.userStatus.${u.status}`)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{formatDate(u.createdAt, lang)}</td>
                  <td>
                    {u.role === 'RESEARCHER' && (
                      <div className="flex justify-end gap-2">
                        {u.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              className="btn-primary"
                              disabled={approve.isPending}
                              onClick={() => approve.mutate(u.id)}
                            >
                              {t('users.approve')}
                            </button>
                            <button type="button" className="btn-danger" onClick={() => openDialog('reject', u)}>
                              {t('users.reject')}
                            </button>
                          </>
                        )}
                        {u.status === 'APPROVED' && (
                          <button type="button" className="btn-secondary" onClick={() => openDialog('disable', u)}>
                            {t('users.disable')}
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dialog?.kind === 'reject' && (
        <Modal
          title={t('users.rejectTitle')}
          confirmLabel={t('users.reject')}
          danger
          busy={reject.isPending}
          onCancel={() => setDialog(null)}
          onConfirm={() => reject.mutate({ id: dialog.user.id, reason })}
        >
          <p>{t('users.rejectText', { name: dialog.user.fullName })}</p>
          <div>
            <label className="label" htmlFor="reject-reason">
              {t('users.rejectReason')}
            </label>
            <textarea
              id="reject-reason"
              className="input"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <ErrorAlert error={reject.error} />
        </Modal>
      )}

      {dialog?.kind === 'disable' && (
        <Modal
          title={t('users.disableTitle')}
          confirmLabel={t('users.disable')}
          danger
          busy={disable.isPending}
          onCancel={() => setDialog(null)}
          onConfirm={() => disable.mutate(dialog.user.id)}
        >
          <p>{t('users.disableConfirm', { name: dialog.user.fullName })}</p>
          <ErrorAlert error={disable.error} />
        </Modal>
      )}
    </div>
  )
}
