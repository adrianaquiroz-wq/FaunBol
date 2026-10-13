import { Brackets, ILike, Repository } from 'typeorm';
import { toEcoregion } from '../../ecoregions/infrastructure/typeorm-ecoregion.repository.js';
import type { Page } from '../../shared/domain/pagination.js';
import { Animal } from '../domain/animal.js';
import type {
  AnimalFilters,
  AnimalRepository,
  ScientificNameOwner,
} from '../domain/animal.repository.js';
import type { ConservationStatus } from '../domain/enums.js';
import { AnimalOrmEntity } from './animal.orm-entity.js';

export class TypeOrmAnimalRepository implements AnimalRepository {
  constructor(private readonly repository: Repository<AnimalOrmEntity>) {}

  async findById(id: string): Promise<Animal | null> {
    const row = await this.repository.findOne({
      where: { id },
      relations: { ecoregions: true },
    });
    return row && toDomain(row);
  }

  async findPage(filters: AnimalFilters): Promise<Page<Animal>> {
    const query = this.repository
      .createQueryBuilder('animal')
      .leftJoinAndSelect('animal.ecoregions', 'ecoregion');

    if (filters.ecoregionCode) {
      // A separate join so the filter does not hide the animal's other ecoregions.
      query.innerJoin('animal.ecoregions', 'filter', 'filter.code = :code', {
        code: filters.ecoregionCode,
      });
    }
    if (filters.iucnStatus) {
      query.andWhere('animal.iucnStatus = :iucnStatus', {
        iucnStatus: filters.iucnStatus,
      });
    }
    if (filters.animalClass) {
      query.andWhere('animal.animalClass = :animalClass', {
        animalClass: filters.animalClass,
      });
    }
    if (filters.search) {
      const pattern = `%${escapeLike(filters.search)}%`;
      query.andWhere(
        new Brackets((where) =>
          where
            .where('animal.commonNameEs ILIKE :pattern')
            .orWhere('animal.commonNameEn ILIKE :pattern')
            .orWhere('animal.scientificName ILIKE :pattern'),
        ),
        { pattern },
      );
    }

    const [rows, total] = await query
      .orderBy('animal.commonNameEs', 'ASC')
      .addOrderBy('ecoregion.sortOrder', 'ASC')
      .skip((filters.page - 1) * filters.limit)
      .take(filters.limit)
      .getManyAndCount();

    return { items: rows.map(toDomain), total };
  }

  async findScientificNameOwner(
    name: string,
  ): Promise<ScientificNameOwner | null> {
    const row = await this.repository.findOne({
      where: { scientificName: ILike(escapeLike(name)) },
      withDeleted: true,
    });
    return row && { id: row.id, deleted: row.deletedAt !== null };
  }

  async countByIucnStatus(): Promise<
    Partial<Record<ConservationStatus, number>>
  > {
    const rows = await this.repository
      .createQueryBuilder('animal')
      .select('animal.iucnStatus', 'status')
      .addSelect('COUNT(*)::int', 'count')
      .groupBy('animal.iucnStatus')
      .getRawMany<{ status: ConservationStatus; count: number }>();
    return Object.fromEntries(rows.map((r) => [r.status, r.count]));
  }

  async save(animal: Animal): Promise<void> {
    await this.repository.save(toPersistence(animal));
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}

function toDomain(row: AnimalOrmEntity): Animal {
  return Animal.restore({
    id: row.id,
    data: {
      commonName: { es: row.commonNameEs, en: row.commonNameEn },
      scientificName: row.scientificName,
      animalClass: row.animalClass,
      description: { es: row.descriptionEs, en: row.descriptionEn },
      iucnStatus: row.iucnStatus,
      boliviaRedBookStatus: row.boliviaRedBookStatus,
      threats: { es: row.threatsEs, en: row.threatsEn },
      populationTrend: row.populationTrend,
      estimatedPopulation: row.estimatedPopulation,
      habitat: { es: row.habitatEs, en: row.habitatEn },
      distribution: row.distribution,
      sourceReference: row.sourceReference,
      ecoregions: (row.ecoregions ?? []).map(toEcoregion),
    },
    photo:
      row.photoPublicId && row.photoUrl
        ? {
            publicId: row.photoPublicId,
            url: row.photoUrl,
            thumbnailUrl: row.photoThumbnailUrl ?? row.photoUrl,
            credit: row.photoCredit,
          }
        : null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toPersistence(animal: Animal): AnimalOrmEntity {
  const { data, photo } = animal;
  const row = new AnimalOrmEntity();
  Object.assign(row, {
    id: animal.id,
    commonNameEs: data.commonName.es,
    commonNameEn: data.commonName.en,
    scientificName: data.scientificName,
    animalClass: data.animalClass,
    descriptionEs: data.description.es,
    descriptionEn: data.description.en,
    iucnStatus: data.iucnStatus,
    boliviaRedBookStatus: data.boliviaRedBookStatus,
    threatsEs: data.threats.es,
    threatsEn: data.threats.en,
    populationTrend: data.populationTrend,
    estimatedPopulation: data.estimatedPopulation,
    habitatEs: data.habitat.es,
    habitatEn: data.habitat.en,
    distribution: data.distribution,
    sourceReference: data.sourceReference,
    photoUrl: photo?.url ?? null,
    photoThumbnailUrl: photo?.thumbnailUrl ?? null,
    photoPublicId: photo?.publicId ?? null,
    photoCredit: photo?.credit ?? null,
    ecoregions: data.ecoregions.map((e) => ({ id: e.id })),
    createdAt: animal.createdAt,
  });
  return row;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}
