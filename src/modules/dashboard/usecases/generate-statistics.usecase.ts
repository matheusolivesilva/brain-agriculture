import { Inject } from '@nestjs/common';
import { IDashboardService } from '../services/dashboard.service';
import { DashboardDto } from '../dtos/dashboard.dto';

export class GenerateStatisticsUsecase {
  constructor(
    @Inject('IDashboardService') private dashboardService: IDashboardService,
  ) {}

  async execute(): Promise<DashboardDto> {
    const [
      totalOfProperties,
      totalAreaOfProperties,
      propertyByState,
      byPlantedCrop,
      bySoilUse,
    ] = await Promise.all([
      this.dashboardService.countTotalOfProperties(),
      this.dashboardService.sumTotalAreaFromProperties(),
      this.dashboardService.getPropertiesPercentagePerState(),
      this.dashboardService.getPercentagePerCrop(),
      this.dashboardService.getPercentagePerSoilUse(),
    ]);

    return {
      totalOfProperties,
      totalAreaOfProperties,
      pieChart: {
        propertyByState,
        byPlantedCrop,
        bySoilUse,
      },
    };
  }
}
