import { Controller, Get, Inject } from '@nestjs/common';
import { GenerateStatisticsUsecase } from './usecases/generate-statistics.usecase';
import { CustomLoggerService } from 'src/common/nest/logger/custom-logger.service';
import { ApiResponse } from '@nestjs/swagger';
import { DashboardDto } from './dtos/dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(GenerateStatisticsUsecase)
    private readonly generateStatisticsUsecase: GenerateStatisticsUsecase,
    private logger: CustomLoggerService,
  ) {}

  @ApiResponse({
    status: 200,
    type: DashboardDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  async generateDash() {
    try {
      return await this.generateStatisticsUsecase.execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
