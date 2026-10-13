import type { EcoregionWithAnimalCount } from '../domain/ecoregion.js';
import type { EcoregionRepository } from '../domain/ecoregion.repository.js';

export class ListEcoregionsUseCase {
  constructor(private readonly ecoregions: EcoregionRepository) {}

  execute(): Promise<EcoregionWithAnimalCount[]> {
    return this.ecoregions.findAllWithAnimalCount();
  }
}
