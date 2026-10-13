import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('ecoregions')
@Unique('UQ_ecoregions_code', ['code'])
export class EcoregionOrmEntity {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_ecoregions_id',
  })
  id: string;

  @Column({ length: 60 })
  code: string;

  @Column({ name: 'name_es', length: 120 })
  nameEs: string;

  @Column({ name: 'name_en', type: 'varchar', length: 120, nullable: true })
  nameEn: string | null;

  @Column({ name: 'description_es', type: 'text' })
  descriptionEs: string;

  @Column({ name: 'description_en', type: 'text', nullable: true })
  descriptionEn: string | null;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;
}
