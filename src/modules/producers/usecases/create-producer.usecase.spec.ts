import { Test, TestingModule } from '@nestjs/testing';
import { CreateProducerUsecase } from './create-producer.usecase';
import { IProducersService } from '../services/producers.service';
import { ProducerDto } from '../dto/producer.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { Producer } from '../entities/producer.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { Producers } from '../../../infrastructure/database/sequelize/entities/producers.entity';

describe('CreateProducerUsecase', () => {
  let usecase: CreateProducerUsecase;
  let mockService: jest.Mocked<IProducersService>;
  let mockLogger: jest.Mocked<CustomLoggerService>;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProducerUsecase,
        { provide: 'IProducersService', useValue: mockService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    usecase = module.get(CreateProducerUsecase);
  });

  it('should create a producer successfully', async () => {
    const dto: ProducerDto = {
      name: 'João Silva',
      document: '060.783.260-66',
    };

    const resultMock: Partial<Producers> = {
      id: 'test',
      name: 'João Silva',
      document: '12345678900',
    };

    mockService.create.mockResolvedValueOnce(resultMock as any as Producers);

    const result = await usecase.execute(dto);

    expect(result).toEqual(resultMock);
    expect(mockService.create).toHaveBeenCalledWith(expect.any(Producer));
    expect(mockLogger.log).toHaveBeenCalledWith('Producer created', {
      metadata: resultMock,
    });
  });

  it('should log and rethrow error if creation fails', async () => {
    const dto: ProducerDto = {
      name: 'João Silva',
      document: '060.783.260-66',
    };

    const error = new InternalServerErrorException('Create failed');
    mockService.create.mockRejectedValueOnce(error);

    try {
      await usecase.execute(dto);
      fail('Expected error to be thrown');
    } catch (err) {
      expect(err).toBe(error);
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    }
  });
});
