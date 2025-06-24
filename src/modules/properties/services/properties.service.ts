import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Properties } from '../../../infrastructure/database/sequelize/entities/properties.entity';
import { Property } from '../entities/property.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';
import { Locations } from '../../../infrastructure/database/sequelize/entities/locations.entity';
import { States } from '../../../infrastructure/database/sequelize/entities/states.entity';
import { Cities } from '../../../infrastructure/database/sequelize/entities/cities.entity';

export interface IPropertiesService {
  create(property: Property, producerId: string): Promise<Properties>;
  findOne(id: string): Promise<Properties>;
  findAll(): Promise<Properties[]>;
  upsertState(state: string): Promise<States>;
  upsertCity(city: string, stateId: string): Promise<Cities>;
}

@Injectable()
export class PropertiesService implements IPropertiesService {
  constructor(
    @Inject('PropertiesModel') private PropertiesModel: typeof Properties,
    @Inject('StatesModel') private StatesModel: typeof States,
    @Inject('CitiesModel') private CitiesModel: typeof Cities,
    private logger: CustomLoggerService,
  ) {}

  async create(property: Property, producerId: string): Promise<Properties> {
    try {
      const { location } = property;
      const savedState = await this.upsertState(location.state);
      const savedCity = await this.upsertCity(location.city, savedState.id);
      return await this.PropertiesModel.create(
        {
          producer_id: producerId,
          name: property.name,
          total_area: property.totalArea,
          arable_area: property.arableArea,
          vegetation_area: property.vegetationArea,
          location: {
            city_id: savedCity.id,
          },
        },
        { include: [Locations] },
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error saving property: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Properties> {
    try {
      return await this.PropertiesModel.findByPk(id, {
        include: [{ all: true }],
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error finding property: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Properties[]> {
    try {
      return await this.PropertiesModel.findAll({ include: [{ all: true }] });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error finding property: ${error.message}`,
      );
    }
  }

  async upsertState(state: string): Promise<States> {
    try {
      const [savedState] = await this.StatesModel.upsert({
        state: state.toLowerCase(),
      });

      return savedState;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error saving state: ${error.message}`,
      );
    }
  }

  async upsertCity(city: string, stateId: string): Promise<Cities> {
    try {
      const [savedCity] = await this.CitiesModel.upsert({
        state_id: stateId.toLowerCase(),
        city,
      });

      return savedCity;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error saving city: ${error.message}`,
      );
    }
  }
}
