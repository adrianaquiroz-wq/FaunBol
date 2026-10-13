import { InvalidInputError } from '../../shared/domain/errors.js';
import type { FileStorage } from '../../shared/domain/file-storage.js';
import type { Animal } from '../domain/animal.js';
import type { AnimalRepository } from '../domain/animal.repository.js';
import { findAnimalOrFail } from './manage-animal.use-cases.js';

export const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export interface PhotoUpload {
  content: Uint8Array;
  mimeType: string;
  size: number;
}

export class UploadAnimalPhotoUseCase {
  constructor(
    private readonly animals: AnimalRepository,
    private readonly storage: FileStorage,
  ) {}

  async execute(
    id: string,
    file: PhotoUpload | undefined,
    credit?: string | null,
  ): Promise<Animal> {
    validatePhoto(file);
    const animal = await findAnimalOrFail(this.animals, id);

    const stored = await this.storage.save({
      content: file.content,
      mimeType: file.mimeType,
      folder: 'animals',
    });
    const previous = animal.replacePhoto({
      ...stored,
      credit: credit?.trim() || null,
    });
    await this.animals.save(animal);

    // The new photo is already saved; failing to clean the old one up must
    // not fail the request.
    if (previous) await this.storage.delete(previous.publicId).catch(() => {});
    return animal;
  }
}

export class RemoveAnimalPhotoUseCase {
  constructor(
    private readonly animals: AnimalRepository,
    private readonly storage: FileStorage,
  ) {}

  async execute(id: string): Promise<Animal> {
    const animal = await findAnimalOrFail(this.animals, id);
    const previous = animal.removePhoto();
    await this.animals.save(animal);
    if (previous) await this.storage.delete(previous.publicId).catch(() => {});
    return animal;
  }
}

function validatePhoto(
  file: PhotoUpload | undefined,
): asserts file is PhotoUpload {
  if (!file) {
    throw new InvalidInputError('A photo file is required', 'PHOTO_REQUIRED');
  }
  if (!ALLOWED_PHOTO_TYPES.includes(file.mimeType)) {
    throw new InvalidInputError(
      'Only JPG, PNG or WEBP images are allowed',
      'PHOTO_INVALID_TYPE',
    );
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new InvalidInputError(
      'The photo must be 5 MB or smaller',
      'PHOTO_TOO_LARGE',
    );
  }
}
