import { ApiProperty } from '@nestjs/swagger';
import { PieChartDto } from './pie-chart.dto';

class PieChartDataDto {
  @ApiProperty()
  propertyByState: PieChartDto[];
  @ApiProperty()
  byPlantedCrop: PieChartDto[];
  @ApiProperty()
  bySoilUse: PieChartDto[];
}

export class DashboardDto {
  @ApiProperty()
  totalOfProperties: number;
  @ApiProperty()
  totalAreaOfProperties: number;
  @ApiProperty()
  pieChart: PieChartDataDto;
}
