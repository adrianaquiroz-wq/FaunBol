import { In, Repository } from 'typeorm';
import type {
  Ecoregion,
  EcoregionWithAnimalCount,
} from '../domain/ecoregion.js';
import type { EcoregionRepository } from '../domain/ecoregion.repository.js';
import { EcoregionOrmEntity } from './ecoregion.orm-entity.js';

export function toEcoregion(row: EcoregionOrmEntity): Ecoregion {
  return {
    id: row.id,
    code: row.code,
    name: { es: row.nameEs, en: row.nameEn },
    description: { es: row.descriptionEs, en: row.descriptionEn },
    sortOrder: row.sortOrder,
  };
}

export class TypeOrmEcoregionRepository implements EcoregionRepository {
  constructor(private readonly repository: Repository<EcoregionOrmEntity>) {}

  async findAllWithAnimalCount(): Promise<EcoregionWithAnimalCount[]> {
    const [rows, counts] = await Promise.all([
      this.repository.find({ order: { sortOrder: 'ASC' } }),
      this.countAnimals(),
    ]);
    return rows.map((row) => ({
      ...toEcoregion(row),
      animalCount: counts.get(row.id) ?? 0,
    }));
  }

  async findByCode(code: string): Promise<EcoregionWithAnimalCount | null> {
    const row = await this.repository.findOneBy({ code });
    if (!row) return null;
    const counts = await this.countAnimals(row.id);
    return { ...toEcoregion(row), animalCount: counts.get(row.id) ?? 0 };
  }

  async findByIds(ids: string[]): Promise<Ecoregion[]> {
    if (ids.length === 0) return [];
    const rows = await this.repository.find({
      where: { id: In(ids) },
      order: { sortOrder: 'ASC' },
    });
    return rows.map(toEcoregion);
  }

  /** Animals per ecoregion, ignoring soft-deleted animals. */
  private async countAnimals(ecoregionId?: string) {
    const query = this.repository.manager
      .createQueryBuilder()
      .select('ae.ecoregion_id', 'ecoregionId')
      .addSelect('COUNT(a.id)::int', 'count')
      .from('animal_ecoregions', 'ae')
      .innerJoin('animals', 'a', 'a.id = ae.animal_id AND a.deleted_at IS NULL')
      .groupBy('ae.ecoregion_id');
    if (ecoregionId)
      query.where('ae.ecoregion_id = :ecoregionId', { ecoregionId });

    const rows = await query.getRawMany<{
      ecoregionId: string;
      count: number;
    }>();
    return new Map(rows.map((r) => [r.ecoregionId, r.count]));
  }
}
