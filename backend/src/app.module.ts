import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './animals/animals.module.js';
import { dataSourceOptions } from './database/data-source.js';
import { EcoregionsModule } from './ecoregions/ecoregions.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AnimalsModule,
    EcoregionsModule,
    UsersModule,
  ],
})
export class AppModule {}
