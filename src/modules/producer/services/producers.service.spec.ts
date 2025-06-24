import { Test, TestingModule } from '@nestjs/testing';
import { ProducersService } from './producers.service';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { Producer } from '../entities/producer.entity';
import { Document } from '../entities/document.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('ProducersService', () => {
  let service: ProducersService;
  let mockModel: any;
  let mockLogger: any;

  const document: Document = Document.create('06078326066');

  const producer = new Producer('João', document);

  beforeEach(async () => {
    mockModel = {
      create: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      destroy: jest.fn(),
    };

    mockLogger = {
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: 'ProducersModel', useValue: mockModel },
        { provide: CustomLoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
  });

  describe('create', () => {
    it('should create a producer', async () => {
      mockModel.create.mockResolvedValueOnce({ id: 1, name: 'João' });

      const result = await service.create(producer);

      expect(result).toEqual({ id: 1, name: 'João' });
      expect(mockModel.create).toHaveBeenCalledWith({
        name: 'João',
        document: '06078326066',
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockModel.create.mockRejectedValueOnce(
        new InternalServerErrorException('Create failed'),
      );

      await expect(service.create(producer)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a producer and return affected rows', async () => {
      mockModel.update.mockResolvedValueOnce([1]);

      const result = await service.update(producer, document);

      expect(result).toBe(1);
      expect(mockModel.update).toHaveBeenCalledWith(
        { name: 'João', document: '06078326066' },
        { where: { document: '06078326066' } },
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockModel.update.mockRejectedValueOnce(
        new InternalServerErrorException('Update failed'),
      );

      await expect(service.update(producer, document)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all producers', async () => {
      mockModel.findAll.mockResolvedValueOnce([{ id: 1, name: 'João' }]);

      const result = await service.findAll();

      expect(result).toEqual([{ id: 1, name: 'João' }]);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockModel.findAll.mockRejectedValueOnce(
        new InternalServerErrorException('FindAll failed'),
      );

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a producer by document', async () => {
      mockModel.findOne.mockResolvedValueOnce({ id: 1, name: 'João' });

      const result = await service.findOne(document);

      expect(result).toEqual({ id: 1, name: 'João' });
      expect(mockModel.findOne).toHaveBeenCalledWith({
        where: { document: '06078326066' },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockModel.findOne.mockRejectedValueOnce(
        new InternalServerErrorException('FindOne failed'),
      );

      await expect(service.findOne(document)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a producer', async () => {
      mockModel.destroy.mockResolvedValueOnce(1);

      await service.delete(document);

      expect(mockModel.destroy).toHaveBeenCalledWith({
        where: { document: '06078326066' },
      });
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockModel.destroy.mockRejectedValueOnce(
        new InternalServerErrorException('Delete failed'),
      );

      await expect(service.delete(document)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
