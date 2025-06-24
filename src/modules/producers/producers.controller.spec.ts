import { Test, TestingModule } from '@nestjs/testing';
import { ProducersController } from './producers.controller';
import { CreateProducerUsecase } from './usecases/create-producer.usecase';
import { FindProducersUsecase } from './usecases/find-producers.usecase';
import { UpdateProducerUsecase } from './usecases/update-producer.usecase';
import { DeleteProducerUsecase } from './usecases/delete-producer.usecase';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { ProducerDto } from './dto/producer.dto';

describe('ProducersController', () => {
  let controller: ProducersController;

  const mockCreateUseCase = {
    execute: jest.fn(),
  };

  const mockFindUseCase = {
    execute: jest.fn(),
  };

  const mockUpdateUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteUseCase = {
    execute: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProducersController],
      providers: [
        { provide: CreateProducerUsecase, useValue: mockCreateUseCase },
        { provide: FindProducersUsecase, useValue: mockFindUseCase },
        { provide: UpdateProducerUsecase, useValue: mockUpdateUseCase },
        { provide: DeleteProducerUsecase, useValue: mockDeleteUseCase },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<ProducersController>(ProducersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a producer', async () => {
    const dto: ProducerDto = { name: 'Test', document: '12345678901' };
    const result = { id: 1, ...dto };
    mockCreateUseCase.execute.mockResolvedValue(result);

    const response = await controller.create(dto);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(dto);
    expect(response).toEqual(result);
  });

  it('should return all producers', async () => {
    const mockProducers = [{ id: 1, name: 'John', document: '123' }];
    mockFindUseCase.execute.mockResolvedValue(mockProducers);

    const result = await controller.findAll();

    expect(mockFindUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(mockProducers);
  });

  it('should return one producer', async () => {
    const document = '12345678901';
    const mockProducer = { id: 1, name: 'Jane', document };
    mockFindUseCase.execute.mockResolvedValue(mockProducer);

    const result = await controller.findOne(document);

    expect(mockFindUseCase.execute).toHaveBeenCalledWith(document);
    expect(result).toEqual(mockProducer);
  });

  it('should update a producer', async () => {
    const document = '12345678901';
    const dto: ProducerDto = { name: 'Updated Name', document: '10987654321' };
    const updated = { id: 1, ...dto };
    mockUpdateUseCase.execute.mockResolvedValue(updated);

    const result = await controller.update(document, dto);

    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith(dto, document);
    expect(result).toEqual(updated);
  });

  it('should delete a producer', async () => {
    const document = '12345678901';
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    const result = await controller.delete(document);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith(document);
    expect(result).toBeUndefined();
  });

  it('should log and rethrow errors', async () => {
    const error = new Error('Something went wrong');
    mockFindUseCase.execute.mockRejectedValue(error);

    await expect(controller.findAll()).rejects.toThrow(error);
  });
});
