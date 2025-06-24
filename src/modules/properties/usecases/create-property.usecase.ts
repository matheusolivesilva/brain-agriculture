import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { PropertyDto } from '../dtos/property.dto';
import { Location } from '../entities/location.entity';
import { Property } from '../entities/property.entity';
import { IPropertiesService } from '../services/properties.service';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { Document } from '../../../modules/producer/entities/document.entity';
import { IProducersService } from '../../../modules/producer/services/producers.service';
import { Properties } from '../../../infrastructure/database/sequelize/entities/properties.entity';

export class CreatePropertyUsecase {
  constructor(
    @Inject('IPropertiesService')
    private readonly propertiesService: IPropertiesService,
    @Inject('IProducersService')
    private readonly producerService: IProducersService,
    private logger: CustomLoggerService,
  ) {}

  async execute(input: PropertyDto): Promise<Properties> {
    try {
      const document = Document.create(input.producerDocument);

      const producer = await this.producerService.findOne(document);
      if (!producer) {
        throw new NotFoundException(
          `The farmer ${document.value} does not exist`,
        );
      }

      const { location } = input;

      const property = new Property(
        input.name,
        input.totalArea,
        input.arableArea,
        input.vegetationArea,
        new Location(location.city, location.state),
      );

      if (!property.isTotalAreaValid()) {
        throw new BadRequestException(
          'The sum of arable area and vegetation area must not be greater than total area',
        );
      }

      return this.propertiesService.create(property, producer.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
