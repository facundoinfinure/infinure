import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Chat (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/chat/conversations (POST) debe crear conversación', async () => {
    // Suponemos que hay un token hardcodeado para tests ("test-token")
    const res = await request(app.getHttpServer())
      .post('/chat/conversations')
      .set('Authorization', 'Bearer test-token')
      .send({});

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  afterAll(async () => {
    await app.close();
  });
}); 