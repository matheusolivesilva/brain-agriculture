import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { CreatePropertyUsecase } from './usecases/create-property.usecase';
import { FindPropertiesUsecase } from './usecases/find-properties.usecase';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { InternalServerErrorException } from '@nestjs/common';
import { PropertyDto } from './dtos/property.dto';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let createPropertyUsecase: CreatePropertyUsecase;
  let findPropertiesUsecase: FindPropertiesUsecase;
  let logger: CustomLoggerService;

  const mockCreatePropertyUsecase = {
    execute: jest.fn(),
  };

  const mockFindPropertiesUsecase = {
    execute: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        { provide: CreatePropertyUsecase, useValue: mockCreatePropertyUsecase },
        { provide: FindPropertiesUsecase, useValue: mockFindPropertiesUsecase },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    createPropertyUsecase = module.get(CreatePropertyUsecase);
    findPropertiesUsecase = module.get(FindPropertiesUsecase);
    logger = module.get(CustomLoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a property', async () => {
      const dto: PropertyDto = {
        name: 'Test Property',
        totalArea: 100,
        arableArea: 60,
        vegetationArea: 40,
        location: { city: 'Test City', state: 'Test State' },
        producerDocument: '12345678900',
      };
      const created: any = {
        id: 'test',
        name: 'Test Property',
        total_area: 100,
        arable_area: 60,
        vegetation_area: 40,
      };

      jest.spyOn(createPropertyUsecase, 'execute').mockResolvedValue(created);

      const result = await controller.create(dto);
      expect(result).toEqual(created);
      expect(createPropertyUsecase.execute).toHaveBeenCalledWith(dto);
    });

    it('should log and throw error on create', async () => {
      const dto = {} as PropertyDto;
      const error = new InternalServerErrorException('Create failed');
      jest.spyOn(createPropertyUsecase, 'execute').mockRejectedValue(error);

      await expect(controller.create(dto)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      const properties: any[] = [{ id: '1' }, { id: '2' }];
      jest
        .spyOn(findPropertiesUsecase, 'execute')
        .mockResolvedValue(properties);

      const result = await controller.findAll();
      expect(result).toEqual(properties);
      expect(findPropertiesUsecase.execute).toHaveBeenCalled();
    });

    it('should log and throw error on findAll', async () => {
      const error = new InternalServerErrorException('findAll failed');
      jest.spyOn(findPropertiesUsecase, 'execute').mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      const property: any = { id: '1', name: 'Test' };
      jest.spyOn(findPropertiesUsecase, 'execute').mockResolvedValue(property);

      const result = await controller.findOne('1');
      expect(result).toEqual(property);
      expect(findPropertiesUsecase.execute).toHaveBeenCalledWith('1');
    });

    it('should log and throw error on findOne', async () => {
      const error = new InternalServerErrorException('findOne failed');
      jest.spyOn(findPropertiesUsecase, 'execute').mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(error);
    });
  });
});
