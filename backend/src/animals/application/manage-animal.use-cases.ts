import type { EcoregionRepository } from '../../ecoregions/domain/ecoregion.repository.js';
import type { Ecoregion } from '../../ecoregions/domain/ecoregion.js';
import {
  ConflictError,
  InvalidInputError,
  NotFoundError,
} from '../../shared/domain/errors.js';
import type {
  LocalizedText,
  OptionalLocalizedText,
} from '../../shared/domain/language.js';
import { Animal, type AnimalData } from '../domain/animal.js';
import type { AnimalRepository } from '../domain/animal.repository.js';
import type {
  AnimalClass,
  ConservationStatus,
  PopulationTrend,
} from '../domain/enums.js';

/** Flat input shared by create and update: one field per language. */
export interface AnimalInput {
  commonNameEs: string;
  commonNameEn?: string | null;
  scientificName: string;
  animalClass: AnimalClass;
  descriptionEs?: string | null;
  descriptionEn?: string | null;
  iucnStatus: ConservationStatus;
  boliviaRedBookStatus?: ConservationStatus | null;
  threatsEs?: string | null;
  threatsEn?: string | null;
  populationTrend?: PopulationTrend | null;
  estimatedPopulation?: number | null;
  habitatEs: string;
  habitatEn?: string | null;
  distribution: string;
  sourceReference: string;
  ecoregionIds?: string[];
}

/** In an update, `undefined` keeps the current value and `null` clears it. */
export type AnimalChanges = Partial<AnimalInput>;

export async function findAnimalOrFail(
  animals: AnimalRepository,
  id: string,
): Promise<Animal> {
  const animal = await animals.findById(id);
  if (!animal) {
    throw new NotFoundError(`Animal "${id}" not found`, 'ANIMAL_NOT_FOUND');
  }
  return animal;
}

export class CreateAnimalUseCase {
  constructor(
    private readonly animals: AnimalRepository,
    private readonly ecoregions: EcoregionRepository,
  ) {}

  async execute(input: AnimalInput): Promise<Animal> {
    await ensureScientificNameAvailable(this.animals, input.scientificName);
    const animal = Animal.create({
      commonName: required(input.commonNameEs, input.commonNameEn),
      scientificName: input.scientificName.trim(),
      animalClass: input.animalClass,
      description: optional(input.descriptionEs, input.descriptionEn),
      iucnStatus: input.iucnStatus,
      boliviaRedBookStatus: input.boliviaRedBookStatus ?? null,
      threats: optional(input.threatsEs, input.threatsEn),
      populationTrend: input.populationTrend ?? null,
      estimatedPopulation: input.estimatedPopulation ?? null,
      habitat: required(input.habitatEs, input.habitatEn),
      distribution: input.distribution.trim(),
      sourceReference: input.sourceReference.trim(),
      ecoregions: await resolveEcoregions(
        this.ecoregions,
        input.ecoregionIds ?? [],
      ),
    });
    await this.animals.save(animal);
    return animal;
  }
}

export class UpdateAnimalUseCase {
  constructor(
    private readonly animals: AnimalRepository,
    private readonly ecoregions: EcoregionRepository,
  ) {}

  async execute(id: string, changes: AnimalChanges): Promise<Animal> {
    const animal = await findAnimalOrFail(this.animals, id);
    const current = animal.data;

    if (
      changes.scientificName &&
      changes.scientificName.trim().toLowerCase() !==
        current.scientificName.toLowerCase()
    ) {
      await ensureScientificNameAvailable(this.animals, changes.scientificName);
    }

    const next: AnimalData = {
      commonName: mergeRequired(
        current.commonName,
        changes.commonNameEs,
        changes.commonNameEn,
      ),
      scientificName: changes.scientificName?.trim() || current.scientificName,
      animalClass: changes.animalClass ?? current.animalClass,
      description: mergeOptional(
        current.description,
        changes.descriptionEs,
        changes.descriptionEn,
      ),
      iucnStatus: changes.iucnStatus ?? current.iucnStatus,
      boliviaRedBookStatus: keep(
        changes.boliviaRedBookStatus,
        current.boliviaRedBookStatus,
      ),
      threats: mergeOptional(
        current.threats,
        changes.threatsEs,
        changes.threatsEn,
      ),
      populationTrend: keep(changes.populationTrend, current.populationTrend),
      estimatedPopulation: keep(
        changes.estimatedPopulation,
        current.estimatedPopulation,
      ),
      habitat: mergeRequired(
        current.habitat,
        changes.habitatEs,
        changes.habitatEn,
      ),
      distribution: changes.distribution?.trim() || current.distribution,
      sourceReference:
        changes.sourceReference?.trim() || current.sourceReference,
      ecoregions:
        changes.ecoregionIds === undefined
          ? current.ecoregions
          : await resolveEcoregions(this.ecoregions, changes.ecoregionIds),
    };

    animal.update(next);
    await this.animals.save(animal);
    return animal;
  }
}

export class DeleteAnimalUseCase {
  constructor(private readonly animals: AnimalRepository) {}

  /** Soft delete: the record (and its photo) is kept for traceability. */
  async execute(id: string): Promise<void> {
    await findAnimalOrFail(this.animals, id);
    await this.animals.softDelete(id);
  }
}

async function ensureScientificNameAvailable(
  animals: AnimalRepository,
  scientificName: string,
) {
  const owner = await animals.findScientificNameOwner(scientificName.trim());
  if (!owner) return;
  throw new ConflictError(
    owner.deleted
      ? `An animal with scientific name "${scientificName}" already exists but was deleted`
      : `An animal with scientific name "${scientificName}" already exists`,
    'SCIENTIFIC_NAME_TAKEN',
  );
}

async function resolveEcoregions(
  repository: EcoregionRepository,
  ids: string[],
): Promise<Ecoregion[]> {
  const unique = [...new Set(ids)];
  const found = await repository.findByIds(unique);
  if (found.length !== unique.length) {
    const known = new Set(found.map((e) => e.id));
    throw new InvalidInputError(
      'Some ecoregions do not exist',
      'UNKNOWN_ECOREGION',
      { ids: unique.filter((id) => !known.has(id)) },
    );
  }
  return found;
}

function clean(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function required(es: string, en?: string | null): LocalizedText {
  return { es: es.trim(), en: clean(en) };
}

function optional(
  es?: string | null,
  en?: string | null,
): OptionalLocalizedText {
  return { es: clean(es), en: clean(en) };
}

function keep<T>(change: T | null | undefined, current: T | null): T | null {
  return change === undefined ? current : change;
}

function mergeRequired(
  current: LocalizedText,
  es?: string | null,
  en?: string | null,
): LocalizedText {
  return {
    es: clean(es) ?? current.es,
    en: en === undefined ? current.en : clean(en),
  };
}

function mergeOptional(
  current: OptionalLocalizedText,
  es?: string | null,
  en?: string | null,
): OptionalLocalizedText {
  return {
    es: es === undefined ? current.es : clean(es),
    en: en === undefined ? current.en : clean(en),
  };
}
