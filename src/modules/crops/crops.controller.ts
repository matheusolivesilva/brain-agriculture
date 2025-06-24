import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateCropUsecase as CreateCropUsecase } from './usecases/create-crop.usecase';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomLoggerService } from '../../common/nest/logger/custom-logger.service';
import { CropDto } from './dtos/crop.dto';
import { CropsPlanted } from '../../infrastructure/database/sequelize/entities/crops-planted.entity';

@ApiTags('crops')
@Controller('crops')
export class CropsController {
  constructor(
    @Inject(CreateCropUsecase)
    private readonly createCropUsecase: CreateCropUsecase,
    private logger: CustomLoggerService,
  ) {}

  @ApiResponse({
    status: 201,
    type: CropsPlanted,
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
  async create(@Body() body: CropDto) {
    try {
      return this.createCropUsecase.execute(body);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
