import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AnimalClass } from '../enums/animal-class.enum.js';
import { ConservationStatus } from '../enums/conservation-status.enum.js';
import { PopulationTrend } from '../enums/population-trend.enum.js';

@Entity('animals')
@Unique('UQ_animals_scientific_name', ['scientificName'])
export class Animal {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_animals_id' })
  id: string;

  @ApiProperty({ example: 'Jaguar' })
  @Column({ name: 'common_name', length: 150 })
  commonName: string;

  @ApiProperty({ example: 'Panthera onca' })
  @Column({ name: 'scientific_name', length: 150 })
  scientificName: string;

  @ApiProperty({ enum: AnimalClass, enumName: 'AnimalClass' })
  @Column({
    name: 'animal_class',
    type: 'enum',
    enum: AnimalClass,
    enumName: 'animal_class_enum',
  })
  animalClass: AnimalClass;

  @ApiProperty({ nullable: true, type: String })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({
    enum: ConservationStatus,
    enumName: 'ConservationStatus',
    description: 'Global status according to the IUCN Red List',
  })
  @Column({
    name: 'iucn_status',
    type: 'enum',
    enum: ConservationStatus,
    enumName: 'conservation_status_enum',
  })
  iucnStatus: ConservationStatus;

  @ApiProperty({
    enum: ConservationStatus,
    enumName: 'ConservationStatus',
    nullable: true,
    description: 'National status according to the Bolivian Red Book (MMAyA)',
  })
  @Column({
    name: 'bolivia_red_book_status',
    type: 'enum',
    enum: ConservationStatus,
    enumName: 'conservation_status_enum',
    nullable: true,
  })
  boliviaRedBookStatus: ConservationStatus | null;

  @ApiProperty({ nullable: true, type: String })
  @Column({ type: 'text', nullable: true })
  threats: string | null;

  @ApiProperty({
    enum: PopulationTrend,
    enumName: 'PopulationTrend',
    nullable: true,
  })
  @Column({
    name: 'population_trend',
    type: 'enum',
    enum: PopulationTrend,
    enumName: 'population_trend_enum',
    nullable: true,
  })
  populationTrend: PopulationTrend | null;

  @ApiProperty({ nullable: true, type: Number })
  @Column({ name: 'estimated_population', type: 'integer', nullable: true })
  estimatedPopulation: number | null;

  @ApiProperty({ example: 'Bosques tropicales y sabanas' })
  @Column({ length: 255 })
  habitat: string;

  @ApiProperty({
    example: 'Beni, Pando, Santa Cruz',
    description: 'General distribution only (country / departments)',
  })
  @Column({ length: 255 })
  distribution: string;

  @ApiProperty({ nullable: true, type: String })
  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    example:
      'UICN Lista Roja; Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)',
  })
  @Column({ name: 'source_reference', length: 500 })
  sourceReference: string;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date | null;
}
