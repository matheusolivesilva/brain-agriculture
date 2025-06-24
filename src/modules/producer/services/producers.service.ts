import { Document } from '../entities/document.entity';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Producer } from '../entities/producer.entity';
import { Producers } from '../../../infrastructure/database/sequelize/entities/producers.entity';
import { CustomLoggerService } from '../../../common/nest/logger/custom-logger.service';

export interface IProducersService {
  create(producer: Producer): Promise<Producers>;
  update(producer: Producer, document: Document): Promise<number>;
  findAll(): Promise<Producers[]>;
  findOne(document: Document): Promise<Producers>;
  delete(document: Document): Promise<void>;
}
@Injectable()
export class ProducersService implements IProducersService {
  constructor(
    @Inject('ProducersModel') private ProducersModel: typeof Producers,
    private logger: CustomLoggerService,
  ) {}

  async create(producer: Producer): Promise<Producers> {
    try {
      return await this.ProducersModel.create({
        name: producer.name,
        document: producer.document.value,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error saving producer: ${error.message}`,
      );
    }
  }

  async update(producer: Producer, document: Document): Promise<number> {
    try {
      const [affected] = await this.ProducersModel.update(
        {
          name: producer.name,
          document: producer.document.value,
        },
        {
          where: { document: document.value },
        },
      );
      return affected;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error updating producer: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Producers[]> {
    try {
      return await this.ProducersModel.findAll();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error finding producers: ${error.message}`,
      );
    }
  }

  async findOne(document: Document): Promise<Producers> {
    try {
      return await this.ProducersModel.findOne({
        where: { document: document.value },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error finding producer: ${error.message}`,
      );
    }
  }

  async delete(document: Document): Promise<void> {
    try {
      await this.ProducersModel.destroy({
        where: { document: document.value },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error removing producer: ${error.message}`,
      );
    }
  }
}
