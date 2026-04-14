import { Module } from '@nestjs/common';
import { AppController } from './common/controllers/app.controller';
import { AppService } from './common/providers/app.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
