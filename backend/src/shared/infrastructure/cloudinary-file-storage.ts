import cloudinaryPackage, { type UploadApiResponse } from 'cloudinary';
import { UnavailableError } from '../domain/errors.js';
import type {
  FileStorage,
  FileToStore,
  StoredFile,
} from '../domain/file-storage.js';

const { v2: cloudinary } = cloudinaryPackage;

export interface CloudinaryConfig {
  cloudName?: string;
  apiKey?: string;
  apiSecret?: string;
  /** Root folder in the Cloudinary media library. */
  rootFolder: string;
}

/** FileStorage adapter backed by Cloudinary (free plan is enough). */
export class CloudinaryFileStorage implements FileStorage {
  private readonly configured: boolean;

  constructor(private readonly config: CloudinaryConfig) {
    this.configured = Boolean(
      config.cloudName && config.apiKey && config.apiSecret,
    );
    if (this.configured) {
      cloudinary.config({
        cloud_name: config.cloudName,
        api_key: config.apiKey,
        api_secret: config.apiSecret,
        secure: true,
      });
    }
  }

  async save(file: FileToStore): Promise<StoredFile> {
    this.ensureConfigured();
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `${this.config.rootFolder}/${file.folder}`,
          resource_type: 'image',
        },
        (error, response) => {
          if (error || !response) reject(error ?? new Error('Empty response'));
          else resolve(response);
        },
      );
      stream.end(Buffer.from(file.content));
    });

    return {
      publicId: result.public_id,
      url: this.buildUrl(result.public_id, { width: 1600, crop: 'limit' }),
      thumbnailUrl: this.buildUrl(result.public_id, {
        width: 600,
        height: 450,
        crop: 'fill',
        gravity: 'auto',
      }),
    };
  }

  async delete(publicId: string): Promise<void> {
    this.ensureConfigured();
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }

  private buildUrl(publicId: string, transformation: Record<string, unknown>) {
    return cloudinary.url(publicId, {
      secure: true,
      transformation: [
        transformation,
        { fetch_format: 'auto', quality: 'auto' },
      ],
    });
  }

  private ensureConfigured() {
    if (!this.configured) {
      throw new UnavailableError(
        'Photo storage is not configured (set the CLOUDINARY_* variables)',
        'STORAGE_NOT_CONFIGURED',
      );
    }
  }
}
