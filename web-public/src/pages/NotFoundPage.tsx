import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { StateMessage } from '../components/StateMessage'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export function NotFoundPage() {
  const { t } = useTranslation()
  useDocumentTitle(t('states.notFoundTitle'))

  return (
    <div className="container-page py-16 sm:py-24">
      <h1 className="sr-only">{t('states.notFoundTitle')}</h1>
      <p className="mb-6 text-center font-display text-7xl font-semibold text-forest-100 sm:text-8xl" aria-hidden="true">
        404
      </p>
      <StateMessage title={t('states.notFoundTitle')} text={t('states.notFoundText')}>
        <Link to="/" className="btn btn-primary">
          {t('states.goHome')}
        </Link>
        <Link to="/especies" className="btn btn-secondary">
          {t('states.goCatalog')}
        </Link>
      </StateMessage>
    </div>
  )
}
