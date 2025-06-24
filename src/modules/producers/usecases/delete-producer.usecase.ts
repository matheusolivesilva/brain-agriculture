import { Inject, NotFoundException } from '@nestjs/common';
import { IProducersService } from '../services/producers.service';
import { Document } from '../entities/document.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';

export class DeleteProducerUsecase {
  constructor(
    @Inject('IProducersService')
    private readonly producerService: IProducersService,
    private logger: CustomLoggerService,
  ) {}

  async execute(documentInput: string) {
    try {
      const document = Document.create(documentInput);

      const savedProducer = await this.producerService.findOne(document);
      if (!savedProducer) throw new NotFoundException('Producer not found');
      const result = await this.producerService.delete(document);
      this.logger.log('Producer deleted', { metadata: documentInput });
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
