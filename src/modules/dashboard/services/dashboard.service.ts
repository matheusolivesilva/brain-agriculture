import { Inject, Injectable } from '@nestjs/common';
import { col, fn } from 'sequelize';
import { CustomLoggerService } from 'src/common/nest/logger/custom-logger.service';
import { Cities } from 'src/infrastructure/database/sequelize/entities/cities.entity';
import { Locations } from 'src/infrastructure/database/sequelize/entities/locations.entity';
import { Properties } from 'src/infrastructure/database/sequelize/entities/properties.entity';
import { States } from 'src/infrastructure/database/sequelize/entities/states.entity';
import { PieChartDto } from '../dtos/pie-chart.dto';
import { CropsPlanted } from 'src/infrastructure/database/sequelize/entities/crops-planted.entity';

export interface IDashboardService {
  countTotalOfProperties(): Promise<number>;
  sumTotalAreaFromProperties(): Promise<number>;
  getPropertiesPercentagePerState(): Promise<PieChartDto[]>;
  getPercentagePerCrop(): Promise<PieChartDto[]>;
  getPercentagePerSoilUse(): Promise<PieChartDto[]>;
}
@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @Inject('PropertiesModel') private PropertiesModel: typeof Properties,
    @Inject('StatesModel') private StatesModel: typeof States,
    @Inject('CropsPlantedModel') private CropsPlantedModel: typeof CropsPlanted,
    private logger: CustomLoggerService,
  ) {}

  async countTotalOfProperties(): Promise<number> {
    try {
      return await this.PropertiesModel.count();
    } catch (error) {
      this.logger.error(`Error getting total of properties: ${error.message}`);
      throw error;
    }
  }

  async sumTotalAreaFromProperties(): Promise<number> {
    try {
      return await this.PropertiesModel.sum('total_area');
    } catch (error) {
      this.logger.error(
        `Error getting total area from properties: ${error.message}`,
      );
      throw error;
    }
  }

  async getPropertiesPercentagePerState(): Promise<PieChartDto[]> {
    try {
      const propertyCountPerState = await this.StatesModel.findAll({
        include: [
          {
            model: Cities,
            include: [
              {
                model: Locations,
                attributes: [],
                as: 'locations',
                include: [
                  {
                    model: Properties,
                    attributes: [],
                    as: 'property',
                  },
                ],
              },
            ],
            attributes: [],
          },
        ],
        attributes: [
          'state',
          [fn('COUNT', col('cities.locations.property.id')), 'totalProperty'],
        ],
        group: ['States.id', 'States.state'],
      });

      const totalOfProperties = propertyCountPerState.reduce(
        (previous, propertyCount) =>
          (previous += Number(propertyCount.dataValues.totalProperty)),
        0,
      );

      return propertyCountPerState.map((propertyCounts) => ({
        metric: propertyCounts.dataValues.state,
        percentage:
          (propertyCounts.dataValues.totalProperty * 100) / totalOfProperties,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting percentage of properties by state: ${error.message}`,
      );
      throw error;
    }
  }

  async getPercentagePerCrop(): Promise<PieChartDto[]> {
    try {
      const cropCountPerType = await this.CropsPlantedModel.findAll({
        attributes: ['type', [fn('COUNT', col('type')), 'totalCrop']],
        group: ['type'],
      });

      const totalOfCrops = cropCountPerType.reduce(
        (previous, cropCount) =>
          (previous += Number(cropCount.dataValues.totalCrop)),
        0,
      );

      return cropCountPerType.map((cropCounts) => ({
        metric: cropCounts.dataValues.type,
        percentage: (cropCounts.dataValues.totalCrop * 100) / totalOfCrops,
      }));
    } catch (error) {
      this.logger.error(
        `Error getting percentage of crops by type: ${error.message}`,
      );
      throw error;
    }
  }

  async getPercentagePerSoilUse(): Promise<PieChartDto[]> {
    try {
      const totalsPerAreaType = await this.PropertiesModel.findOne({
        attributes: [
          [fn('SUM', col('arable_area')), 'totalArable'],
          [fn('SUM', col('vegetation_area')), 'totalVegetation'],
          [fn('SUM', col('total_area')), 'totalArea'],
        ],
      });

      const {
        dataValues: { totalArable, totalVegetation, totalArea },
      } = totalsPerAreaType;

      const arablePercentage = (totalArable * 100) / totalArea;
      const vegetationPercentage = (totalVegetation * 100) / totalArea;
      return [
        { metric: 'arable', percentage: arablePercentage },
        { metric: 'vegetation', percentage: vegetationPercentage },
      ];
    } catch (error) {
      this.logger.error(
        `Error getting percentage of soils by use: ${error.message}`,
      );
      throw error;
    }
  }
}
