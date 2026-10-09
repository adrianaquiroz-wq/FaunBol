import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AnimalsService } from './animals.service.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { PaginatedAnimalsDto } from './dto/paginated-animals.dto.js';
import { QueryAnimalsDto } from './dto/query-animals.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';
import { Animal } from './entities/animal.entity.js';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @ApiOperation({ summary: 'Register an endangered animal' })
  @ApiCreatedResponse({ type: Animal })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiConflictResponse({ description: 'Scientific name already registered' })
  create(@Body() dto: CreateAnimalDto): Promise<Animal> {
    return this.animalsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List animals (paginated, with search and filters)',
  })
  @ApiOkResponse({ type: PaginatedAnimalsDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  findAll(@Query() query: QueryAnimalsDto): Promise<PaginatedAnimalsDto> {
    return this.animalsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an animal by id' })
  @ApiOkResponse({ type: Animal })
  @ApiBadRequestResponse({ description: 'Id is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Animal> {
    return this.animalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update an animal' })
  @ApiOkResponse({ type: Animal })
  @ApiBadRequestResponse({ description: 'Invalid id or data' })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  @ApiConflictResponse({ description: 'Scientific name already registered' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnimalDto,
  ): Promise<Animal> {
    return this.animalsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an animal (soft delete)' })
  @ApiNoContentResponse({ description: 'Animal deleted' })
  @ApiBadRequestResponse({ description: 'Id is not a valid UUID' })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.animalsService.remove(id);
  }
}
