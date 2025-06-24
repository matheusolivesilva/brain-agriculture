import { Test, TestingModule } from '@nestjs/testing';
import { CreatePropertyUsecase } from './create-property.usecase';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PropertyDto } from '../dtos/property.dto';
import { Properties } from '../../../infrastructure/database/sequelize/entities/properties.entity';

describe('CreatePropertyUsecase', () => {
  let usecase: CreatePropertyUsecase;
  let mockPropertiesService: { create: jest.Mock };
  let mockProducerService: { findOne: jest.Mock };
  let mockLogger: { error: jest.Mock };

  beforeEach(async () => {
    mockPropertiesService = {
      create: jest.fn(),
    };

    mockProducerService = {
      findOne: jest.fn(),
    };

    mockLogger = {
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePropertyUsecase,
        { provide: 'IPropertiesService', useValue: mockPropertiesService },
        { provide: 'IProducersService', useValue: mockProducerService },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    usecase = module.get<CreatePropertyUsecase>(CreatePropertyUsecase);
  });

  const validInput: PropertyDto = {
    producerDocument: '88162699000137',
    name: 'Test Property',
    totalArea: 100,
    arableArea: 50,
    vegetationArea: 50,
    location: {
      city: 'CityName',
      state: 'ST',
    },
  };

  const invalidAreaInput: PropertyDto = {
    ...validInput,
    arableArea: 60,
    vegetationArea: 50, // Total 110 > totalArea 100
  };

  it('should create a property when input is valid', async () => {
    const mockProducer = { id: 'producer-id' };
    const mockPropertyResult = {
      id: 'test',
      name: 'Test Property',
    } as Partial<Properties>;

    mockProducerService.findOne.mockResolvedValue(mockProducer);
    mockPropertiesService.create.mockResolvedValue(mockPropertyResult);

    const result = await usecase.execute(validInput);

    expect(result).toEqual(mockPropertyResult);
    expect(mockProducerService.findOne).toHaveBeenCalled();
    expect(mockPropertiesService.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException if producer does not exist', async () => {
    mockProducerService.findOne.mockResolvedValue(null);

    await expect(usecase.execute(validInput)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should throw BadRequestException if areas exceed total', async () => {
    const mockProducer = { id: 'producer-id' };
    mockProducerService.findOne.mockResolvedValue(mockProducer);

    await expect(usecase.execute(invalidAreaInput)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should rethrow and log unexpected errors', async () => {
    const error = new Error('Unexpected error');
    mockProducerService.findOne.mockRejectedValue(error);

    await expect(usecase.execute(validInput)).rejects.toThrow(error);
    expect(mockLogger.error).toHaveBeenCalledWith(error);
  });
});
