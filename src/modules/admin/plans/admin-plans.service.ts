import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PlansRepository } from '../../plans/plans.repository';
import { CreatePlanDto, UpdatePlanDto } from '../../plans/dto/requests';
import { PlanResponseDto } from '../../plans/dto/responses';
import { CountriesService } from '../../countries/countries.service';

@Injectable()
export class AdminPlansService {
  constructor(
    private readonly plansRepository: PlansRepository,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    // Get country by code
    const country = await this.countriesService.findByCode(
      createPlanDto.countryCode,
    );

    // Check if plan with same name and country already exists (including deleted)
    const existing = await this.plansRepository.findByNameAndCountryId(
      createPlanDto.name,
      country.id,
      true, // Include deleted plans to catch unique constraint violations
    );

    if (existing) {
      if (existing.deletedAt) {
        throw new ConflictException(
          `A soft-deleted plan with name "${createPlanDto.name}" already exists for country "${country.name}". Please restore or permanently delete it first.`,
        );
      }
      throw new ConflictException(
        `Plan with name "${createPlanDto.name}" already exists for country "${country.name}"`,
      );
    }

    // If setting as default, ensure no other default plan exists for this country
    if (createPlanDto.isDefault) {
      const existingDefault = await this.plansRepository.findDefaultByCountryId(
        country.id,
      );
      if (existingDefault) {
        throw new ConflictException(
          `A default plan already exists for country "${country.name}". Please update or remove the existing default plan first.`,
        );
      }
    }

    const plan = await this.plansRepository.create({
      name: createPlanDto.name,
      countryId: country.id,
      description: createPlanDto.description ?? null,
      serviceLimit: createPlanDto.serviceLimit,
      price: createPlanDto.price,
      canExtendBookingTime: createPlanDto.canExtendBookingTime ?? false,
      isDefault: createPlanDto.isDefault ?? false,
      isActive: createPlanDto.isActive ?? true,
    });

    plan.country = country;
    return new PlanResponseDto(plan);
  }

  async update(
    id: string,
    updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    const plan = await this.plansRepository.findById(id, true); // Admins can see deleted plans
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    // If country code is being updated, get the new country
    let countryId = plan.countryId;
    if (updatePlanDto.countryCode) {
      const country = await this.countriesService.findByCode(
        updatePlanDto.countryCode,
      );
      countryId = country.id;
    }

    // Check if updating name or country would create a duplicate
    const name = updatePlanDto.name ?? plan.name;

    if (
      (updatePlanDto.name || updatePlanDto.countryCode) &&
      (name !== plan.name || countryId !== plan.countryId)
    ) {
      const existing = await this.plansRepository.findByNameAndCountryId(
        name,
        countryId,
        true, // Include deleted plans to catch unique constraint violations
      );

      if (existing && existing.id !== id) {
        if (existing.deletedAt) {
          throw new ConflictException(
            `A soft-deleted plan with name "${name}" already exists for country "${plan.country.name}". Please restore or permanently delete it first.`,
          );
        } else {
          throw new ConflictException(
            `Plan with name "${name}" already exists for this country`,
          );
        }
      }
    }

    // If setting as default, ensure no other default plan exists for this country
    if (updatePlanDto.isDefault === true && !plan.isDefault) {
      const existingDefault =
        await this.plansRepository.findDefaultByCountryId(countryId);
      if (existingDefault && existingDefault.id !== id) {
        throw new ConflictException(
          `A default plan already exists for this country. Please update or remove the existing default plan first.`,
        );
      }
    }

    // Validate service limit
    if (updatePlanDto.serviceLimit !== undefined) {
      if (updatePlanDto.serviceLimit < 1) {
        throw new BadRequestException('Service limit must be at least 1');
      }
    }

    // Update plan fields
    if (updatePlanDto.name !== undefined) plan.name = updatePlanDto.name;
    if (updatePlanDto.description !== undefined)
      plan.description = updatePlanDto.description ?? null;
    if (updatePlanDto.serviceLimit !== undefined)
      plan.serviceLimit = updatePlanDto.serviceLimit;
    if (updatePlanDto.price !== undefined) plan.price = updatePlanDto.price;
    if (updatePlanDto.canExtendBookingTime !== undefined)
      plan.canExtendBookingTime = updatePlanDto.canExtendBookingTime;
    if (updatePlanDto.isDefault !== undefined)
      plan.isDefault = updatePlanDto.isDefault;
    if (updatePlanDto.isActive !== undefined)
      plan.isActive = updatePlanDto.isActive;
    if (updatePlanDto.countryCode) plan.countryId = countryId;

    // Save updated plan (single query, maintains country relationship)
    const updatedPlan = await this.plansRepository.save(plan);
    return new PlanResponseDto(updatedPlan);
  }

  async remove(id: string): Promise<{ message: string }> {
    const plan = await this.plansRepository.findById(id, true); // Admins can see deleted plans
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    // Cannot delete default plan
    if (plan.isDefault) {
      throw new BadRequestException(
        'Cannot delete default plan. Please set another plan as default first.',
      );
    }

    await this.plansRepository.softDelete(id);
    return { message: 'Plan deleted successfully' };
  }
}
