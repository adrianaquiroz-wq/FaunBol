import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { AnimalClass } from '../enums/animal-class.enum.js';
import { ConservationStatus } from '../enums/conservation-status.enum.js';

export class QueryAnimalsDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Search by common or scientific name (case-insensitive)',
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
}
