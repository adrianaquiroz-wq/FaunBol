/**
 * Port for storing binary files (photos). The domain and use cases only know
 * this interface; the concrete provider (Cloudinary today) lives in
 * infrastructure and can be swapped without touching business logic.
 */
export interface FileToStore {
  content: Uint8Array;
  mimeType: string;
  /** Logical folder, e.g. "animals". */
  folder: string;
}

export interface StoredFile {
  /** Provider id used later to delete or replace the file. */
  publicId: string;
  url: string;
  thumbnailUrl: string;
}

export interface FileStorage {
  save(file: FileToStore): Promise<StoredFile>;
  delete(publicId: string): Promise<void>;
}

export const FILE_STORAGE = Symbol('FILE_STORAGE');
