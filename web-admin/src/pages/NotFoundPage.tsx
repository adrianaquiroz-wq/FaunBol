import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-5xl font-bold text-neutral-300">404</p>
      <h1 className="text-xl font-semibold">{t('notFound.title')}</h1>
      <p className="text-neutral-600">{t('notFound.text')}</p>
      <Link to="/especies" className="btn-primary">
        {t('notFound.home')}
      </Link>
    </div>
  )
}
