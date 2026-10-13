import type { Page } from '../../shared/domain/pagination.js';
import type { Animal } from '../domain/animal.js';
import type {
  AnimalFilters,
  AnimalRepository,
} from '../domain/animal.repository.js';
import { ConservationStatus } from '../domain/enums.js';
import { findAnimalOrFail } from './manage-animal.use-cases.js';

export class GetAnimalUseCase {
  constructor(private readonly animals: AnimalRepository) {}

  execute(id: string): Promise<Animal> {
    return findAnimalOrFail(this.animals, id);
  }
}

export class ListAnimalsUseCase {
  constructor(private readonly animals: AnimalRepository) {}

  execute(filters: AnimalFilters): Promise<Page<Animal>> {
    return this.animals.findPage(filters);
  }
}

export interface AnimalStats {
  total: number;
  /** Every IUCN category is present, with 0 when there are no animals. */
  byIucnStatus: Record<ConservationStatus, number>;
}

export class GetAnimalStatsUseCase {
  constructor(private readonly animals: AnimalRepository) {}

  async execute(): Promise<AnimalStats> {
    const counts = await this.animals.countByIucnStatus();
    const byIucnStatus = Object.fromEntries(
      Object.values(ConservationStatus).map((s) => [s, counts[s] ?? 0]),
    ) as Record<ConservationStatus, number>;
    const total = Object.values(byIucnStatus).reduce((a, b) => a + b, 0);
    return { total, byIucnStatus };
  }
}
