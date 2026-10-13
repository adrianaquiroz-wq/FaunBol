import type { AnimalInput } from '../../animals/application/manage-animal.use-cases.js';
import {
  AnimalClass,
  ConservationStatus as CS,
  PopulationTrend,
} from '../../animals/domain/enums.js';

/**
 * ⚠️ VERIFY BEFORE PRESENTING: categories and ecoregions were filled in from
 * general knowledge and may be outdated. Check every record against:
 *   - IUCN Red List: https://www.iucnredlist.org
 *   - Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)
 *   - Ecoregiones de Bolivia (Ibisch & Mérida, 2003)
 * `boliviaRedBookStatus` is omitted (null) where it could not be stated with confidence.
 *
 * Distribution is intentionally limited to departments (no exact locations).
 */
const SOURCE =
  'UICN Lista Roja (iucnredlist.org); Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia (MMAyA, 2009)';

export type AnimalSeed = Omit<AnimalInput, 'ecoregionIds'> & {
  ecoregionCodes: string[];
};

export const animalsSeedData: AnimalSeed[] = [
  {
    commonNameEs: 'Jaguar',
    commonNameEn: 'Jaguar',
    scientificName: 'Panthera onca',
    animalClass: AnimalClass.MAMMAL,
    descriptionEs:
      'El felino más grande de América. Depredador tope que regula las poblaciones de sus presas y es indicador de ecosistemas sanos.',
    descriptionEn:
      'The largest cat in the Americas. An apex predator that keeps prey populations in check and signals healthy ecosystems.',
    iucnStatus: CS.NT,
    boliviaRedBookStatus: CS.VU,
    threatsEs:
      'Pérdida y fragmentación de hábitat, conflicto con la ganadería, tráfico ilegal de colmillos y pieles.',
    threatsEn:
      'Habitat loss and fragmentation, conflict with cattle ranching, illegal trade in fangs and skins.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs:
      'Bosques tropicales, sabanas inundables y bosque seco chiquitano',
    habitatEn: 'Tropical forests, flooded savannas and Chiquitano dry forest',
    distribution:
      'Beni, Pando, Santa Cruz, La Paz, Cochabamba, Chuquisaca, Tarija',
    sourceReference: SOURCE,
    ecoregionCodes: [
      'sudoeste-amazonia',
      'sabanas-inundables',
      'bosque-seco-chiquitano',
      'cerrado',
      'gran-chaco',
      'yungas',
    ],
  },
  {
    commonNameEs: 'Oso andino (Jucumari)',
    commonNameEn: 'Andean bear',
    scientificName: 'Tremarctos ornatus',
    animalClass: AnimalClass.MAMMAL,
    descriptionEs:
      'Única especie de oso de Sudamérica. Dispersor de semillas clave para los bosques de montaña.',
    descriptionEn:
      'The only bear species in South America. A key seed disperser for mountain forests.',
    iucnStatus: CS.VU,
    boliviaRedBookStatus: CS.VU,
    threatsEs:
      'Deforestación de bosques nublados, avance de la frontera agrícola, conflicto con comunidades.',
    threatsEn:
      'Cloud forest deforestation, expanding agriculture, conflict with local communities.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Bosques nublados de Yungas y bosques montanos',
    habitatEn: 'Yungas cloud forests and montane forests',
    distribution: 'La Paz, Cochabamba, Santa Cruz, Chuquisaca, Tarija',
    sourceReference: SOURCE,
    ecoregionCodes: ['yungas', 'bosque-tucumano-boliviano'],
  },
  {
    commonNameEs: 'Paraba barba azul',
    commonNameEn: 'Blue-throated macaw',
    scientificName: 'Ara glaucogularis',
    animalClass: AnimalClass.BIRD,
    descriptionEs:
      'Guacamayo endémico de Bolivia, uno de los loros más amenazados del mundo.',
    descriptionEn:
      'A macaw found only in Bolivia, one of the most threatened parrots in the world.',
    iucnStatus: CS.CR,
    boliviaRedBookStatus: CS.CR,
    threatsEs:
      'Captura para el comercio ilegal de mascotas (histórica), pérdida de palmeras para anidar.',
    threatsEn:
      'Capture for the illegal pet trade (historically), loss of nesting palms.',
    populationTrend: PopulationTrend.INCREASING,
    habitatEs: 'Islas de bosque y palmares en sabanas inundables',
    habitatEn: 'Forest islands and palm groves in flooded savannas',
    distribution: 'Beni',
    sourceReference: SOURCE,
    ecoregionCodes: ['sabanas-inundables'],
  },
  {
    commonNameEs: 'Rana gigante del Titicaca',
    commonNameEn: 'Titicaca water frog',
    scientificName: 'Telmatobius culeus',
    animalClass: AnimalClass.AMPHIBIAN,
    descriptionEs:
      'Rana totalmente acuática que respira principalmente por su piel muy plegada. Endémica del lago Titicaca.',
    descriptionEn:
      'A fully aquatic frog that breathes mainly through its heavily folded skin. Found only in Lake Titicaca.',
    iucnStatus: CS.EN,
    threatsEs:
      'Contaminación del lago, sobreexplotación para consumo, especies introducidas.',
    threatsEn:
      'Lake pollution, overharvesting for consumption, introduced species.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Aguas del lago Titicaca',
    habitatEn: 'Waters of Lake Titicaca',
    distribution: 'La Paz',
    sourceReference: SOURCE,
    ecoregionCodes: ['puna-nortena'],
  },
  {
    commonNameEs: 'Londra (Nutria gigante)',
    commonNameEn: 'Giant otter',
    scientificName: 'Pteronura brasiliensis',
    animalClass: AnimalClass.MAMMAL,
    descriptionEs:
      'La nutria más grande del mundo. Vive en grupos familiares y es muy sensible a la calidad del agua.',
    descriptionEn:
      'The largest otter in the world. It lives in family groups and is very sensitive to water quality.',
    iucnStatus: CS.EN,
    boliviaRedBookStatus: CS.EN,
    threatsEs:
      'Contaminación por mercurio de la minería aurífera, pérdida de hábitat, caza histórica por su piel.',
    threatsEn:
      'Mercury pollution from gold mining, habitat loss, historical hunting for its pelt.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Ríos, lagunas y arroyos de tierras bajas amazónicas',
    habitatEn: 'Rivers, lakes and streams of the Amazon lowlands',
    distribution: 'Beni, Pando, Santa Cruz, La Paz',
    sourceReference: SOURCE,
    ecoregionCodes: ['sudoeste-amazonia', 'sabanas-inundables', 'cerrado'],
  },
  {
    commonNameEs: 'Bufeo boliviano',
    commonNameEn: 'Bolivian river dolphin',
    scientificName: 'Inia boliviensis',
    animalClass: AnimalClass.MAMMAL,
    descriptionEs:
      'Delfín de río de la cuenca amazónica boliviana. Declarado patrimonio natural de Bolivia.',
    descriptionEn:
      'A river dolphin of the Bolivian Amazon basin, declared a natural heritage of Bolivia.',
    iucnStatus: CS.EN,
    boliviaRedBookStatus: CS.VU,
    threatsEs:
      'Contaminación por mercurio, represas, captura incidental en redes de pesca.',
    threatsEn: 'Mercury pollution, dams, bycatch in fishing nets.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Ríos de la cuenca del Mamoré e Iténez',
    habitatEn: 'Rivers of the Mamoré and Iténez basins',
    distribution: 'Beni, Pando, Santa Cruz, Cochabamba',
    sourceReference: SOURCE,
    ecoregionCodes: ['sudoeste-amazonia', 'sabanas-inundables'],
  },
  {
    commonNameEs: 'Cóndor andino',
    commonNameEn: 'Andean condor',
    scientificName: 'Vultur gryphus',
    animalClass: AnimalClass.BIRD,
    descriptionEs:
      'Una de las aves voladoras más grandes del mundo y símbolo del escudo de Bolivia. Carroñero esencial en los Andes.',
    descriptionEn:
      'One of the largest flying birds in the world and a symbol on the Bolivian coat of arms. An essential scavenger in the Andes.',
    iucnStatus: CS.VU,
    threatsEs:
      'Envenenamiento por cebos, persecución por supuesto ataque al ganado, intoxicación por plomo.',
    threatsEn:
      'Poisoned baits, persecution over alleged attacks on livestock, lead poisoning.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Cordilleras, valles interandinos y altiplano',
    habitatEn: 'Mountain ranges, inter-Andean valleys and the high plateau',
    distribution: 'La Paz, Oruro, Potosí, Cochabamba, Chuquisaca, Tarija',
    sourceReference: SOURCE,
    ecoregionCodes: [
      'puna-nortena',
      'puna-surena',
      'prepuna',
      'bosques-secos-interandinos',
    ],
  },
  {
    commonNameEs: 'Gato andino (Titi)',
    commonNameEn: 'Andean cat',
    scientificName: 'Leopardus jacobita',
    animalClass: AnimalClass.MAMMAL,
    descriptionEs:
      'Felino pequeño y muy raro de la alta montaña andina, considerado sagrado en culturas aymara y quechua.',
    descriptionEn:
      'A small and very rare cat of the high Andes, considered sacred in Aymara and Quechua cultures.',
    iucnStatus: CS.EN,
    threatsEs:
      'Baja densidad poblacional, disminución de sus presas (vizcachas), persecución y uso ritual.',
    threatsEn:
      'Low population density, decline of its prey (viscachas), persecution and ritual use.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Roquedales de alta montaña sobre los 3.500 m',
    habitatEn: 'High-mountain rocky areas above 3,500 m',
    distribution: 'La Paz, Oruro, Potosí',
    sourceReference: SOURCE,
    ecoregionCodes: ['puna-nortena', 'puna-surena'],
  },
  {
    commonNameEs: 'Zambullidor del Titicaca (Keñola)',
    commonNameEn: 'Titicaca grebe',
    scientificName: 'Rollandia microptera',
    animalClass: AnimalClass.BIRD,
    descriptionEs:
      'Ave acuática que no puede volar, endémica de la cuenca del Titicaca.',
    descriptionEn: 'A flightless waterbird found only in the Titicaca basin.',
    iucnStatus: CS.EN,
    threatsEs:
      'Captura incidental en redes de pesca, contaminación y degradación de totorales.',
    threatsEn:
      'Bycatch in fishing nets, pollution and degradation of reed beds.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Lagos y totorales del altiplano',
    habitatEn: 'High plateau lakes and reed beds',
    distribution: 'La Paz',
    sourceReference: SOURCE,
    ecoregionCodes: ['puna-nortena'],
  },
  {
    commonNameEs: 'Ciervo de los pantanos',
    commonNameEn: 'Marsh deer',
    scientificName: 'Blastocerus dichotomus',
    animalClass: AnimalClass.MAMMAL,
    descriptionEs:
      'El ciervo más grande de Sudamérica, adaptado a humedales con pezuñas que pueden separarse para no hundirse.',
    descriptionEn:
      'The largest deer in South America, adapted to wetlands with hooves that spread apart so it does not sink.',
    iucnStatus: CS.VU,
    boliviaRedBookStatus: CS.VU,
    threatsEs:
      'Drenaje de humedales, enfermedades transmitidas por ganado, quemas.',
    threatsEn: 'Wetland drainage, diseases spread by cattle, fires.',
    populationTrend: PopulationTrend.DECREASING,
    habitatEs: 'Pantanos, sabanas inundables y bañados',
    habitatEn: 'Marshes, flooded savannas and swamps',
    distribution: 'Beni, Santa Cruz',
    sourceReference: SOURCE,
    ecoregionCodes: ['sabanas-inundables', 'cerrado'],
  },
];
