import { Test, TestingModule } from '@nestjs/testing';
import { SbnpService } from './sbnp.service';
import { PrismaService } from '../../common/providers/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { IssueStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('SbnpService', () => {
  let service: SbnpService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SbnpService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SbnpService>(SbnpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllForMap', () => {
    it('should return stations with mapped status', async () => {
      const mockStations = [
        {
          id: '1',
          name: 'Station 1',
          latitude: -3.0,
          longitude: 128.0,
          category: { name: 'Cat 1' },
          reports: [
            {
              reportedAt: new Date(),
              issueStatus: IssueStatus.NIHIL,
              conditionPercent: 100,
              note: 'OK',
            },
          ],
        },
      ];

      prismaMock.station.findMany.mockResolvedValue(mockStations as any);

      const result = await service.findAllForMap();

      expect(result).toHaveLength(1);
      expect(result[0].status.label).toBe('NORMAL');
      expect(result[0].status.color).toBe('green');
    });

    it('should return UNKNOWN status if no reports exist', async () => {
      const mockStations = [
        {
          id: '2',
          name: 'Station 2',
          latitude: -3.0,
          longitude: 128.0,
          category: { name: 'Cat 2' },
          reports: [],
        },
      ];

      prismaMock.station.findMany.mockResolvedValue(mockStations as any);

      const result = await service.findAllForMap();

      expect(result[0].status.label).toBe('UNKNOWN');
    });
  });

  describe('findOneWithHistory', () => {
    it('should throw NotFoundException if station does not exist', async () => {
      prismaMock.station.findUnique.mockResolvedValue(null);

      await expect(service.findOneWithHistory('999')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return station with full history', async () => {
      const mockStation = {
        id: '1',
        name: 'Station 1',
        category: { name: 'Cat 1' },
        latitude: -3.0,
        longitude: 128.0,
        powerSource: 'Solar',
        yearBuilt: 2020,
        reports: [
          {
            reportedAt: new Date(),
            issueStatus: IssueStatus.NIHIL,
            conditionPercent: 100,
            note: 'OK',
          },
        ],
      };

      prismaMock.station.findUnique.mockResolvedValue(mockStation as any);

      const result = await service.findOneWithHistory('1');

      expect(result.id).toBe('1');
      expect(result.reports).toHaveLength(1);
      expect(result.latestStatus.label).toBe('NORMAL');
    });
  });
});
