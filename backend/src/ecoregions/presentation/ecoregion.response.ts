import { ApiProperty } from '@nestjs/swagger';
import { localize, type Language } from '../../shared/domain/language.js';
import type {
  Ecoregion,
  EcoregionWithAnimalCount,
} from '../domain/ecoregion.js';

export class EcoregionSummaryResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'puna-nortena' })
  code: string;

  @ApiProperty({ example: 'Puna norteña' })
  name: string;

  static from(ecoregion: Ecoregion, lang: Language): EcoregionSummaryResponse {
    return {
      id: ecoregion.id,
      code: ecoregion.code,
      name: localize(ecoregion.name, lang),
    };
  }
}

export class EcoregionResponse extends EcoregionSummaryResponse {
  @ApiProperty()
  description: string;

  @ApiProperty({ example: 4, description: 'Animals registered in it' })
  animalCount: number;

  static fromWithCount(
    ecoregion: EcoregionWithAnimalCount,
    lang: Language,
  ): EcoregionResponse {
    return {
      ...EcoregionSummaryResponse.from(ecoregion, lang),
      description: localize(ecoregion.description, lang),
      animalCount: ecoregion.animalCount,
    };
  }
}
