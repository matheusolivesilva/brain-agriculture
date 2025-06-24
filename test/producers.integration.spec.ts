import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';

describe('ProducersController (e2e)', () => {
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

  let createdProducer: any;

  it(
    '/POST /producers',
    async () => {
      const dto = { name: 'João Teste', document: '12345678909' };

      const res = await request(app.getHttpServer())
        .post('/producers')
        .send(dto)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(dto.name);
      expect(res.body.document).toBe(dto.document);
      createdProducer = res.body;
    },
    TIMEOUT,
  );

  it(
    '/GET /producers',
    async () => {
      const res = await request(app.getHttpServer())
        .get('/producers')
        .expect(200);

      expect(res.body).toEqual([createdProducer]);
    },
    TIMEOUT,
  );

  it(
    '/GET /producers/:document',
    async () => {
      const res = await request(app.getHttpServer())
        .get(`/producers/${createdProducer.document}`)
        .expect(200);

      expect(res.body.name).toBe('João Teste');
    },
    TIMEOUT,
  );

  it(
    '/PATCH /producers/:document',
    async () => {
      const updated = {
        name: 'João Atualizado',
        document: createdProducer.document,
      };

      const res = await request(app.getHttpServer())
        .patch(`/producers/${createdProducer.document}`)
        .send(updated)
        .expect(200);

      expect(res.body.name).toBe('João Atualizado');
    },
    TIMEOUT,
  );

  it(
    '/DELETE /producers/:document',
    async () => {
      await request(app.getHttpServer())
        .delete(`/producers/${createdProducer.document}`)
        .expect(204);
    },
    TIMEOUT,
  );

  afterAll(async () => {
    await app.close();
    await sequelize.close();
  });
});
