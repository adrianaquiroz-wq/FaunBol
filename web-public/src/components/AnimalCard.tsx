import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import type { Animal } from '../api/types'
import { AnimalPhoto } from './AnimalPhoto'
import { IucnChip } from './IucnChip'

interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const { t } = useTranslation()

  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-colors hover:border-forest-300 has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ochre-500">
      <div className="relative aspect-[4/3] overflow-hidden">
        <AnimalPhoto
          photo={animal.photo}
          name={animal.commonName}
          variant="thumb"
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3">
          <IucnChip status={animal.iucnStatus} size="sm" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4 sm:p-5">
        <p className="text-[0.7rem] font-semibold tracking-[0.14em] text-ochre-700 uppercase">
          {t(`animalClass.${animal.animalClass}`)}
        </p>
        <h3 className="text-xl leading-snug font-semibold">
          <Link
            to={`/especies/${animal.id}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {animal.commonName}
          </Link>
        </h3>
        <p className="text-sm text-ink-soft italic">{animal.scientificName}</p>
      </div>
    </article>
  )
}

export function AnimalCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-[4/3] animate-pulse bg-sand-200" />
      <div className="space-y-2 p-5">
        <div className="h-3 w-16 animate-pulse rounded bg-sand-200" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-sand-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-sand-200" />
      </div>
    </div>
  )
}
