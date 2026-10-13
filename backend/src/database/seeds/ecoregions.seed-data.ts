/**
 * The 12 ecoregions of Bolivia (Ibisch, P. L. & Mérida, G., 2003), the
 * regional frame used by the Bolivian Red Book.
 * ⚠️ Descriptions are short summaries: verify wording before presenting.
 */
export interface EcoregionSeed {
  code: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
}

export const ecoregionsSeedData: EcoregionSeed[] = [
  {
    code: 'sudoeste-amazonia',
    nameEs: 'Sudoeste de la Amazonía',
    nameEn: 'Southwest Amazon',
    descriptionEs:
      'Bosques húmedos de tierras bajas del norte de Bolivia, con ríos caudalosos y la mayor diversidad de especies del país.',
    descriptionEn:
      'Lowland rainforests of northern Bolivia, crossed by large rivers and home to the highest species diversity in the country.',
  },
  {
    code: 'cerrado',
    nameEs: 'Cerrado',
    nameEn: 'Cerrado',
    descriptionEs:
      'Sabanas arboladas y bosques ralos del noreste de Santa Cruz, sobre suelos antiguos del escudo precámbrico.',
    descriptionEn:
      'Wooded savannas and open forests of northeastern Santa Cruz, on ancient soils of the Precambrian shield.',
  },
  {
    code: 'sabanas-inundables',
    nameEs: 'Sabanas inundables',
    nameEn: 'Flooded savannas',
    descriptionEs:
      'Llanuras que se inundan cada año, como los Llanos de Moxos y el Pantanal; refugio de aves acuáticas, ciervos y caimanes.',
    descriptionEn:
      'Plains that flood every year, such as the Llanos de Moxos and the Pantanal; a refuge for waterbirds, deer and caimans.',
  },
  {
    code: 'bosque-seco-chiquitano',
    nameEs: 'Bosque seco chiquitano',
    nameEn: 'Chiquitano dry forest',
    descriptionEs:
      'Uno de los bosques secos tropicales mejor conservados del mundo, con una marcada estación seca en el oriente de Santa Cruz.',
    descriptionEn:
      'One of the best-preserved tropical dry forests in the world, with a marked dry season in eastern Santa Cruz.',
  },
  {
    code: 'gran-chaco',
    nameEs: 'Gran Chaco',
    nameEn: 'Gran Chaco',
    descriptionEs:
      'Llanuras cálidas y secas del sureste con bosques espinosos, compartidas con Paraguay y Argentina.',
    descriptionEn:
      'Hot, dry southeastern plains covered by thorn forests, shared with Paraguay and Argentina.',
  },
  {
    code: 'chaco-serrano',
    nameEs: 'Chaco serrano',
    nameEn: 'Mountain Chaco',
    descriptionEs:
      'Serranías bajas entre el Chaco y los Andes, con bosques secos de transición.',
    descriptionEn:
      'Low mountain ranges between the Chaco and the Andes, covered by transitional dry forests.',
  },
  {
    code: 'bosque-tucumano-boliviano',
    nameEs: 'Bosque tucumano-boliviano',
    nameEn: 'Tucuman-Bolivian forest',
    descriptionEs:
      'Bosques montanos húmedos del sur, con nogales y pinos de monte, en las laderas orientales de Chuquisaca y Tarija.',
    descriptionEn:
      'Humid montane forests of the south, with walnut and podocarp trees, on the eastern slopes of Chuquisaca and Tarija.',
  },
  {
    code: 'yungas',
    nameEs: 'Yungas',
    nameEn: 'Yungas',
    descriptionEs:
      'Bosques nublados en las laderas orientales de los Andes, muy húmedos y con muchas especies endémicas.',
    descriptionEn:
      'Cloud forests on the eastern slopes of the Andes, very humid and rich in endemic species.',
  },
  {
    code: 'bosques-secos-interandinos',
    nameEs: 'Bosques secos interandinos',
    nameEn: 'Inter-Andean dry forests',
    descriptionEs:
      'Valles secos entre cordilleras, con cactus y arbustos, en Cochabamba, Chuquisaca y Potosí.',
    descriptionEn:
      'Dry valleys between mountain ranges, with cacti and shrubs, in Cochabamba, Chuquisaca and Potosí.',
  },
  {
    code: 'prepuna',
    nameEs: 'Prepuna',
    nameEn: 'Prepuna',
    descriptionEs:
      'Valles y laderas áridas del sur andino, por debajo de la puna, con matorrales y cactus columnares.',
    descriptionEn:
      'Arid valleys and slopes of the southern Andes, below the puna, with scrub and columnar cacti.',
  },
  {
    code: 'puna-nortena',
    nameEs: 'Puna norteña',
    nameEn: 'Northern Puna',
    descriptionEs:
      'Altiplano y cordilleras del norte, más húmedos, incluido el lago Titicaca; pastizales, bofedales y lagos de altura.',
    descriptionEn:
      'Northern high plateau and ranges, more humid, including Lake Titicaca; grasslands, high-altitude wetlands and lakes.',
  },
  {
    code: 'puna-surena',
    nameEs: 'Puna sureña',
    nameEn: 'Southern Puna',
    descriptionEs:
      'Altiplano seco del suroeste, con salares y lagunas de altura como las de la Reserva Eduardo Avaroa.',
    descriptionEn:
      'Dry southwestern high plateau, with salt flats and high-altitude lagoons such as those of the Eduardo Avaroa Reserve.',
  },
];
