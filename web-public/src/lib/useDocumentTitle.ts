import { useEffect } from 'react'

const APP_NAME = 'FaunBol'

/** Fija el título del documento: "<título> · FaunBol". */
export function useDocumentTitle(title: string | undefined | null) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME
  }, [title])
}
