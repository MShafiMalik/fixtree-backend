import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SellersService } from './sellers.service';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({
    status: 200,
    description: 'Sellers retrieved successfully',
  })
  async findAll() {
    return this.sellersService.findAll();
  }
}
