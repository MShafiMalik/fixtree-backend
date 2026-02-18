import { Injectable, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryUploadResultDto } from '../cloudinary/dto/cloudinary-upload-result.dto';
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
  ): Promise<CloudinaryUploadResultDto> {
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
  ): Promise<CloudinaryUploadResultDto[]> {
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

  /**
   * Replace image: Delete old image from Cloudinary and upload new one
   * @param oldImageUrl - Existing image URL (Cloudinary or external)
   * @param newFile - New file to upload
   * @param folder - Cloudinary folder path
   * @returns Upload result with new image URL
   */
  async replaceImage(
    oldImageUrl: string | null | undefined,
    newFile: Express.Multer.File,
    folder: string = 'fixtree',
  ): Promise<CloudinaryUploadResultDto> {
    // Delete old image from Cloudinary if it exists
    if (oldImageUrl && this.isCloudinaryUrl(oldImageUrl)) {
      const oldPublicId = this.extractPublicIdFromUrl(oldImageUrl);
      if (oldPublicId) {
        try {
          await this.deleteImage(oldPublicId);
          this.logger.log(
            `Old image deleted before replacement: ${oldPublicId}`,
            'UploadService',
          );
        } catch (error) {
          // Log error but continue with upload
          this.logger.error(
            `Failed to delete old image before replacement: ${oldPublicId}`,
            error instanceof Error ? error.message : 'Unknown error',
            'UploadService',
          );
        }
      }
    }

    // Upload new image
    return this.uploadImage(newFile, folder);
  }

  /**
   * Check if URL is from Cloudinary
   */
  isCloudinaryUrl(url: string): boolean {
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  }

  /**
   * Extract publicId from Cloudinary URL
   * Format: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}
   */
  extractPublicIdFromUrl(url: string): string | null {
    try {
      if (!this.isCloudinaryUrl(url)) {
        return null;
      }

      // Extract the path after /upload/
      const uploadIndex = url.indexOf('/upload/');
      if (uploadIndex === -1) {
        return null;
      }

      const pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);

      // Remove version if present (v1234567890/)
      const versionMatch = /^v\d+\//.exec(pathAfterUpload);
      const pathWithoutVersion = versionMatch
        ? pathAfterUpload.substring(versionMatch[0].length)
        : pathAfterUpload;

      // Remove file extension
      const publicId = pathWithoutVersion.replace(
        /\.(jpg|jpeg|png|gif|webp|svg)$/i,
        '',
      );

      return publicId || null;
    } catch (error) {
      this.logger.error(
        `Error extracting publicId from URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        undefined,
        'UploadService',
      );
      return null;
    }
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
