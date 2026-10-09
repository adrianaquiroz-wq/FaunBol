import { ApiProperty } from '@nestjs/swagger';
import { Animal } from '../entities/animal.entity.js';

export class PaginatedAnimalsDto {
  @ApiProperty({ type: [Animal] })
  data: Animal[];

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 5 })
  totalPages: number;
}
