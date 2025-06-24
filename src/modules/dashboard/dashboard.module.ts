import { CustomLoggerService } from './../../common/nest/logger/custom-logger.service';
import { GenerateStatisticsUsecase } from './usecases/generate-statistics.usecase';
import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Properties } from 'src/infrastructure/database/sequelize/entities/properties.entity';
import { States } from 'src/infrastructure/database/sequelize/entities/states.entity';
import { CropsPlanted } from 'src/infrastructure/database/sequelize/entities/crops-planted.entity';

@Module({
  controllers: [DashboardController],
  providers: [
    GenerateStatisticsUsecase,
    CustomLoggerService,
    DashboardService,
    {
      provide: 'IDashboardService',
      useClass: DashboardService,
    },
    {
      provide: 'PropertiesModel',
      useValue: Properties,
    },
    {
      provide: 'StatesModel',
      useValue: States,
    },
    {
      provide: 'CropsPlantedModel',
      useValue: CropsPlanted,
    },
  ],
})
export class DashboardModule {}
