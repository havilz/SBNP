import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../common/providers/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserRole } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const createUserDto = {
        username: 'newuser',
        password: 'password123',
        role: UserRole.OPERATOR,
      };

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockImplementation(({ data }) => Promise.resolve({
        id: 1,
        ...data,
      }) as any);

      const result = await service.create(createUserDto);

      expect(prismaMock.user.create).toHaveBeenCalled();
      expect(result.username).toBe('newuser');
      
      const createCall = (prismaMock.user.create as jest.Mock).mock.calls[0][0];
      const isMatch = await bcrypt.compare('password123', createCall.data.password);
      expect(isMatch).toBe(true);
    });

    it('should throw ConflictException if username exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 1 } as any);

      await expect(service.create({ username: 'existing', password: 'p', role: UserRole.OPERATOR }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should throw ConflictException when deleting the last admin', async () => {
      const adminUser = { id: 1, username: 'admin', role: 'ADMIN' };
      prismaMock.user.findUnique.mockResolvedValue(adminUser as any);
      prismaMock.user.count.mockResolvedValue(1);

      await expect(service.remove(1))
        .rejects.toThrow(ConflictException);
    });

    it('should delete user if not the last admin', async () => {
      const adminUser = { id: 1, username: 'admin', role: 'ADMIN' };
      prismaMock.user.findUnique.mockResolvedValue(adminUser as any);
      prismaMock.user.count.mockResolvedValue(2);

      const result = await service.remove(1);

      expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if user to delete not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return users without passwords', async () => {
      prismaMock.user.findMany.mockResolvedValue([
        { id: 1, username: 'user1', password: 'hash1', role: 'ADMIN' },
        { id: 2, username: 'user2', password: 'hash2', role: 'OPERATOR' },
      ] as any);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect((result[0] as any).password).toBeUndefined();
      expect(result[0].username).toBe('user1');
    });
  });
});
