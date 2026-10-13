import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import {
  ECOREGION_REPOSITORY,
  type EcoregionRepository,
} from '../ecoregions/domain/ecoregion.repository.js';
import { EcoregionsModule } from '../ecoregions/ecoregions.module.js';
import {
  FILE_STORAGE,
  type FileStorage,
} from '../shared/domain/file-storage.js';
import { StorageModule } from '../shared/infrastructure/storage.module.js';
import { UsersModule } from '../users/users.module.js';
import {
  RemoveAnimalPhotoUseCase,
  UploadAnimalPhotoUseCase,
} from './application/animal-photo.use-cases.js';
import {
  CreateAnimalUseCase,
  DeleteAnimalUseCase,
  UpdateAnimalUseCase,
} from './application/manage-animal.use-cases.js';
import {
  GetAnimalStatsUseCase,
  GetAnimalUseCase,
  ListAnimalsUseCase,
} from './application/query-animals.use-cases.js';
import {
  ANIMAL_REPOSITORY,
  type AnimalRepository,
} from './domain/animal.repository.js';
import { AnimalOrmEntity } from './infrastructure/animal.orm-entity.js';
import { TypeOrmAnimalRepository } from './infrastructure/typeorm-animal.repository.js';
import { AnimalsController } from './presentation/animals.controller.js';

/** Builds a provider for a use case that only needs the animal repository. */
const withAnimals = <T>(useCase: new (animals: AnimalRepository) => T) => ({
  provide: useCase,
  useFactory: (animals: AnimalRepository) => new useCase(animals),
  inject: [ANIMAL_REPOSITORY],
});

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalOrmEntity]),
    EcoregionsModule,
    StorageModule,
    UsersModule,
  ],
  controllers: [AnimalsController],
  providers: [
    {
      provide: ANIMAL_REPOSITORY,
      useFactory: (repository: Repository<AnimalOrmEntity>) =>
        new TypeOrmAnimalRepository(repository),
      inject: [getRepositoryToken(AnimalOrmEntity)],
    },
    withAnimals(GetAnimalUseCase),
    withAnimals(ListAnimalsUseCase),
    withAnimals(GetAnimalStatsUseCase),
    withAnimals(DeleteAnimalUseCase),
    {
      provide: CreateAnimalUseCase,
      useFactory: (
        animals: AnimalRepository,
        ecoregions: EcoregionRepository,
      ) => new CreateAnimalUseCase(animals, ecoregions),
      inject: [ANIMAL_REPOSITORY, ECOREGION_REPOSITORY],
    },
    {
      provide: UpdateAnimalUseCase,
      useFactory: (
        animals: AnimalRepository,
        ecoregions: EcoregionRepository,
      ) => new UpdateAnimalUseCase(animals, ecoregions),
      inject: [ANIMAL_REPOSITORY, ECOREGION_REPOSITORY],
    },
    {
      provide: UploadAnimalPhotoUseCase,
      useFactory: (animals: AnimalRepository, storage: FileStorage) =>
        new UploadAnimalPhotoUseCase(animals, storage),
      inject: [ANIMAL_REPOSITORY, FILE_STORAGE],
    },
    {
      provide: RemoveAnimalPhotoUseCase,
      useFactory: (animals: AnimalRepository, storage: FileStorage) =>
        new RemoveAnimalPhotoUseCase(animals, storage),
      inject: [ANIMAL_REPOSITORY, FILE_STORAGE],
    },
  ],
})
export class AnimalsModule {}
