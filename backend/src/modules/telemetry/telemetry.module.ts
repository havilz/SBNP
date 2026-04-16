import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { KeepAliveService } from './keep-alive.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TelemetryService, KeepAliveService],
  exports: [TelemetryService, KeepAliveService],
})
export class TelemetryModule {}
