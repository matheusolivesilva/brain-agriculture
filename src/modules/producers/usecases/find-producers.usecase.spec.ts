import { Test, TestingModule } from '@nestjs/testing';
import { FindProducersUsecase } from './find-producers.usecase';
import { IProducersService } from '../services/producers.service';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { NotFoundException } from '@nestjs/common';
import { Producers } from '../../../infrastructure/database/sequelize/entities/producers.entity';

describe('FindProducersUsecase', () => {
  let usecase: FindProducersUsecase;
  let mockService: jest.Mocked<IProducersService>;
  let mockLogger: jest.Mocked<CustomLoggerService>;

  const documentString = '060.783.260-66';
  const cleanDocument = '06078326066';

  const singleProducer: Partial<Producers> = {
    id: 'test',
    name: 'João',
    document: cleanDocument,
  };

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
        FindProducersUsecase,
        { provide: 'IProducersService', useValue: mockService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    usecase = module.get(FindProducersUsecase);
  });

  it('should return all producers when no document is provided', async () => {
    const allProducers = [singleProducer];
    mockService.findAll.mockResolvedValueOnce(
      allProducers as any as Producers[],
    );

    const result = await usecase.execute();

    expect(result).toEqual(allProducers);
    expect(mockService.findAll).toHaveBeenCalled();
    expect(mockLogger.log).not.toHaveBeenCalled();
  });

  it('should return one producer when document is provided', async () => {
    mockService.findOne.mockResolvedValueOnce(
      singleProducer as any as Producers,
    );

    const result = await usecase.execute(documentString);

    expect(result).toEqual(singleProducer);
    expect(mockService.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ value: cleanDocument }),
    );
    expect(mockLogger.log).toHaveBeenCalledWith('Producer found', {
      metadata: singleProducer,
    });
  });

  it('should throw NotFoundException when producer not found', async () => {
    mockService.findOne.mockResolvedValueOnce(null);

    try {
      await usecase.execute(documentString);
      fail('Expected NotFoundException');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Producer not found');
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    }
  });

  it('should log and rethrow unexpected errors', async () => {
    const unexpectedError = new Error('Unexpected failure');
    mockService.findAll.mockRejectedValueOnce(unexpectedError);

    try {
      await usecase.execute();
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBe(unexpectedError);
    }
  });
});
