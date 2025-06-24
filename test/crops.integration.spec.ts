import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Properties } from 'src/infrastructure/database/sequelize/entities/properties.entity';
import { Producers } from 'src/infrastructure/database/sequelize/entities/producers.entity';

describe('CropsController (e2e)', () => {
  const TIMEOUT = 10000;
  let app: INestApplication;
  let sequelize: Sequelize;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    sequelize = app.get(Sequelize);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
    await app.close();
  });

  it(
    '/POST /crops',
    async () => {
      const dtoProducer = {
        name: 'João Teste',
        document: '67.667.862/0001-43',
      };
      const resProducer = await request(app.getHttpServer())
        .post('/producers')
        .send(dtoProducer)
        .expect(201);
      const createdProducer: Producers = resProducer.body;

      const dtoProperty = {
        producerDocument: createdProducer.document,
        name: 'John Doe Farm',
        totalArea: 300,
        arableArea: 200,
        vegetationArea: 100,
        location: {
          city: 'new york',
          state: 'New York',
        },
      };
      const resProperty = await request(app.getHttpServer())
        .post('/properties')
        .send(dtoProperty)
        .expect(201);
      const createdProperty: Properties = resProperty.body;

      const dto = {
        propertyId: createdProperty.id,
        harvestYear: 2024,
        type: 'Coffe',
      };
      const res = await request(app.getHttpServer())
        .post('/crops')
        .send(dto)
        .expect(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
      expect(res.body).toHaveProperty('harvest_id');
      expect(res.body.property_id).toBe(dto.propertyId);
      expect(res.body.type).toBe(dto.type);
    },
    TIMEOUT,
  );

  afterAll(async () => {
    await app.close();
    await sequelize.close();
  });
});
