import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { LANGUAGES, type Language } from '../../../shared/domain/language.js';
import {
  AnimalClass,
  ConservationStatus,
  PopulationTrend,
} from '../../domain/enums.js';

const SOURCE_EXAMPLE =
  'UICN Lista Roja; Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)';

export class CreateAnimalDto {
  @ApiProperty({ example: 'Jaguar', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  commonNameEs: string;

  @ApiPropertyOptional({ example: 'Jaguar', maxLength: 150, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  commonNameEn?: string | null;

  @ApiProperty({ example: 'Panthera onca', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  scientificName: string;

  @ApiProperty({ enum: AnimalClass, enumName: 'AnimalClass' })
  @IsEnum(AnimalClass)
  animalClass: AnimalClass;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionEs?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  descriptionEn?: string | null;

  @ApiProperty({
    enum: ConservationStatus,
    enumName: 'ConservationStatus',
    description: 'Global status according to the IUCN Red List',
  })
  @IsEnum(ConservationStatus)
  iucnStatus: ConservationStatus;

  @ApiPropertyOptional({
    enum: ConservationStatus,
    enumName: 'ConservationStatus',
    nullable: true,
    description: 'National status according to the Bolivian Red Book (MMAyA)',
  })
  @IsOptional()
  @IsEnum(ConservationStatus)
  boliviaRedBookStatus?: ConservationStatus | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  threatsEs?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  threatsEn?: string | null;

  @ApiPropertyOptional({
    enum: PopulationTrend,
    enumName: 'PopulationTrend',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(PopulationTrend)
  populationTrend?: PopulationTrend | null;

  @ApiPropertyOptional({ example: 5000, minimum: 0, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedPopulation?: number | null;

  @ApiProperty({ example: 'Bosques tropicales y sabanas', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  habitatEs: string;

  @ApiPropertyOptional({
    example: 'Tropical forests and savannas',
    maxLength: 255,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  habitatEn?: string | null;

  @ApiProperty({
    example: 'Beni, Pando, Santa Cruz',
    maxLength: 255,
    description:
      'General distribution only (departments). Never exact locations or coordinates.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  distribution: string;

  @ApiProperty({ example: SOURCE_EXAMPLE, maxLength: 500 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  sourceReference: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Ids of the ecoregions where the species lives',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('all', { each: true })
  ecoregionIds?: string[];
}

/** Every field optional. `null` clears an optional field. */
export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {}

export class QueryAnimalsDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 12, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 12;

  @ApiPropertyOptional({
    description: 'Common name (ES/EN) or scientific name, case-insensitive',
    example: 'jag',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;

  @ApiPropertyOptional({
    enum: ConservationStatus,
    enumName: 'ConservationStatus',
  })
  @IsOptional()
  @IsEnum(ConservationStatus)
  iucnStatus?: ConservationStatus;

  @ApiPropertyOptional({ enum: AnimalClass, enumName: 'AnimalClass' })
  @IsOptional()
  @IsEnum(AnimalClass)
  animalClass?: AnimalClass;

  @ApiPropertyOptional({
    description: 'Ecoregion code',
    example: 'puna-nortena',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  ecoregion?: string;

  // Read by @RequestLanguage(); declared so validation accepts it.
  @ApiPropertyOptional({ enum: LANGUAGES })
  @IsOptional()
  @IsIn(LANGUAGES)
  lang?: Language;
}

export class UploadPhotoDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'JPG, PNG or WEBP, up to 5 MB',
  })
  file: unknown;

  @ApiPropertyOptional({
    example: 'Foto: Juan Pérez / iNaturalist, CC BY',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  photoCredit?: string;
}
