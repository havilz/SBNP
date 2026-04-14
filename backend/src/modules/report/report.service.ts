import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {
  ISSUE_STATUS_MAPPING,
  MappedStatus,
} from '../../common/constants/status-mapping.constants';
import { IssueStatus } from '@prisma/client';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  // --- Admin Methods ---

  async create(createDto: CreateReportDto) {
    // Check if station exists
    const station = await this.prisma.station.findUnique({
      where: { id: createDto.stationId },
    });

    if (!station) {
      throw new NotFoundException(
        `Station with ID ${createDto.stationId} not found`,
      );
    }

    return this.prisma.report.create({
      data: {
        ...createDto,
        reportedAt: new Date(createDto.reportedAt),
      },
    });
  }

  async update(id: number, updateDto: UpdateReportDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return this.prisma.report.update({
      where: { id },
      data: {
        ...updateDto,
        reportedAt: updateDto.reportedAt
          ? new Date(updateDto.reportedAt)
          : undefined,
      },
    });
  }

  async remove(id: number) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return this.prisma.report.delete({ where: { id } });
  }

  // --- Public Methods ---

  async findAllLatest() {
    // Get unique station IDs
    const stations = await this.prisma.station.findMany({
      select: { id: true, name: true },
    });

    const latestReports = await Promise.all(
      stations.map(async (station) => {
        const report = await this.prisma.report.findFirst({
          where: { stationId: station.id },
          orderBy: { reportedAt: 'desc' },
        });

        if (!report) return null;

        return {
          ...report,
          stationName: station.name,
          status: this.mapStatus(report.issueStatus),
        };
      }),
    );

    return latestReports.filter((r) => r !== null);
  }

  async findByStation(stationId: string) {
    const reports = await this.prisma.report.findMany({
      where: { stationId },
      orderBy: { reportedAt: 'desc' },
    });

    return reports.map((report) => ({
      ...report,
      status: this.mapStatus(report.issueStatus),
    }));
  }

  // --- Private Helpers ---

  private mapStatus(rawStatus: IssueStatus): MappedStatus {
    return {
      ...ISSUE_STATUS_MAPPING[rawStatus],
      raw: rawStatus,
    };
  }
}
