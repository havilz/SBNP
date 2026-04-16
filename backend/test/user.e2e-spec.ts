import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/providers/prisma.service';
import * as bcrypt from 'bcrypt';

describe('User Management (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let operatorToken: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = 'file:./test.db';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    
    prisma = app.get<PrismaService>(PrismaService);

    // Seed Admin and Operator
    await prisma.user.deleteMany();
    const adminPass = await bcrypt.hash('admin123', 10);
    const operatorPass = await bcrypt.hash('operator123', 10);

    const admin = await prisma.user.create({
      data: { username: 'admin', password: adminPass, role: 'ADMIN' },
    });
    const operator = await prisma.user.create({
      data: { username: 'operator', password: operatorPass, role: 'OPERATOR' },
    });

    // Login to get tokens
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    
    if (adminLogin.status !== 200) {
      console.error('Admin Login Failed:', adminLogin.body);
    }
    adminToken = adminLogin.body.data?.access_token;

    const operatorLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'operator', password: 'operator123' });
    
    if (operatorLogin.status !== 200) {
      console.error('Operator Login Failed:', operatorLogin.body);
    }
    operatorToken = operatorLogin.body.data?.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('RBAC Security Check', () => {
    it('GET /api/users - Should return 401 if no token', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(401);
    });

    it('GET /api/users - Should return 403 for OPERATOR role', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(403);
    });

    it('GET /api/users - Should return 200 for ADMIN role', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });

  describe('User CRUD (Admin Only)', () => {
    it('POST /api/users - Admin can create new operator', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          username: 'new_op',
          password: 'new_password',
          role: 'OPERATOR'
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.username).toBe('new_op');
          expect(res.body.data.password).toBeUndefined();
        });
    });

    it('DELETE /api/users/:id - Operator cannot delete Admin', async () => {
      const adminId = (await prisma.user.findUnique({ where: { username: 'admin' } }))!.id;
      
      return request(app.getHttpServer())
        .delete(`/api/users/${adminId}`)
        .set('Authorization', `Bearer ${operatorToken}`)
        .expect(403);
    });

    it('DELETE /api/users/:id - Admin can delete Operator', async () => {
      const opToDel = await prisma.user.create({
        data: { username: 'to_delete', password: 'p', role: 'OPERATOR' }
      });

      return request(app.getHttpServer())
        .delete(`/api/users/${opToDel.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
