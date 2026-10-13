/** Fuentes bibliográficas del proyecto. `key` es la clave i18n del título. */
export interface Source {
  key: string
  href: string | null
  label: string
}

export const SOURCES: readonly Source[] = [
  { key: 'sources.iucn', href: 'https://www.iucnredlist.org', label: 'iucnredlist.org' },
  { key: 'sources.redBook', href: 'https://www.mmaya.gob.bo', label: 'MMAyA · mmaya.gob.bo' },
  { key: 'sources.ecoregions', href: null, label: 'Ibisch & Mérida, 2003 · FAN' },
]
