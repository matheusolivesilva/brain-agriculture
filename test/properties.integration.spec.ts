import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import { Properties } from 'src/infrastructure/database/sequelize/entities/properties.entity';
import { Producers } from 'src/infrastructure/database/sequelize/entities/producers.entity';

describe('PropertiesController (e2e)', () => {
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

  let createdProperty: Properties;

  it(
    '/POST /properties',
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

      const dto = {
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
      const res = await request(app.getHttpServer())
        .post('/properties')
        .send(dto)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(dto.name);
      expect(res.body.total_area).toBe(dto.totalArea.toString());
      expect(res.body.arable_area).toBe(dto.arableArea.toString());
      expect(res.body.vegetation_area).toBe(dto.vegetationArea.toString());
      expect(res.body.producer_id).toBeDefined();
      expect(res.body.location.id).toBeDefined();
      createdProperty = res.body;
    },
    TIMEOUT,
  );

  it(
    '/GET /properties',
    async () => {
      const res = await request(app.getHttpServer())
        .get('/properties')
        .expect(200);

      const [body] = res.body;
      expect(body.arable_area).toEqual(createdProperty.arable_area);
      expect(body.created_at).toEqual(createdProperty.created_at);
      expect(body.crops).toHaveLength(0);
      expect(body.id).toEqual(createdProperty.id);
      expect(body.location).toEqual(createdProperty.location);
      expect(body.name).toEqual(createdProperty.name);
      expect(body.producer_id).toEqual(createdProperty.producer_id);
      expect(body.total_area).toEqual(createdProperty.total_area);
      expect(body.updated_at).toEqual(createdProperty.updated_at);
      expect(body.vegetation_area).toEqual(createdProperty.vegetation_area);
    },
    TIMEOUT,
  );

  it(
    '/GET /properties/:id',
    async () => {
      const res = await request(app.getHttpServer())
        .get(`/properties/${createdProperty.id}`)
        .expect(200);

      expect(res.body.arable_area).toEqual(createdProperty.arable_area);
      expect(res.body.created_at).toEqual(createdProperty.created_at);
      expect(res.body.crops).toHaveLength(0);
      expect(res.body.id).toEqual(createdProperty.id);
      expect(res.body.location).toEqual(createdProperty.location);
      expect(res.body.name).toEqual(createdProperty.name);
      expect(res.body.producer_id).toEqual(createdProperty.producer_id);
      expect(res.body.total_area).toEqual(createdProperty.total_area);
      expect(res.body.updated_at).toEqual(createdProperty.updated_at);
      expect(res.body.vegetation_area).toEqual(createdProperty.vegetation_area);
    },
    TIMEOUT,
  );

  afterAll(async () => {
    await app.close();
    await sequelize.close();
  });
});
