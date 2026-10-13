import { Module } from '@nestjs/common';
import { FILE_STORAGE } from '../domain/file-storage.js';
import { CloudinaryFileStorage } from './cloudinary-file-storage.js';

/**
 * Binds the FileStorage port to its adapter. Switching provider means
 * changing this factory only.
 */
@Module({
  providers: [
    {
      provide: FILE_STORAGE,
      useFactory: () =>
        new CloudinaryFileStorage({
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
          apiSecret: process.env.CLOUDINARY_API_SECRET,
          rootFolder: process.env.CLOUDINARY_FOLDER ?? 'faunbol',
        }),
    },
  ],
  exports: [FILE_STORAGE],
})
export class StorageModule {}
