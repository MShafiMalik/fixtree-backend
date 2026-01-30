import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const imageUploadConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};

export const multipleImagesUploadConfig = (
  maxCount: number,
): MulterOptions => ({
  ...imageUploadConfig,
  limits: {
    ...imageUploadConfig.limits,
    files: maxCount,
  },
});
