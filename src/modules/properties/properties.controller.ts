import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreatePropertyUsecase } from './usecases/create-property.usecase';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { PropertyDto } from './dtos/property.dto';
import { Properties } from '../../infrastructure/database/sequelize/entities/properties.entity';
import { FindPropertiesUsecase } from './usecases/find-properties.usecase';

@ApiTags('producers')
@Controller('properties')
export class PropertiesController {
  constructor(
    @Inject(CreatePropertyUsecase)
    private readonly createPropertyUsecase: CreatePropertyUsecase,
    private readonly findPropertiesUsecase: FindPropertiesUsecase,
    private logger: CustomLoggerService,
  ) {}

  @ApiResponse({
    status: 201,
    type: Properties,
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
  async create(@Body() body: PropertyDto) {
    try {
      return await this.createPropertyUsecase.execute(body);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    type: [Properties],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  async findAll() {
    try {
      return await this.findPropertiesUsecase.execute();
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiResponse({
    status: 200,
    type: Properties,
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
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.findPropertiesUsecase.execute(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
