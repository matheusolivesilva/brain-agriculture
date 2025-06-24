import { Inject, NotFoundException } from '@nestjs/common';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { IPropertiesService } from '../services/properties.service';
import { Properties } from '../../../infrastructure/database/sequelize/entities/properties.entity';

export class FindPropertiesUsecase {
  constructor(
    @Inject('IPropertiesService')
    private readonly propertiesService: IPropertiesService,
    private logger: CustomLoggerService,
  ) {}

  async execute(propertyId?: string): Promise<Properties[] | Properties> {
    try {
      if (!propertyId) return this.propertiesService.findAll();
      const propertyFound = await this.propertiesService.findOne(propertyId);
      if (!propertyFound) throw new NotFoundException('Property not found');
      this.logger.log('Property found', { metadata: propertyFound });
      return propertyFound;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
