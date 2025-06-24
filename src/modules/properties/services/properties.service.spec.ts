import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';
import { InternalServerErrorException } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { Locations } from '../../../infrastructure/database/sequelize/entities/locations.entity';
import { Property } from '../entities/property.entity';
import { Location } from '../entities/location.entity';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let mockPropertiesModel: any;
  let mockStatesModel: any;
  let mockCitiesModel: any;
  let mockLogger: any;

  beforeEach(async () => {
    mockPropertiesModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    mockStatesModel = {
      upsert: jest.fn(),
    };

    mockCitiesModel = {
      upsert: jest.fn(),
    };

    mockLogger = { error: jest.fn(), log: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        { provide: 'PropertiesModel', useValue: mockPropertiesModel },
        { provide: 'StatesModel', useValue: mockStatesModel },
        { provide: 'CitiesModel', useValue: mockCitiesModel },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  describe('create', () => {
    it('should create a property successfully', async () => {
      const property = new Property(
        'Test',
        100,
        40,
        60,
        new Location('City', 'State'),
      );
      const producerId = 'prod123';

      jest
        .spyOn(mockStatesModel, 'upsert')
        .mockResolvedValue([{ id: 'state-id' }]);
      jest
        .spyOn(mockCitiesModel, 'upsert')
        .mockResolvedValue([{ id: 'city-id' }]);
      jest
        .spyOn(mockPropertiesModel, 'create')
        .mockResolvedValue('created-property');

      const result = await service.create(property, producerId);

      expect(mockStatesModel.upsert).toHaveBeenCalledWith({ state: 'state' });
      expect(mockCitiesModel.upsert).toHaveBeenCalledWith({
        state_id: 'state-id',
        city: 'City',
      });
      expect(mockPropertiesModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          producer_id: producerId,
          name: 'Test',
          total_area: 100,
          arable_area: 40,
          vegetation_area: 60,
          location: { city_id: 'city-id' },
        }),
        { include: [Locations] },
      );
      expect(result).toBe('created-property');
    });

    it('should throw InternalServerErrorException on error', async () => {
      const property = new Property(
        'Test',
        100,
        40,
        60,
        new Location('City', 'State'),
      );
      const producerId = 'prod123';
      const error = new Error('DB error');

      jest.spyOn(mockStatesModel, 'upsert').mockRejectedValue(error);

      await expect(service.create(property, producerId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findOne', () => {
    it('should return a property by id', async () => {
      jest
        .spyOn(mockPropertiesModel, 'findByPk')
        .mockResolvedValue('found-property');
      const result = await service.findOne('prop-id');
      expect(result).toBe('found-property');
      expect(mockPropertiesModel.findByPk).toHaveBeenCalledWith('prop-id', {
        include: [{ all: true }],
      });
    });

    it('should log and throw error', async () => {
      const error = new Error('find error');
      jest.spyOn(mockPropertiesModel, 'findByPk').mockRejectedValue(error);

      await expect(service.findOne('prop-id')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findAll', () => {
    it('should return all properties', async () => {
      jest
        .spyOn(mockPropertiesModel, 'findAll')
        .mockResolvedValue(['prop1', 'prop2']);
      const result = await service.findAll();
      expect(result).toEqual(['prop1', 'prop2']);
      expect(mockPropertiesModel.findAll).toHaveBeenCalledWith({
        include: [{ all: true }],
      });
    });

    it('should handle error', async () => {
      const error = new InternalServerErrorException('findAll failed');
      jest.spyOn(mockPropertiesModel, 'findAll').mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('upsertState', () => {
    it('should upsert state', async () => {
      jest
        .spyOn(mockStatesModel, 'upsert')
        .mockResolvedValue([{ id: 'state-id', state: 'state' }]);
      const result = await service.upsertState('State');
      expect(result).toEqual({ id: 'state-id', state: 'state' });
    });

    it('should handle upsert state error', async () => {
      const error = new Error('upsert error');
      jest.spyOn(mockStatesModel, 'upsert').mockRejectedValue(error);

      await expect(service.upsertState('State')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });

  describe('upsertCity', () => {
    it('should upsert city', async () => {
      jest
        .spyOn(mockCitiesModel, 'upsert')
        .mockResolvedValue([{ id: 'city-id', city: 'City' }]);
      const result = await service.upsertCity('City', 'state-id');
      expect(result).toEqual({ id: 'city-id', city: 'City' });
    });

    it('should handle upsert city error', async () => {
      const error = new Error('city upsert error');
      jest.spyOn(mockCitiesModel, 'upsert').mockRejectedValue(error);

      await expect(service.upsertCity('City', 'state-id')).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalledWith(error);
    });
  });
});
