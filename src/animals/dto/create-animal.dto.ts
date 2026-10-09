import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';
import { AnimalClass } from '../enums/animal-class.enum.js';
import { ConservationStatus } from '../enums/conservation-status.enum.js';
import { PopulationTrend } from '../enums/population-trend.enum.js';

export class CreateAnimalDto {
  @ApiProperty({ example: 'Jaguar', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  commonName: string;

  @ApiProperty({ example: 'Panthera onca', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  scientificName: string;

  @ApiProperty({ enum: AnimalClass, enumName: 'AnimalClass' })
  @IsEnum(AnimalClass)
  animalClass: AnimalClass;

  @ApiPropertyOptional({
    example:
      'El felino más grande de América. Cumple un rol clave como depredador tope.',
  })
  @IsOptional()
  @IsString()
  description?: string;

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
    description: 'National status according to the Bolivian Red Book (MMAyA)',
  })
  @IsOptional()
  @IsEnum(ConservationStatus)
  boliviaRedBookStatus?: ConservationStatus;

  @ApiPropertyOptional({
    example: 'Pérdida de hábitat, conflicto con ganadería, tráfico ilegal',
  })
  @IsOptional()
  @IsString()
  threats?: string;

  @ApiPropertyOptional({ enum: PopulationTrend, enumName: 'PopulationTrend' })
  @IsOptional()
  @IsEnum(PopulationTrend)
  populationTrend?: PopulationTrend;

  @ApiPropertyOptional({ example: 5000, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedPopulation?: number;

  @ApiProperty({ example: 'Bosques tropicales y sabanas', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  habitat: string;

  @ApiProperty({
    example: 'Beni, Pando, Santa Cruz',
    maxLength: 255,
    description:
      'General distribution only (country / departments). Never exact locations or coordinates.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  distribution: string;

  @ApiPropertyOptional({ example: 'https://example.org/jaguar.jpg' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({
    example:
      'UICN Lista Roja; Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)',
    maxLength: 500,
    description:
      'Official source backing this record (IUCN, Bolivian Red Book…)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  sourceReference: string;
}
