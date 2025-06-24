import { Module } from '@nestjs/common';
import { CropsController } from './crops.controller';
import { CreateCropUsecase } from './usecases/create-crop.usecase';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { PropertiesModule } from '../properties/properties.module';
import { CropsService } from './services/crops.service';
import { CropsPlanted } from '../..//infrastructure/database/sequelize/entities/crops-planted.entity';
import { Harvests } from '../../infrastructure/database/sequelize/entities/harvests.entity';

@Module({
  imports: [PropertiesModule],
  controllers: [CropsController],
  providers: [
    CreateCropUsecase,
    CustomLoggerService,
    {
      provide: 'ICropsService',
      useClass: CropsService,
    },
    {
      provide: 'CropsModel',
      useValue: CropsPlanted,
    },
    {
      provide: 'HarvestsModel',
      useValue: Harvests,
    },
  ],
})
export class CropsModule {}
