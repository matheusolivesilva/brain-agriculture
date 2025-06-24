import { Module } from '@nestjs/common';
import { PropertiesService } from './services/properties.service';
import { PropertiesController } from './properties.controller';
import { CreatePropertyUsecase } from './usecases/create-property.usecase';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { Properties } from '../../infrastructure/database/sequelize/entities/properties.entity';
import { ProducersModule } from '../producer/producers.module';
import { FindPropertiesUsecase } from './usecases/find-properties.usecase';
import { States } from '../../infrastructure/database/sequelize/entities/states.entity';
import { Cities } from '../../infrastructure/database/sequelize/entities/cities.entity';

@Module({
  imports: [ProducersModule],
  controllers: [PropertiesController],
  providers: [
    CreatePropertyUsecase,
    FindPropertiesUsecase,
    CustomLoggerService,
    {
      provide: 'IPropertiesService',
      useClass: PropertiesService,
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
      provide: 'CitiesModel',
      useValue: Cities,
    },
  ],
  exports: ['IPropertiesService'],
})
export class PropertiesModule {}
