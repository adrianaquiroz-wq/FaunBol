import type { Page, PageRequest } from '../../shared/domain/pagination.js';
import type { Animal } from './animal.js';
import type { AnimalClass, ConservationStatus } from './enums.js';

export interface AnimalFilters extends PageRequest {
  /** Matches common name (ES/EN) or scientific name, case-insensitive. */
  search?: string;
  iucnStatus?: ConservationStatus;
  animalClass?: AnimalClass;
  ecoregionCode?: string;
}

export interface ScientificNameOwner {
  id: string;
  deleted: boolean;
}

export interface AnimalRepository {
  findById(id: string): Promise<Animal | null>;
  findPage(filters: AnimalFilters): Promise<Page<Animal>>;
  /** Case-insensitive; includes soft-deleted animals. */
  findScientificNameOwner(name: string): Promise<ScientificNameOwner | null>;
  countByIucnStatus(): Promise<Partial<Record<ConservationStatus, number>>>;
  save(animal: Animal): Promise<void>;
  softDelete(id: string): Promise<void>;
}

export const ANIMAL_REPOSITORY = Symbol('ANIMAL_REPOSITORY');
