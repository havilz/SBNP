import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/providers/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Override DATABASE_URL for e2e tests
    process.env.DATABASE_URL = 'file:./test.db';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);
    
    // Cleanup and Seed Admin for test
    await prisma.user.deleteMany();
    const hashedPassword = await bcrypt.hash('admin_pass_123', 10);
    await prisma.user.create({
      data: {
        username: 'admin_test',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/auth/login (POST)', () => {
    it('should return 201 and access_token on success', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin_test',
          password: 'admin_pass_123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.access_token).toBeDefined();
          expect(res.body.data.user.username).toBe('admin_test');
          expect(res.body.data.user.role).toBe('ADMIN');
        });
    });

    it('should return 401 for wrong password', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin_test',
          password: 'wrong_password',
        })
        .expect(401);
    });

    it('should return 401 for non-existent user', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'ghost',
          password: 'any_password',
        })
        .expect(401);
    });

    it('should return 400 for missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'admin_test',
          // missing password
        })
        .expect(400);
    });
  });
});
