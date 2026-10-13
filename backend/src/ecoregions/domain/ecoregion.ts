import type { LocalizedText } from '../../shared/domain/language.js';

/**
 * One of the 12 ecoregions of Bolivia (Ibisch & Mérida, 2003), the regional
 * frame used by the Bolivian Red Book. Read-only catalog loaded by the seed.
 */
export interface Ecoregion {
  id: string;
  /** Stable slug, e.g. "puna-nortena". Used in URLs and filters. */
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
}

export interface EcoregionWithAnimalCount extends Ecoregion {
  animalCount: number;
}
