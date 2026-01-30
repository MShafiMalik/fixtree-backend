import { Injectable, BadRequestException } from '@nestjs/common';
import {
  CloudinaryService,
  CloudinaryUploadResult,
} from '../cloudinary/cloudinary.service';
import { LoggerService } from '../logger/logger.service';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './upload.config';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly logger: LoggerService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'fixtree',
  ): Promise<CloudinaryUploadResult> {
    this.validateFile(file);

    try {
      const result = await this.cloudinaryService.uploadImage(file, folder);
      this.logger.log(`Image uploaded: ${result.publicId}`, 'UploadService');
      return result;
    } catch (error) {
      this.logger.error(
        `Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'UploadService',
      );
      throw new BadRequestException('Failed to upload image');
    }
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: string = 'fixtree',
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await this.cloudinaryService.deleteImage(publicId);
      if (result) {
        this.logger.log(`Image deleted: ${publicId}`, 'UploadService');
      }
      return result;
    } catch (error) {
      this.logger.error(
        `Image deletion failed for ${publicId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'UploadService',
      );
      throw new BadRequestException('Failed to delete image');
    }
  }

  async deleteMultipleImages(publicIds: string[]): Promise<boolean[]> {
    const deletePromises = publicIds.map((id) => this.deleteImage(id));
    return Promise.all(deletePromises);
  }

  private validateFile(file: Express.Multer.File | undefined): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File too large. Maximum size: ${String(MAX_FILE_SIZE / (1024 * 1024))}MB`,
      );
    }
  }
}
