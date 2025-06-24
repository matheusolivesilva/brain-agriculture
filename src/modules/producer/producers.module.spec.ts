import { Test, TestingModule } from '@nestjs/testing';
import { ProducersModule } from './producers.module';
import { ProducersController } from './producers.controller';
import { CreateProducerUsecase } from './usecases/create-producer.usecase';
import { UpdateProducerUsecase } from './usecases/update-producer.usecase';
import { FindProducersUsecase } from './usecases/find-producers.usecase';
import { DeleteProducerUsecase } from './usecases/delete-producer.usecase';
import { ProducersService } from './services/producers.service';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';

describe('ProducersModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ProducersModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide ProducersController', () => {
    const controller = module.get(ProducersController);
    expect(controller).toBeInstanceOf(ProducersController);
  });

  it('should provide CreateProducerUsecase', () => {
    const useCase = module.get(CreateProducerUsecase);
    expect(useCase).toBeInstanceOf(CreateProducerUsecase);
  });

  it('should provide UpdateProducerUsecase', () => {
    const useCase = module.get(UpdateProducerUsecase);
    expect(useCase).toBeInstanceOf(UpdateProducerUsecase);
  });

  it('should provide FindProducersUsecase', () => {
    const useCase = module.get(FindProducersUsecase);
    expect(useCase).toBeInstanceOf(FindProducersUsecase);
  });

  it('should provide DeleteProducerUsecase', () => {
    const useCase = module.get(DeleteProducerUsecase);
    expect(useCase).toBeInstanceOf(DeleteProducerUsecase);
  });

  it('should provide IProducersService token', () => {
    const service = module.get<ProducersService>('IProducersService');
    expect(service).toBeInstanceOf(ProducersService);
  });

  it('should provide CustomLoggerService', () => {
    const logger = module.get(CustomLoggerService);
    expect(logger).toBeInstanceOf(CustomLoggerService);
  });
});
