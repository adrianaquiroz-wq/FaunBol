/**
 * Conservation categories defined by the IUCN (International Union for
 * Conservation of Nature / UICN in Spanish). The Bolivian Red Book
 * (Libro Rojo de la Fauna Silvestre de Vertebrados de Bolivia, MMAyA)
 * applies the same categories at national level.
 */
export enum ConservationStatus {
  LC = 'LC', // Least Concern
  NT = 'NT', // Near Threatened
  VU = 'VU', // Vulnerable
  EN = 'EN', // Endangered
  CR = 'CR', // Critically Endangered
  EW = 'EW', // Extinct in the Wild
  EX = 'EX', // Extinct
  DD = 'DD', // Data Deficient
}
