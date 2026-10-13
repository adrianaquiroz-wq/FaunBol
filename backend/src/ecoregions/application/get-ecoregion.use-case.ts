import { NotFoundError } from '../../shared/domain/errors.js';
import type { EcoregionWithAnimalCount } from '../domain/ecoregion.js';
import type { EcoregionRepository } from '../domain/ecoregion.repository.js';

export class GetEcoregionUseCase {
  constructor(private readonly ecoregions: EcoregionRepository) {}

  async execute(code: string): Promise<EcoregionWithAnimalCount> {
    const ecoregion = await this.ecoregions.findByCode(code);
    if (!ecoregion) {
      throw new NotFoundError(
        `Ecoregion "${code}" not found`,
        'ECOREGION_NOT_FOUND',
      );
    }
    return ecoregion;
  }
}
