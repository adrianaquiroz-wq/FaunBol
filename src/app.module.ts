import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './animals/animals.module.js';
import { dataSourceOptions } from './database/data-source.js';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), AnimalsModule],
})
export class AppModule {}
