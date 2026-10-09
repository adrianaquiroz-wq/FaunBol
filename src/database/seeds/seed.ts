import dataSource from '../data-source.js';
import { Animal } from '../../animals/entities/animal.entity.js';
import { animalsSeedData } from './animals.seed-data.js';

/**
 * Inserts the seed animals. Idempotent: species whose scientific name is
 * already in the table (even soft-deleted) are skipped, so it is safe to
 * run more than once.
 */
async function seed() {
  await dataSource.initialize();
  const repository = dataSource.getRepository(Animal);

  let inserted = 0;
  for (const data of animalsSeedData) {
    const exists = await repository.exists({
      where: { scientificName: data.scientificName },
      withDeleted: true,
    });
    if (exists) {
      console.log(`- skipped  ${data.scientificName} (already exists)`);
      continue;
    }
    await repository.save(repository.create(data));
    inserted++;
    console.log(`+ inserted ${data.scientificName}`);
  }

  console.log(
    `\nSeed finished: ${inserted} inserted, ${animalsSeedData.length - inserted} skipped.`,
  );
  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
