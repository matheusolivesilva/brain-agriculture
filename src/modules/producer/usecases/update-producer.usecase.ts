import { Inject, NotFoundException } from '@nestjs/common';
import { IProducersService } from '../services/producers.service';
import { ProducerDto } from '../dto/producer.dto';
import { Document } from '../entities/document.entity';
import { Producer } from '../entities/producer.entity';
import { Producers } from '../../../infrastructure/database/sequelize/entities/producers.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';

export class UpdateProducerUsecase {
  constructor(
    @Inject('IProducersService')
    private readonly producerService: IProducersService,
    private logger: CustomLoggerService,
  ) {}

  async execute(input: ProducerDto, inputDocument: string): Promise<Producers> {
    try {
      const document = Document.create(inputDocument);

      const producer = new Producer(
        input.name,
        Document.create(input.document),
      );

      const result = await this.producerService.update(producer, document);
      if (result === 0) throw new NotFoundException('Producer not found');

      const savedProducer = await this.producerService.findOne(document);
      this.logger.log('Producer updated', { metadata: savedProducer });
      return savedProducer;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
