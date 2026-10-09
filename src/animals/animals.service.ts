import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, QueryFailedError, Repository } from 'typeorm';
import { CreateAnimalDto } from './dto/create-animal.dto.js';
import { PaginatedAnimalsDto } from './dto/paginated-animals.dto.js';
import { QueryAnimalsDto } from './dto/query-animals.dto.js';
import { UpdateAnimalDto } from './dto/update-animal.dto.js';
import { Animal } from './entities/animal.entity.js';

const PG_UNIQUE_VIOLATION = '23505';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animal)
    private readonly animalsRepository: Repository<Animal>,
  ) {}

  async create(dto: CreateAnimalDto): Promise<Animal> {
    await this.ensureScientificNameIsAvailable(dto.scientificName);
    const animal = this.animalsRepository.create(dto);
    return this.save(animal);
  }

  async findAll(query: QueryAnimalsDto): Promise<PaginatedAnimalsDto> {
    const { page, limit, search, iucnStatus, animalClass } = query;

    const filters: FindOptionsWhere<Animal> = {};
    if (iucnStatus) filters.iucnStatus = iucnStatus;
    if (animalClass) filters.animalClass = animalClass;

    // An array in `where` means OR: match either name, keeping the filters.
    let where: FindOptionsWhere<Animal> | FindOptionsWhere<Animal>[] = filters;
    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      where = [
        { ...filters, commonName: ILike(pattern) },
        { ...filters, scientificName: ILike(pattern) },
      ];
    }

    const [data, total] = await this.animalsRepository.findAndCount({
      where,
      order: { commonName: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Animal> {
    const animal = await this.animalsRepository.findOneBy({ id });
    if (!animal) {
      throw new NotFoundException(`Animal with id "${id}" not found`);
    }
    return animal;
  }

  async update(id: string, dto: UpdateAnimalDto): Promise<Animal> {
    const animal = await this.findOne(id);
    if (
      dto.scientificName &&
      dto.scientificName.toLowerCase() !== animal.scientificName.toLowerCase()
    ) {
      await this.ensureScientificNameIsAvailable(dto.scientificName);
    }
    this.animalsRepository.merge(animal, dto);
    return this.save(animal);
  }

  async remove(id: string): Promise<void> {
    const animal = await this.findOne(id);
    await this.animalsRepository.softRemove(animal);
  }

  private async ensureScientificNameIsAvailable(scientificName: string) {
    // withDeleted: soft-deleted rows still hold the unique constraint.
    const existing = await this.animalsRepository.findOne({
      where: { scientificName: ILike(escapeLike(scientificName)) },
      withDeleted: true,
    });
    if (!existing) return;

    throw new ConflictException(
      existing.deletedAt
        ? `An animal with scientific name "${scientificName}" already exists but was deleted`
        : `An animal with scientific name "${scientificName}" already exists`,
    );
  }

  private async save(animal: Animal): Promise<Animal> {
    try {
      return await this.animalsRepository.save(animal);
    } catch (error) {
      // Covers the race where two requests insert the same name at once.
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          `An animal with scientific name "${animal.scientificName}" already exists`,
        );
      }
      throw error;
    }
  }
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, '\\$&');
}
