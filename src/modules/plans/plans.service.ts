import { Injectable, NotFoundException } from '@nestjs/common';
import { PlansRepository } from './plans.repository';
import { Plan } from './entities/plan.entity';
import { GetPlansQueryDto } from './dto/requests';
import { PlanResponseDto } from './dto/responses';
import { PaginationResponseDto } from '../../common/dto/responses';
import { UtilService } from '../../common/util/util.service';

@Injectable()
export class PlansService {
  constructor(
    private readonly plansRepository: PlansRepository,
    private readonly utilService: UtilService,
  ) {}

  async findAll(
    queryDto: GetPlansQueryDto,
    includeDeleted = false,
  ): Promise<PaginationResponseDto<PlanResponseDto>> {
    const { page, limit } = this.utilService.getPaginationParams(queryDto);

    const { plans, total } = await this.plansRepository.findAll({
      page,
      limit,
      countryCode: queryDto.countryCode,
      isActive: queryDto.isActive,
      isDefault: queryDto.isDefault,
      includeDeleted,
    });

    const items = plans.map((plan) => new PlanResponseDto(plan));

    return new PaginationResponseDto(items, total, page, limit);
  }

  async findOne(id: string, includeDeleted = false): Promise<PlanResponseDto> {
    const plan = await this.plansRepository.findById(id, includeDeleted);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return new PlanResponseDto(plan);
  }

  async getDefaultPlanByCountryCode(countryCode: string): Promise<Plan> {
    const plan =
      await this.plansRepository.findDefaultByCountryCode(countryCode);
    if (!plan) {
      throw new NotFoundException(
        `Default plan not found for country code "${countryCode}"`,
      );
    }
    return plan;
  }

  async findByCountryCode(
    countryCode: string,
    isActive = true,
  ): Promise<PlanResponseDto[]> {
    const plans = await this.plansRepository.findByCountryCode(
      countryCode,
      isActive,
    );
    return plans.map((plan) => new PlanResponseDto(plan));
  }
}
