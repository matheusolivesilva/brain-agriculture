import { Inject } from '@nestjs/common';
import { IProducersService } from '../services/producers.service';
import { ProducerDto } from '../dto/producer.dto';
import { Document } from '../entities/document.entity';
import { Producer } from '../entities/producer.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';

export class CreateProducerUsecase {
  constructor(
    @Inject('IProducersService')
    private readonly producerService: IProducersService,
    private logger: CustomLoggerService,
  ) {}

  async execute(input: ProducerDto) {
    try {
      const document = Document.create(input.document);

      const producer = new Producer(input.name, document);

      const result = await this.producerService.create(producer);
      this.logger.log('Producer created', { metadata: result });

      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
