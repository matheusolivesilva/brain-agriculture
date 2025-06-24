import { Inject, NotFoundException } from '@nestjs/common';
import { IProducersService } from '../services/producers.service';
import { Document } from '../entities/document.entity';
import { Producers } from '../../../infrastructure/database/sequelize/entities/producers.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';

export class FindProducersUsecase {
  constructor(
    @Inject('IProducersService')
    private readonly producerService: IProducersService,
    private logger: CustomLoggerService,
  ) {}

  async execute(inputDocument?: string): Promise<Producers[] | Producers> {
    try {
      if (!inputDocument) return this.producerService.findAll();
      const document = Document.create(inputDocument);
      const producerFound = await this.producerService.findOne(document);
      if (!producerFound) throw new NotFoundException('Producer not found');
      this.logger.log('Producer found', { metadata: producerFound });
      return producerFound;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
