import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProducerUsecase } from './update-producer.usecase';
import { IProducersService } from '../services/producers.service';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { ProducerDto } from '../dto/producer.dto';
import { NotFoundException } from '@nestjs/common';
import { Producers } from '../../../infrastructure/database/sequelize/entities/producers.entity';
import { Document } from '../entities/document.entity';

describe('UpdateProducerUsecase', () => {
  let usecase: UpdateProducerUsecase;
  let mockService: jest.Mocked<IProducersService>;
  let mockLogger: jest.Mocked<CustomLoggerService>;

  const inputDto: ProducerDto = {
    name: 'Maria Silva',
    document: '987.654.321-00',
  };

  const inputDocument = '060.783.260-66';
  const cleanInputDoc = '06078326066';
  const cleanDtoDoc = '98765432100';

  const updatedProducer: Partial<Producers> = {
    id: 'test',
    name: 'Maria Silva',
    document: cleanDtoDoc,
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
        UpdateProducerUsecase,
        { provide: 'IProducersService', useValue: mockService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    usecase = module.get(UpdateProducerUsecase);
  });

  it('should update and return the updated producer', async () => {
    mockService.update.mockResolvedValueOnce(1);
    mockService.findOne.mockResolvedValueOnce(
      updatedProducer as any as Producers,
    );

    const result = await usecase.execute(inputDto, inputDocument);

    expect(mockService.update).toHaveBeenCalledWith(
      {
        name: 'Maria Silva',
        document: Document.create('987.654.321-00'),
      },
      Document.create(cleanInputDoc),
    );

    expect(mockService.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ value: cleanInputDoc }),
    );

    expect(mockLogger.log).toHaveBeenCalledWith('Producer updated', {
      metadata: updatedProducer,
    });

    expect(result).toEqual(updatedProducer);
  });

  it('should throw NotFoundException if update returns 0', async () => {
    mockService.update.mockResolvedValueOnce(0);

    try {
      await usecase.execute(inputDto, inputDocument);
      fail('Should have thrown NotFoundException');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Producer not found');
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    }
  });

  it('should log and rethrow unexpected errors', async () => {
    const unexpected = new Error('Unexpected DB error');
    mockService.update.mockRejectedValueOnce(unexpected);

    try {
      await usecase.execute(inputDto, inputDocument);
    } catch (error) {
      expect(error).toBe(unexpected);
      expect(mockLogger.error).toHaveBeenCalledWith(unexpected);
    }
  });
});
