import {
  Controller,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminCategoriesService } from './admin-categories.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/role.enum';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../../categories/dto/requests';
import { CategoryResponseDto } from '../../categories/dto/responses';
import { imageUploadConfig } from '../../../shared/upload/upload.config';

@Controller('admin/categories')
@ApiTags('Admin Categories')
@ApiBearerAuth('JWT-auth')
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
export class AdminCategoriesController {
  constructor(
    private readonly adminCategoriesService: AdminCategoriesService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon', imageUploadConfig))
  @ApiOperation({ summary: 'Create category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Icon file is required' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    return this.adminCategoriesService.create(createCategoryDto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('icon', imageUploadConfig))
  @ApiOperation({ summary: 'Update category' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Category name already exists' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CategoryResponseDto> {
    return this.adminCategoriesService.update(id, updateCategoryDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.adminCategoriesService.delete(id);
  }
}
