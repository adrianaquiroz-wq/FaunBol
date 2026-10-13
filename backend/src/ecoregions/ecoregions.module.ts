import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { GetEcoregionUseCase } from './application/get-ecoregion.use-case.js';
import { ListEcoregionsUseCase } from './application/list-ecoregions.use-case.js';
import {
  ECOREGION_REPOSITORY,
  type EcoregionRepository,
} from './domain/ecoregion.repository.js';
import { EcoregionOrmEntity } from './infrastructure/ecoregion.orm-entity.js';
import { TypeOrmEcoregionRepository } from './infrastructure/typeorm-ecoregion.repository.js';
import { EcoregionsController } from './presentation/ecoregions.controller.js';

/**
 * Composition root of the module: binds the domain port to its TypeORM
 * adapter and builds the use cases (plain classes, no Nest decorators).
 */
@Module({
  imports: [TypeOrmModule.forFeature([EcoregionOrmEntity])],
  controllers: [EcoregionsController],
  providers: [
    {
      provide: ECOREGION_REPOSITORY,
      useFactory: (repository: Repository<EcoregionOrmEntity>) =>
        new TypeOrmEcoregionRepository(repository),
      inject: [getRepositoryToken(EcoregionOrmEntity)],
    },
    {
      provide: ListEcoregionsUseCase,
      useFactory: (repository: EcoregionRepository) =>
        new ListEcoregionsUseCase(repository),
      inject: [ECOREGION_REPOSITORY],
    },
    {
      provide: GetEcoregionUseCase,
      useFactory: (repository: EcoregionRepository) =>
        new GetEcoregionUseCase(repository),
      inject: [ECOREGION_REPOSITORY],
    },
  ],
  exports: [ECOREGION_REPOSITORY],
})
export class EcoregionsModule {}
