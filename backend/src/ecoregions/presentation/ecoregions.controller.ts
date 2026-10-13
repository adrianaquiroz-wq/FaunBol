import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Language } from '../../shared/domain/language.js';
import {
  ApiLanguage,
  RequestLanguage,
} from '../../shared/presentation/request-language.decorator.js';
import { GetEcoregionUseCase } from '../application/get-ecoregion.use-case.js';
import { ListEcoregionsUseCase } from '../application/list-ecoregions.use-case.js';
import { EcoregionResponse } from './ecoregion.response.js';

@ApiTags('Ecoregions')
@ApiLanguage()
@Controller('ecoregions')
export class EcoregionsController {
  constructor(
    private readonly listEcoregions: ListEcoregionsUseCase,
    private readonly getEcoregion: GetEcoregionUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List the 12 ecoregions of Bolivia' })
  @ApiOkResponse({ type: [EcoregionResponse] })
  async findAll(
    @RequestLanguage() lang: Language,
  ): Promise<EcoregionResponse[]> {
    const ecoregions = await this.listEcoregions.execute();
    return ecoregions.map((e) => EcoregionResponse.fromWithCount(e, lang));
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get an ecoregion by its code' })
  @ApiOkResponse({ type: EcoregionResponse })
  @ApiNotFoundResponse({ description: 'Ecoregion not found' })
  async findOne(
    @Param('code') code: string,
    @RequestLanguage() lang: Language,
  ): Promise<EcoregionResponse> {
    return EcoregionResponse.fromWithCount(
      await this.getEcoregion.execute(code),
      lang,
    );
  }
}
