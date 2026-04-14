import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './common/controllers/app.controller';
import { AppService } from './common/providers/app.service';
import { CommonModule } from './common/common.module';
import { SbnpModule } from './modules/sbnp/sbnp.module';
import { ReportModule } from './modules/report/report.module';
import { ExportModule } from './modules/export/export.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    SbnpModule,
    ReportModule,
    ExportModule,
    TelemetryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
