import { Module } from '@nestjs/common';
import { SbnpController } from './sbnp.controller';
import { SbnpService } from './sbnp.service';
import { SbnpMapController } from './sbnp-map.controller';

@Module({
  controllers: [SbnpController, SbnpMapController],
  providers: [SbnpService]
})
export class SbnpModule {}
