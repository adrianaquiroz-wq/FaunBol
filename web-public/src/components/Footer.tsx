import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { NAV_ITEMS } from '../lib/nav'
import { SOURCES } from '../lib/sources'
import { Logo } from './Logo'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-topo mt-20 text-sand-100">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1.4fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="max-w-sm text-sm leading-relaxed text-sand-200">{t('footer.note')}</p>
        </div>

        <div>
          <h2 className="mb-3 font-sans text-xs font-semibold tracking-[0.18em] text-ochre-300 uppercase">
            {t('footer.explore')}
          </h2>
          <ul className="space-y-1.5 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sand-100 underline-offset-4 hover:underline">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-sans text-xs font-semibold tracking-[0.18em] text-ochre-300 uppercase">
            {t('footer.sourcesTitle')}
          </h2>
          <ul className="space-y-2 text-sm">
            {SOURCES.map((source) => (
              <li key={source.key}>
                {source.href ? (
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sand-100 underline-offset-4 hover:underline"
                  >
                    {t(source.key)}
                  </a>
                ) : (
                  <span>{t(source.key)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-sand-200">
          © {YEAR} FaunBol · {t('footer.course')}
        </p>
      </div>
    </footer>
  )
}
