import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}
