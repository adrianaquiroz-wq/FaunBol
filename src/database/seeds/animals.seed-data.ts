import { CreateAnimalDto } from '../../animals/dto/create-animal.dto.js';
import { AnimalClass } from '../../animals/enums/animal-class.enum.js';
import { ConservationStatus as CS } from '../../animals/enums/conservation-status.enum.js';
import { PopulationTrend } from '../../animals/enums/population-trend.enum.js';

/**
 * ⚠️ VERIFY BEFORE PRESENTING: categories were filled in from general
 * knowledge and may be outdated. Check every record against:
 *   - IUCN Red List: https://www.iucnredlist.org
 *   - Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)
 * `boliviaRedBookStatus` is omitted (null) where it could not be stated with confidence.
 *
 * Distribution is intentionally limited to departments (no exact locations).
 */
const SOURCE =
  'UICN Lista Roja (iucnredlist.org); Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)';

export const animalsSeedData: CreateAnimalDto[] = [
  {
    commonName: 'Jaguar',
    scientificName: 'Panthera onca',
    animalClass: AnimalClass.MAMMAL,
    description:
      'El felino más grande de América. Depredador tope que regula las poblaciones de sus presas y es indicador de ecosistemas sanos.',
    iucnStatus: CS.NT,
    boliviaRedBookStatus: CS.VU,
    threats:
      'Pérdida y fragmentación de hábitat, conflicto con la ganadería, tráfico ilegal de colmillos y pieles.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Bosques tropicales, sabanas inundables y bosque seco chiquitano',
    distribution:
      'Beni, Pando, Santa Cruz, La Paz, Cochabamba, Chuquisaca, Tarija',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Oso andino (Jucumari)',
    scientificName: 'Tremarctos ornatus',
    animalClass: AnimalClass.MAMMAL,
    description:
      'Única especie de oso de Sudamérica. Dispersor de semillas clave para los bosques de montaña.',
    iucnStatus: CS.VU,
    boliviaRedBookStatus: CS.VU,
    threats:
      'Deforestación de bosques nublados, avance de la frontera agrícola, conflicto con comunidades.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Bosques nublados de Yungas y bosques montanos',
    distribution: 'La Paz, Cochabamba, Santa Cruz, Chuquisaca, Tarija',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Paraba barba azul',
    scientificName: 'Ara glaucogularis',
    animalClass: AnimalClass.BIRD,
    description:
      'Guacamayo endémico de Bolivia, uno de los loros más amenazados del mundo.',
    iucnStatus: CS.CR,
    boliviaRedBookStatus: CS.CR,
    threats:
      'Captura para el comercio ilegal de mascotas (histórica), pérdida de palmeras para anidar.',
    populationTrend: PopulationTrend.INCREASING,
    habitat: 'Islas de bosque y palmares en sabanas inundables',
    distribution: 'Beni',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Rana gigante del Titicaca',
    scientificName: 'Telmatobius culeus',
    animalClass: AnimalClass.AMPHIBIAN,
    description:
      'Rana totalmente acuática que respira principalmente por su piel muy plegada. Endémica del lago Titicaca.',
    iucnStatus: CS.EN,
    threats:
      'Contaminación del lago, sobreexplotación para consumo, especies introducidas.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Aguas del lago Titicaca',
    distribution: 'La Paz',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Londra (Nutria gigante)',
    scientificName: 'Pteronura brasiliensis',
    animalClass: AnimalClass.MAMMAL,
    description:
      'La nutria más grande del mundo. Vive en grupos familiares y es muy sensible a la calidad del agua.',
    iucnStatus: CS.EN,
    boliviaRedBookStatus: CS.EN,
    threats:
      'Contaminación por mercurio de la minería aurífera, pérdida de hábitat, caza histórica por su piel.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Ríos, lagunas y arroyos de tierras bajas amazónicas',
    distribution: 'Beni, Pando, Santa Cruz, La Paz',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Bufeo boliviano',
    scientificName: 'Inia boliviensis',
    animalClass: AnimalClass.MAMMAL,
    description:
      'Delfín de río de la cuenca amazónica boliviana. Declarado patrimonio natural de Bolivia.',
    iucnStatus: CS.EN,
    boliviaRedBookStatus: CS.VU,
    threats:
      'Contaminación por mercurio, represas, captura incidental en redes de pesca.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Ríos de la cuenca del Mamoré e Iténez',
    distribution: 'Beni, Pando, Santa Cruz, Cochabamba',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Cóndor andino',
    scientificName: 'Vultur gryphus',
    animalClass: AnimalClass.BIRD,
    description:
      'Una de las aves voladoras más grandes del mundo y símbolo del escudo de Bolivia. Carroñero esencial en los Andes.',
    iucnStatus: CS.VU,
    threats:
      'Envenenamiento por cebos, persecución por supuesto ataque al ganado, intoxicación por plomo.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Cordilleras, valles interandinos y altiplano',
    distribution: 'La Paz, Oruro, Potosí, Cochabamba, Chuquisaca, Tarija',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Gato andino (Titi)',
    scientificName: 'Leopardus jacobita',
    animalClass: AnimalClass.MAMMAL,
    description:
      'Felino pequeño y muy raro de la alta montaña andina, considerado sagrado en culturas aymara y quechua.',
    iucnStatus: CS.EN,
    threats:
      'Baja densidad poblacional, disminución de sus presas (vizcachas), persecución y uso ritual.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Roquedales de alta montaña sobre los 3.500 m',
    distribution: 'La Paz, Oruro, Potosí',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Zambullidor del Titicaca (Keñola)',
    scientificName: 'Rollandia microptera',
    animalClass: AnimalClass.BIRD,
    description:
      'Ave acuática que no puede volar, endémica de la cuenca del Titicaca.',
    iucnStatus: CS.EN,
    threats:
      'Captura incidental en redes de pesca, contaminación y degradación de totorales.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Lagos y totorales del altiplano',
    distribution: 'La Paz',
    sourceReference: SOURCE,
  },
  {
    commonName: 'Ciervo de los pantanos',
    scientificName: 'Blastocerus dichotomus',
    animalClass: AnimalClass.MAMMAL,
    description:
      'El ciervo más grande de Sudamérica, adaptado a humedales con pezuñas que pueden separarse para no hundirse.',
    iucnStatus: CS.VU,
    boliviaRedBookStatus: CS.VU,
    threats:
      'Drenaje de humedales, enfermedades transmitidas por ganado, quemas.',
    populationTrend: PopulationTrend.DECREASING,
    habitat: 'Pantanos, sabanas inundables y bañados',
    distribution: 'Beni, Santa Cruz',
    sourceReference: SOURCE,
  },
];
