import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './common/controllers/app.controller';
import { AppService } from './common/providers/app.service';
import { CommonModule } from './common/common.module';
import { SbnpModule } from './modules/sbnp/sbnp.module';
import { ReportModule } from './modules/report/report.module';
import { ExportModule } from './modules/export/export.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EventsModule } from './modules/events/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend'),
      renderPath: '/dashboard',
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    SbnpModule,
    ReportModule,
    ExportModule,
    TelemetryModule,
    AuthModule,
    UserModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
