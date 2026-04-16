import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/providers/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: DeepMockProxy<PrismaService>;
  let jwtService: JwtService;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user without password if credentials match', async () => {
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      const mockUser = {
        id: '1',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await service.validateUser('admin', password);

      expect(result).toBeDefined();
      expect(result.username).toBe('admin');
      expect(result.password).toBeUndefined();
    });

    it('should return null if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correct_password', 10);
      const mockUser = {
        id: '1',
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await service.validateUser('admin', 'wrong_password');

      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'pass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if validation fails', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login({ username: 'user', password: 'pass' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should return access token and user info on success', async () => {
      const user = { id: '1', username: 'admin', role: 'ADMIN' };
      jest.spyOn(service, 'validateUser').mockResolvedValue(user);

      const result = await service.login({ username: 'admin', password: 'password' });

      expect(result.access_token).toBe('mock_token');
      expect(result.user.username).toBe('admin');
      expect(result.user.role).toBe('ADMIN');
    });
  });
});
