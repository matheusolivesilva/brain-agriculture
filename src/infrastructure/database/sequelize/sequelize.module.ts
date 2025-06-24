import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { Producers } from './entities/producers.entity';
import { Harvests } from './entities/harvests.entity';
import { CropsPlanted } from './entities/crops-planted.entity';
import { Locations } from './entities/locations.entity';
import { Properties } from './entities/properties.entity';
import { States } from './entities/states.entity';
import { Cities } from './entities/cities.entity';

/*
    Módulo que configura a conexão com o banco de dados utilizando o Sequelize.
 */
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true,
        synchronize: process.env.NODE_ENV === 'test' ? true : false,
        models: [
          Producers,
          Harvests,
          CropsPlanted,
          Locations,
          Properties,
          States,
          Cities,
        ],
        define: {
          timestamps: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [SequelizeModule],
})
export class SequelizeMod {}
