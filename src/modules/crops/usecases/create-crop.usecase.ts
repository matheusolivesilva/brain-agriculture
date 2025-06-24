import { Inject, NotFoundException } from '@nestjs/common';
import { CropDto } from '../dtos/crop.dto';
import { ICropsService } from '../services/crops.service';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { IPropertiesService } from '../../properties/services/properties.service';
import { CropPlanted } from '../entities/crop-planted.entity';
import { Harvest } from '../entities/harvest.entity';

export class CreateCropUsecase {
  constructor(
    @Inject('ICropsService')
    private readonly cropsService: ICropsService,
    @Inject('IPropertiesService')
    private readonly propertiesService: IPropertiesService,
    private logger: CustomLoggerService,
  ) {}

  async execute(input: CropDto): Promise<CropPlanted> {
    try {
      const property = await this.propertiesService.findOne(input.propertyId);
      if (!property) {
        throw new NotFoundException(
          `The property with ID ${input.propertyId} does not exist`,
        );
      }

      const harvest = new Harvest(input.harvestYear);
      const crop = new CropPlanted(input.type, harvest);

      return this.cropsService.create(crop, property.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
