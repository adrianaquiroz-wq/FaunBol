import type { Ecoregion, EcoregionWithAnimalCount } from './ecoregion.js';

export interface EcoregionRepository {
  findAllWithAnimalCount(): Promise<EcoregionWithAnimalCount[]>;
  findByCode(code: string): Promise<EcoregionWithAnimalCount | null>;
  findByIds(ids: string[]): Promise<Ecoregion[]>;
}

export const ECOREGION_REPOSITORY = Symbol('ECOREGION_REPOSITORY');
