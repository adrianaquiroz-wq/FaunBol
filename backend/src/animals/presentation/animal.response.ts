import { ApiProperty } from '@nestjs/swagger';
import { EcoregionSummaryResponse } from '../../ecoregions/presentation/ecoregion.response.js';
import { localize, type Language } from '../../shared/domain/language.js';
import type { Animal } from '../domain/animal.js';
import {
  AnimalClass,
  ConservationStatus,
  PopulationTrend,
} from '../domain/enums.js';
import type { AnimalStats } from '../application/query-animals.use-cases.js';

export class PhotoResponse {
  @ApiProperty()
  url: string;

  @ApiProperty({ description: '600×450 cropped version for cards' })
  thumbnailUrl: string;

  @ApiProperty({ nullable: true, type: String })
  credit: string | null;
}

class AnimalBaseResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Panthera onca' })
  scientificName: string;

  @ApiProperty({ enum: AnimalClass, enumName: 'AnimalClass' })
  animalClass: AnimalClass;

  @ApiProperty({ enum: ConservationStatus, enumName: 'ConservationStatus' })
  iucnStatus: ConservationStatus;

  @ApiProperty({
    enum: ConservationStatus,
    enumName: 'ConservationStatus',
    nullable: true,
  })
  boliviaRedBookStatus: ConservationStatus | null;

  @ApiProperty({
    enum: PopulationTrend,
    enumName: 'PopulationTrend',
    nullable: true,
  })
  populationTrend: PopulationTrend | null;

  @ApiProperty({ nullable: true, type: Number })
  estimatedPopulation: number | null;

  @ApiProperty({ example: 'Beni, Pando, Santa Cruz' })
  distribution: string;

  @ApiProperty()
  sourceReference: string;

  @ApiProperty({ type: PhotoResponse, nullable: true })
  photo: PhotoResponse | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

function baseFields(animal: Animal) {
  const { data, photo } = animal;
  return {
    id: animal.id,
    scientificName: data.scientificName,
    animalClass: data.animalClass,
    iucnStatus: data.iucnStatus,
    boliviaRedBookStatus: data.boliviaRedBookStatus,
    populationTrend: data.populationTrend,
    estimatedPopulation: data.estimatedPopulation,
    distribution: data.distribution,
    sourceReference: data.sourceReference,
    photo: photo && {
      url: photo.url,
      thumbnailUrl: photo.thumbnailUrl,
      credit: photo.credit,
    },
    createdAt: animal.createdAt,
    updatedAt: animal.updatedAt,
  };
}

/** Public view: texts in the requested language (Spanish fallback). */
export class AnimalResponse extends AnimalBaseResponse {
  @ApiProperty({ example: 'Jaguar' })
  commonName: string;

  @ApiProperty({ nullable: true, type: String })
  description: string | null;

  @ApiProperty({ nullable: true, type: String })
  threats: string | null;

  @ApiProperty()
  habitat: string;

  @ApiProperty({ type: [EcoregionSummaryResponse] })
  ecoregions: EcoregionSummaryResponse[];

  static from(animal: Animal, lang: Language): AnimalResponse {
    const { data } = animal;
    return {
      ...baseFields(animal),
      commonName: localize(data.commonName, lang),
      description: localize(data.description, lang),
      threats: localize(data.threats, lang),
      habitat: localize(data.habitat, lang),
      ecoregions: data.ecoregions.map((e) =>
        EcoregionSummaryResponse.from(e, lang),
      ),
    };
  }
}

/** Editing view for the admin web: both languages, raw values. */
export class AnimalFullResponse extends AnimalBaseResponse {
  @ApiProperty() commonNameEs: string;
  @ApiProperty({ nullable: true, type: String }) commonNameEn: string | null;
  @ApiProperty({ nullable: true, type: String }) descriptionEs: string | null;
  @ApiProperty({ nullable: true, type: String }) descriptionEn: string | null;
  @ApiProperty({ nullable: true, type: String }) threatsEs: string | null;
  @ApiProperty({ nullable: true, type: String }) threatsEn: string | null;
  @ApiProperty() habitatEs: string;
  @ApiProperty({ nullable: true, type: String }) habitatEn: string | null;

  @ApiProperty({ type: [String], format: 'uuid' })
  ecoregionIds: string[];

  static from(animal: Animal): AnimalFullResponse {
    const { data } = animal;
    return {
      ...baseFields(animal),
      commonNameEs: data.commonName.es,
      commonNameEn: data.commonName.en,
      descriptionEs: data.description.es,
      descriptionEn: data.description.en,
      threatsEs: data.threats.es,
      threatsEn: data.threats.en,
      habitatEs: data.habitat.es,
      habitatEn: data.habitat.en,
      ecoregionIds: data.ecoregions.map((e) => e.id),
    };
  }
}

export class PaginatedAnimalsResponse {
  @ApiProperty({ type: [AnimalResponse] })
  data: AnimalResponse[];

  @ApiProperty({ example: 42 }) total: number;
  @ApiProperty({ example: 1 }) page: number;
  @ApiProperty({ example: 12 }) limit: number;
  @ApiProperty({ example: 4 }) totalPages: number;
}

export class AnimalStatsResponse {
  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({
    example: { LC: 0, NT: 1, VU: 3, EN: 5, CR: 1, EW: 0, EX: 0, DD: 0 },
    description: 'Animals per IUCN category (every category present)',
  })
  byIucnStatus: AnimalStats['byIucnStatus'];
}
