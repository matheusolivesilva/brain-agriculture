import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProducerUsecase } from './delete-producer.usecase';
import { IProducersService } from '../services/producers.service';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { NotFoundException } from '@nestjs/common';

describe('DeleteProducerUsecase', () => {
  let usecase: DeleteProducerUsecase;
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
        DeleteProducerUsecase,
        { provide: 'IProducersService', useValue: mockService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    usecase = module.get(DeleteProducerUsecase);
  });

  it('should delete a producer successfully', async () => {
    mockService.findOne.mockResolvedValueOnce({ id: 1, name: 'João' } as any);
    mockService.delete.mockResolvedValueOnce();

    const result = await usecase.execute('060.783.260-66');

    expect(mockService.findOne).toHaveBeenCalled();
    expect(mockService.delete).toHaveBeenCalledWith(
      expect.objectContaining({ value: '06078326066' }),
    );
    expect(mockLogger.log).toHaveBeenCalledWith('Producer deleted', {
      metadata: '060.783.260-66',
    });
    expect(result).toBeUndefined();
  });

  it('should throw NotFoundException if producer not found', async () => {
    mockService.findOne.mockResolvedValueOnce(null);

    try {
      await usecase.execute('060.783.260-66');
      fail('Should have thrown NotFoundException');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Producer not found');
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    }
  });

  it('should throw and log error on failure', async () => {
    const internalError = new Error('Unexpected error');
    mockService.findOne.mockRejectedValueOnce(internalError);

    try {
      await usecase.execute('060.783.260-66');
    } catch (error) {
      expect(error).toBe(internalError);
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    }
  });
});
