import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E: API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/auth/signup (POST) - should return 201 or 200', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signup')
        .send({ name: 'Test', email: 'test@example.com', password: '123456' });
      expect([200, 201, 400]).toContain(res.status); // 400 nếu email đã tồn tại
    });
  });

  describe('Users', () => {
    it('/users/me (GET) - should return 401 if not login', async () => {
      const res = await request(app.getHttpServer()).get('/users/me');
      expect(res.status).toBe(401);
    });
  });

  describe('Tasks', () => {
    it('/tasks (GET) - should return 401 if not login', async () => {
      const res = await request(app.getHttpServer()).get('/tasks');
      expect(res.status).toBe(401);
    });
  });

  describe('Projects', () => {
    it('/projects (GET) - should return 401 if not login', async () => {
      const res = await request(app.getHttpServer()).get('/projects');
      expect(res.status).toBe(401);
    });
  });

  describe('Admin', () => {
    it('/admin/users (GET) - should return 401 if not login', async () => {
      const res = await request(app.getHttpServer()).get('/admin/users');
      expect(res.status).toBe(401);
    });
  });
});
