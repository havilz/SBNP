import { Module } from '@nestjs/common';
import { AppController } from './common/controllers/app.controller';
import { AppService } from './common/providers/app.service';
import { CommonModule } from './common/common.module';
import { SbnpModule } from './modules/sbnp/sbnp.module';

@Module({
  imports: [CommonModule, SbnpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
