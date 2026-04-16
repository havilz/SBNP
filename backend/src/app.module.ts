import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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

import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

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
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
