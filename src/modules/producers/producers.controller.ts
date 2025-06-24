import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateProducerUsecase } from './usecases/create-producer.usecase';
import { ProducerDto } from './dto/producer.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindProducersUsecase } from './usecases/find-producers.usecase';
import { UpdateProducerUsecase } from './usecases/update-producer.usecase';
import { DeleteProducerUsecase } from './usecases/delete-producer.usecase';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { Producers } from '../../infrastructure/database/sequelize/entities/producers.entity';

@ApiTags('producers')
@Controller('producers')
export class ProducersController {
  constructor(
    @Inject(CreateProducerUsecase)
    private readonly createProducerUseCase: CreateProducerUsecase,
    @Inject(UpdateProducerUsecase)
    private readonly updateProducerUseCase: UpdateProducerUsecase,
    @Inject(FindProducersUsecase)
    private readonly findProducersUseCase: FindProducersUsecase,
    @Inject(DeleteProducerUsecase)
    private readonly deleteProducerUsecase: DeleteProducerUsecase,
    private logger: CustomLoggerService,
  ) {}

  @ApiResponse({
    status: 201,
    type: Producers,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post()
  async create(@Body() body: ProducerDto) {
    try {
      return await this.createProducerUseCase.execute(body);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    type: [Producers],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  async findAll() {
    try {
      return await this.findProducersUseCase.execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    type: Producers,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':document')
  async findOne(@Param('document') document: string) {
    try {
      return await this.findProducersUseCase.execute(document);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    type: Producers,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Patch(':document')
  async update(
    @Param('document') document: string,
    @Body() producerDto: ProducerDto,
  ) {
    try {
      return await this.updateProducerUseCase.execute(producerDto, document);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':document')
  async delete(@Param('document') document: string) {
    try {
      return await this.deleteProducerUsecase.execute(document);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
