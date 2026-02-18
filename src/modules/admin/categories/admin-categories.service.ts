import { Injectable, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from '../../categories/categories.repository';
import { CategoriesService } from '../../categories/categories.service';
import { Category } from '../../categories/entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../categories/dto/requests';
import { CategoryResponseDto } from '../../categories/dto/responses';
import { UploadService } from '../../../shared/upload/upload.service';

@Injectable()
export class AdminCategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoriesService: CategoriesService,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    // Prepare category data with icon
    const categoryData: Partial<Category> = {
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      minimumPrice: createCategoryDto.minimumPrice,
      maximumPrice: createCategoryDto.maximumPrice,
      platformCommissionRate: createCategoryDto.platformCommissionRate,
    };

    // Check if category with same name already exists
    const existing = await this.categoriesRepository.findOneByName(
      createCategoryDto.name,
    );

    if (existing) {
      throw new ConflictException(
        `Category with name "${createCategoryDto.name}" already exists`,
      );
    }

    let iconUrl: string | null = null;

    if (file) {
      // Upload icon file
      const result = await this.uploadService.uploadImage(
        file,
        'fixtree/categories',
      );
      iconUrl = result.secureUrl;
    }

    categoryData.icon = iconUrl;

    const category = await this.categoriesRepository.create(categoryData);
    return new CategoryResponseDto(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoriesService.findById(id);

    // Prepare update data - only include fields that are explicitly provided
    const updateData: Partial<Category> = {
      name: updateCategoryDto.name,
      description: updateCategoryDto.description,
      minimumPrice: updateCategoryDto.minimumPrice,
      maximumPrice: updateCategoryDto.maximumPrice,
      platformCommissionRate: updateCategoryDto.platformCommissionRate,
    };

    // Check if name is being updated and if it conflicts with existing category
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existing = await this.categoriesRepository.findOneByName(
        updateCategoryDto.name,
      );
      if (existing) {
        throw new ConflictException(
          `Category with name "${updateCategoryDto.name}" already exists`,
        );
      }
    }

    // Handle icon - only via file upload (not from body)
    if (file) {
      // New file uploaded: replace existing icon
      const uploadResult = await this.uploadService.replaceImage(
        category.icon,
        file,
        'fixtree/categories',
      );
      updateData.icon = uploadResult.secureUrl;
    }

    // Merge updates with existing category and save (single query)
    const updatedCategory = Object.assign(category, updateData);
    const updated = await this.categoriesRepository.save(updatedCategory);
    return new CategoryResponseDto(updated);
  }

  async delete(id: string): Promise<{ message: string }> {
    const category = await this.categoriesService.findById(id);

    // Delete icon from Cloudinary if it exists
    if (category.icon && this.uploadService.isCloudinaryUrl(category.icon)) {
      const publicId = this.uploadService.extractPublicIdFromUrl(category.icon);
      if (publicId) {
        try {
          await this.uploadService.deleteImage(publicId);
        } catch (error) {
          // Log error but don't fail the delete
          console.error(`Failed to delete image: ${publicId}`, error);
        }
      }
    }

    await this.categoriesRepository.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
