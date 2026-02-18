import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { CloudinaryUploadResultDto } from './dto/cloudinary-upload-result.dto';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('cloudinary.cloudName'),
      api_key: this.configService.get<string>('cloudinary.apiKey'),
      api_secret: this.configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'fixtree',
  ): Promise<CloudinaryUploadResultDto> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error || !result) {
              reject(new Error(error?.message ?? 'Upload failed'));
              return;
            }
            const uploadResult: CloudinaryUploadResultDto = {
              publicId: result.public_id,
              url: result.url,
              secureUrl: result.secure_url,
              format: result.format,
              width: result.width,
              height: result.height,
            };
            resolve(uploadResult);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadImageFromUrl(
    url: string,
    folder: string = 'fixtree',
  ): Promise<CloudinaryUploadResultDto> {
    const result = await cloudinary.uploader.upload(url, {
      folder,
      resource_type: 'image',
    });

    const uploadResult: CloudinaryUploadResultDto = {
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
    };
    return uploadResult;
  }

  async deleteImage(publicId: string): Promise<boolean> {
    const result = (await cloudinary.uploader.destroy(publicId)) as {
      result: string;
    };
    return result.result === 'ok';
  }

  getOptimizedUrl(
    publicId: string,
    options?: { width?: number; height?: number },
  ): string {
    return cloudinary.url(publicId, {
      transformation: [
        {
          width: options?.width,
          height: options?.height,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto',
        },
      ],
    });
  }
}
