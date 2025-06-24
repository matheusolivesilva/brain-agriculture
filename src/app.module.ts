import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProducersModule } from './modules/producer/producers.module';
import { SequelizeMod } from './infrastructure/database/sequelize/sequelize.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { CropsModule } from './modules/crops/crops.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV ? '.env.test' : '.env',
    }),
    SequelizeMod,
    ProducersModule,
    PropertiesModule,
    CropsModule,
    DashboardModule,
  ],
  providers: [],
})
export class AppModule {}
