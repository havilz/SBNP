import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/providers/prisma.service';
import { IssueStatus } from '@prisma/client';
import { ISSUE_STATUS_MAPPING, MappedStatus } from '../../common/constants/status-mapping.constants';
import { CreateSBNPDto } from './dto/create-sbnp.dto';
import { UpdateSBNPDto } from './dto/update-sbnp.dto';

@Injectable()
export class SbnpService {
  constructor(private prisma: PrismaService) {}

  // --- Public Methods (Map) ---

  async findAllForMap() {
    const stations = await this.prisma.station.findMany({
      include: {
        reports: {
          orderBy: { reportedAt: 'desc' },
          take: 1,
        },
      },
    });

    return stations.map((station) => {
      const lastReport = station.reports[0] || null;
      return {
        id: station.id,
        name: station.name,
        type: station.type,
        coordinate: {
          lat: station.latitude,
          lng: station.longitude,
        },
        status: this.mapStatus(lastReport?.issueStatus || IssueStatus.UNKNOWN),
        conditionPercent: lastReport?.conditionPercent || 100,
        lastReport: lastReport
          ? {
              reportedAt: lastReport.reportedAt,
              issueStatus: lastReport.issueStatus,
              note: lastReport.note,
            }
          : null,
      };
    });
  }

  async findOneWithHistory(id: string) {
    const station = await this.prisma.station.findUnique({
      where: { id },
      include: {
        reports: {
          orderBy: { reportedAt: 'desc' },
        },
      },
    });

    if (!station) {
      throw new NotFoundException(`SBNP with ID ${id} not found`);
    }

    const lastReport = station.reports[0] || null;

    return {
      id: station.id,
      name: station.name,
      type: station.type,
      coordinate: {
        lat: station.latitude,
        lng: station.longitude,
      },
      powerSource: station.powerSource,
      yearBuilt: station.yearBuilt,
      latestStatus: this.mapStatus(lastReport?.issueStatus || IssueStatus.UNKNOWN),
      reports: station.reports.map((r) => ({
        reportedAt: r.reportedAt,
        issueStatus: r.issueStatus,
        conditionPercent: r.conditionPercent,
        issueDuration: r.issueDuration,
        issueCause: r.issueCause,
        note: r.note,
      })),
    };
  }

  // --- Admin Methods ---

  async create(createDto: CreateSBNPDto) {
    return this.prisma.station.create({
      data: createDto,
    });
  }

  async update(id: string, updateDto: UpdateSBNPDto) {
    return this.prisma.station.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    return this.prisma.station.delete({
      where: { id },
    });
  }

  // --- Private Helpers ---

  private mapStatus(rawStatus: IssueStatus): MappedStatus {
    return {
      ...ISSUE_STATUS_MAPPING[rawStatus],
      raw: rawStatus,
    };
  }
}
