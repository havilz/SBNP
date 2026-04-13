import { Module } from '@nestjs/common';
import { AppController } from './common/controllers/app.controller';
import { AppService } from './common/providers/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
