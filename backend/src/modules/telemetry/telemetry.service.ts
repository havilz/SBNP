import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../../common/providers/prisma.service';
import { IssueStatus } from '@prisma/client';
import { AppGateway } from '../events/app.gateway';
import { ISSUE_STATUS_MAPPING } from '../../common/constants/status-mapping.constants';

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(
    private prisma: PrismaService,
    private eventsGateway: AppGateway,
  ) {}

  @Interval(60000) // Run every 1 minute
  async handleSimulation() {
    this.logger.log('Running SBNP Telemetry Simulation...');

    try {
      // Find all stations (Categories I-V are the only ones in DB now)
      const stations = await this.prisma.station.findMany({
        include: {
          reports: {
            orderBy: { reportedAt: 'desc' },
            take: 1,
          },
        },
      });

      let changesCount = 0;

      for (const station of stations) {
        const latestReport = station.reports[0];
        if (!latestReport) continue;

        let newStatus: IssueStatus | null = null;
        let newCondition = latestReport.conditionPercent;
        let newNote = latestReport.note;

        const rand = Math.random() * 100;

        if (latestReport.issueStatus === IssueStatus.NIHIL) {
          // 2% chance to break
          if (rand < 2) {
            newStatus = IssueStatus.PADAM;
            newCondition = Math.floor(Math.random() * 30); // 0-30% condition
            newNote = 'SIMULATED: Lampu padam terdeteksi otomatis';
          }
        } else if (latestReport.issueStatus === IssueStatus.PADAM) {
          // 15% chance to be fixed
          if (rand < 15) {
            newStatus = IssueStatus.NIHIL;
            newCondition = 90 + Math.floor(Math.random() * 10); // 90-100% condition
            newNote = 'SIMULATED: Perbaikan selesai, unit kembali normal';
          }
        }

        if (newStatus) {
          const report = await this.prisma.report.create({
            data: {
              stationId: station.id,
              issueStatus: newStatus,
              issueDuration: newStatus === IssueStatus.PADAM ? 1 : 0,
              conditionPercent: newCondition,
              note: newNote,
              reportedAt: new Date(),
            },
          });

          // Broadcast real-time update
          this.eventsGateway.broadcastSbnpUpdate({
            ...report,
            stationName: station.name,
            status: {
              ...ISSUE_STATUS_MAPPING[newStatus],
              raw: newStatus,
            },
          });

          this.logger.log(
            `Status Change: ${station.name} (${station.id}) -> ${newStatus}`,
          );
          changesCount++;
        }
      }

      this.logger.log(
        `Simulation complete. ${changesCount} status updates applied.`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error in simulation logic: ${message}`, stack);
    }
  }
}
