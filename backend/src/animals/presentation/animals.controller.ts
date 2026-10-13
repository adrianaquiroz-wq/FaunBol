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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Language } from '../../shared/domain/language.js';
import {
  ApiLanguage,
  RequestLanguage,
} from '../../shared/presentation/request-language.decorator.js';
import { UserRole } from '../../users/domain/user.js';
import { Auth } from '../../users/presentation/auth.guard.js';
import {
  MAX_PHOTO_BYTES,
  RemoveAnimalPhotoUseCase,
  UploadAnimalPhotoUseCase,
} from '../application/animal-photo.use-cases.js';
import {
  CreateAnimalUseCase,
  DeleteAnimalUseCase,
  UpdateAnimalUseCase,
} from '../application/manage-animal.use-cases.js';
import {
  GetAnimalStatsUseCase,
  GetAnimalUseCase,
  ListAnimalsUseCase,
} from '../application/query-animals.use-cases.js';
import {
  AnimalFullResponse,
  AnimalResponse,
  AnimalStatsResponse,
  PaginatedAnimalsResponse,
} from './animal.response.js';
import {
  CreateAnimalDto,
  QueryAnimalsDto,
  UpdateAnimalDto,
  UploadPhotoDto,
} from './dto/animal.dto.js';

const EDITORS = [UserRole.RESEARCHER, UserRole.ADMIN];

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
  constructor(
    private readonly listAnimals: ListAnimalsUseCase,
    private readonly getAnimal: GetAnimalUseCase,
    private readonly getStats: GetAnimalStatsUseCase,
    private readonly createAnimal: CreateAnimalUseCase,
    private readonly updateAnimal: UpdateAnimalUseCase,
    private readonly deleteAnimal: DeleteAnimalUseCase,
    private readonly uploadPhoto: UploadAnimalPhotoUseCase,
    private readonly removePhoto: RemoveAnimalPhotoUseCase,
  ) {}

  // ---------- Public ----------

  @Get()
  @ApiLanguage()
  @ApiOperation({
    summary: 'List animals (paginated, with search and filters)',
  })
  @ApiOkResponse({ type: PaginatedAnimalsResponse })
  async findAll(
    @Query() query: QueryAnimalsDto,
    @RequestLanguage() lang: Language,
  ): Promise<PaginatedAnimalsResponse> {
    const { page, limit } = query;
    const { items, total } = await this.listAnimals.execute({
      page,
      limit,
      search: query.search,
      iucnStatus: query.iucnStatus,
      animalClass: query.animalClass,
      ecoregionCode: query.ecoregion,
    });
    return {
      data: items.map((animal) => AnimalResponse.from(animal, lang)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Number of animals per IUCN category' })
  @ApiOkResponse({ type: AnimalStatsResponse })
  stats(): Promise<AnimalStatsResponse> {
    return this.getStats.execute();
  }

  @Get(':id')
  @ApiLanguage()
  @ApiOperation({ summary: 'Get an animal by id' })
  @ApiOkResponse({ type: AnimalResponse })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestLanguage() lang: Language,
  ): Promise<AnimalResponse> {
    return AnimalResponse.from(await this.getAnimal.execute(id), lang);
  }

  // ---------- Researchers and admins ----------

  @Get(':id/full')
  @Auth(...EDITORS)
  @ApiOperation({ summary: 'Get an animal with both languages (for editing)' })
  @ApiOkResponse({ type: AnimalFullResponse })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  async findOneFull(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnimalFullResponse> {
    return AnimalFullResponse.from(await this.getAnimal.execute(id));
  }

  @Post()
  @Auth(...EDITORS)
  @ApiOperation({ summary: 'Register an endangered animal' })
  @ApiCreatedResponse({ type: AnimalFullResponse })
  @ApiBadRequestResponse({ description: 'Invalid data or unknown ecoregion' })
  @ApiConflictResponse({ description: 'Scientific name already registered' })
  async create(@Body() dto: CreateAnimalDto): Promise<AnimalFullResponse> {
    return AnimalFullResponse.from(await this.createAnimal.execute(dto));
  }

  @Patch(':id')
  @Auth(...EDITORS)
  @ApiOperation({ summary: 'Partially update an animal' })
  @ApiOkResponse({ type: AnimalFullResponse })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  @ApiConflictResponse({ description: 'Scientific name already registered' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnimalDto,
  ): Promise<AnimalFullResponse> {
    return AnimalFullResponse.from(await this.updateAnimal.execute(id, dto));
  }

  @Post(':id/photo')
  @Auth(...EDITORS)
  @UseInterceptors(
    // Hard cap a bit above the business limit; the use case gives the
    // friendly 400 for files between 5 and 6 MB.
    FileInterceptor('file', {
      limits: { fileSize: MAX_PHOTO_BYTES + 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadPhotoDto })
  @ApiOperation({
    summary: 'Upload or replace the photo (stored in Cloudinary)',
  })
  @ApiCreatedResponse({ type: AnimalFullResponse })
  @ApiBadRequestResponse({ description: 'Missing file, wrong type or > 5 MB' })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  @ApiServiceUnavailableResponse({ description: 'Cloudinary not configured' })
  async upload(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UploadPhotoDto,
  ): Promise<AnimalFullResponse> {
    const animal = await this.uploadPhoto.execute(
      id,
      file && {
        content: file.buffer,
        mimeType: file.mimetype,
        size: file.size,
      },
      dto.photoCredit,
    );
    return AnimalFullResponse.from(animal);
  }

  @Delete(':id/photo')
  @Auth(...EDITORS)
  @ApiOperation({ summary: 'Remove the photo' })
  @ApiOkResponse({ type: AnimalFullResponse })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  async deletePhoto(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AnimalFullResponse> {
    return AnimalFullResponse.from(await this.removePhoto.execute(id));
  }

  // ---------- Admins only ----------

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an animal (soft delete, admin only)' })
  @ApiNoContentResponse({ description: 'Animal deleted' })
  @ApiNotFoundResponse({ description: 'Animal not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteAnimal.execute(id);
  }
}
