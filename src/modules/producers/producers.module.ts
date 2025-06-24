import { Module } from '@nestjs/common';
import { ProducersService } from './services/producers.service';
import { ProducersController } from './producers.controller';
import { CreateProducerUsecase } from './usecases/create-producer.usecase';
import { Producers } from '../../infrastructure/database/sequelize/entities/producers.entity';
import { FindProducersUsecase } from './usecases/find-producers.usecase';
import { UpdateProducerUsecase } from './usecases/update-producer.usecase';
import { DeleteProducerUsecase } from './usecases/delete-producer.usecase';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';

@Module({
  controllers: [ProducersController],
  providers: [
    CreateProducerUsecase,
    UpdateProducerUsecase,
    FindProducersUsecase,
    DeleteProducerUsecase,
    CustomLoggerService,
    {
      provide: 'IProducersService',
      useClass: ProducersService,
    },
    {
      provide: 'ProducersModel',
      useValue: Producers,
    },
  ],
  exports: ['IProducersService'],
})
export class ProducersModule {}
