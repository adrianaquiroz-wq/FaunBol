import { randomUUID } from 'node:crypto';
import type { Ecoregion } from '../../ecoregions/domain/ecoregion.js';
import type {
  LocalizedText,
  OptionalLocalizedText,
} from '../../shared/domain/language.js';
import type {
  AnimalClass,
  ConservationStatus,
  PopulationTrend,
} from './enums.js';

export interface AnimalPhoto {
  publicId: string;
  url: string;
  thumbnailUrl: string;
  /** Author / license of the picture, e.g. "Juan Pérez / iNaturalist, CC BY". */
  credit: string | null;
}

export interface AnimalData {
  commonName: LocalizedText;
  scientificName: string;
  animalClass: AnimalClass;
  description: OptionalLocalizedText;
  iucnStatus: ConservationStatus;
  boliviaRedBookStatus: ConservationStatus | null;
  threats: OptionalLocalizedText;
  populationTrend: PopulationTrend | null;
  estimatedPopulation: number | null;
  habitat: LocalizedText;
  /** General distribution only (departments). Never exact locations. */
  distribution: string;
  sourceReference: string;
  ecoregions: Ecoregion[];
}

export interface AnimalSnapshot {
  id: string;
  data: AnimalData;
  photo: AnimalPhoto | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Animal {
  private constructor(private state: AnimalSnapshot) {}

  static create(data: AnimalData): Animal {
    const now = new Date();
    return new Animal({
      id: randomUUID(),
      data,
      photo: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(snapshot: AnimalSnapshot): Animal {
    return new Animal(snapshot);
  }

  get id() {
    return this.state.id;
  }
  get data(): Readonly<AnimalData> {
    return this.state.data;
  }
  get photo() {
    return this.state.photo;
  }
  get createdAt() {
    return this.state.createdAt;
  }
  get updatedAt() {
    return this.state.updatedAt;
  }

  update(data: AnimalData): void {
    this.state.data = data;
    this.touch();
  }

  /** Sets the photo and returns the previous one so it can be deleted. */
  replacePhoto(photo: AnimalPhoto): AnimalPhoto | null {
    return this.setPhoto(photo);
  }

  removePhoto(): AnimalPhoto | null {
    return this.setPhoto(null);
  }

  private setPhoto(photo: AnimalPhoto | null) {
    const previous = this.state.photo;
    this.state.photo = photo;
    this.touch();
    return previous;
  }

  private touch() {
    this.state.updatedAt = new Date();
  }
}
