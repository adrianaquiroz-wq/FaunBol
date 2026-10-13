import { randomUUID } from 'node:crypto';
import dataSource from '../data-source.js';
import { AnimalOrmEntity } from '../../animals/infrastructure/animal.orm-entity.js';
import { EcoregionOrmEntity } from '../../ecoregions/infrastructure/ecoregion.orm-entity.js';
import { BcryptPasswordHasher } from '../../users/infrastructure/adapters.js';
import { UserOrmEntity } from '../../users/infrastructure/user.orm-entity.js';
import { User } from '../../users/domain/user.js';
import { animalsSeedData } from './animals.seed-data.js';
import { ecoregionsSeedData } from './ecoregions.seed-data.js';

/**
 * Loads the catalogs and the first admin. Idempotent: safe to run again.
 * - Ecoregions: inserted or updated by code.
 * - Admin: created from ADMIN_* variables if the email does not exist.
 * - Animals: new species are inserted; existing ones only get the fields
 *   that are still empty (English texts, ecoregions), never overwritten.
 */
async function seed() {
  await dataSource.initialize();
  const ecoregions = await seedEcoregions();
  await seedAdmin();
  await seedAnimals(ecoregions);
  await dataSource.destroy();
}

async function seedEcoregions() {
  const repository = dataSource.getRepository(EcoregionOrmEntity);
  for (const [index, data] of ecoregionsSeedData.entries()) {
    const existing = await repository.findOneBy({ code: data.code });
    await repository.save(
      repository.create({ ...existing, ...data, sortOrder: index + 1 }),
    );
  }
  console.log(`✔ ${ecoregionsSeedData.length} ecoregions ready`);
  const all = await repository.find();
  return new Map(all.map((e) => [e.code, e]));
}

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('- admin skipped (set ADMIN_EMAIL and ADMIN_PASSWORD in .env)');
    return;
  }
  const repository = dataSource.getRepository(UserOrmEntity);
  const email = User.normalizeEmail(ADMIN_EMAIL);
  if (await repository.existsBy({ email })) {
    console.log(`- admin ${email} already exists`);
    return;
  }
  const admin = User.createAdmin({
    fullName: ADMIN_NAME || 'Administrador FaunBol',
    email,
    passwordHash: await new BcryptPasswordHasher().hash(ADMIN_PASSWORD),
    institution: 'FaunBol',
  });
  await repository.save(repository.create(admin.toProps()));
  console.log(`✔ admin ${email} created`);
}

async function seedAnimals(ecoregions: Map<string, EcoregionOrmEntity>) {
  const repository = dataSource.getRepository(AnimalOrmEntity);
  let inserted = 0;
  let completed = 0;

  for (const { ecoregionCodes, ...data } of animalsSeedData) {
    const links = ecoregionCodes.map((code) => {
      const ecoregion = ecoregions.get(code);
      if (!ecoregion) throw new Error(`Unknown ecoregion code "${code}"`);
      return ecoregion;
    });
    const existing = await repository.findOne({
      where: { scientificName: data.scientificName },
      relations: { ecoregions: true },
      withDeleted: true,
    });

    if (!existing) {
      await repository.save(
        repository.create({
          id: randomUUID(),
          ...data,
          commonNameEn: data.commonNameEn ?? null,
          ecoregions: links,
        }),
      );
      inserted++;
      continue;
    }

    // Fill only what is still empty, keeping any edits made from the web.
    existing.commonNameEn ??= data.commonNameEn ?? null;
    existing.descriptionEn ??= data.descriptionEn ?? null;
    existing.threatsEn ??= data.threatsEn ?? null;
    existing.habitatEn ??= data.habitatEn ?? null;
    if (existing.ecoregions.length === 0) existing.ecoregions = links;
    await repository.save(existing);
    completed++;
  }

  console.log(
    `✔ animals: ${inserted} inserted, ${completed} existing checked for missing data`,
  );
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  if (dataSource.isInitialized) await dataSource.destroy();
  process.exit(1);
});
