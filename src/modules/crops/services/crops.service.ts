import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { CropPlanted } from '../entities/crop-planted.entity';
import { CropsPlanted } from '../../../infrastructure/database/sequelize/entities/crops-planted.entity';
import { Harvests } from '../../../infrastructure/database/sequelize/entities/harvests.entity';

export interface ICropsService {
  create(crop: CropPlanted, propertyId: string): Promise<CropPlanted>;
  upsertHarvest(year: number): Promise<Harvests>;
}

@Injectable()
export class CropsService implements ICropsService {
  constructor(
    @Inject('CropsModel') private CropsModel: typeof CropsPlanted,
    @Inject('HarvestsModel') private HarvestsModel: typeof Harvests,
    private logger: CustomLoggerService,
  ) {}

  async create(crop: CropPlanted, propertyId: string): Promise<CropsPlanted> {
    try {
      const harvest = await this.upsertHarvest(crop.harvest.year);
      return this.CropsModel.create({
        type: crop.type,
        harvest_id: harvest.id,
        property_id: propertyId,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error saving crop: ${error.message}`,
      );
    }
  }

  async upsertHarvest(year: number): Promise<Harvests> {
    try {
      const [harvest] = await this.HarvestsModel.upsert({
        year,
      });

      return harvest;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error saving harvest: ${error.message}`,
      );
    }
  }
}
