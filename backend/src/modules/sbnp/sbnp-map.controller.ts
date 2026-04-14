import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SbnpService } from './sbnp.service';

@ApiTags('Public - Map & Monitoring')
@Controller('map/sbnp')
export class SbnpMapController {
  constructor(private readonly sbnpService: SbnpService) {}

  @Get()
  @ApiOperation({ summary: 'Get all SBNP stations for map visualization' })
  async findAll() {
    const data = await this.sbnpService.findAllForMap();
    return { data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed SBNP station data and report history' })
  async findOne(@Param('id') id: string) {
    const data = await this.sbnpService.findOneWithHistory(id);
    return { data };
  }
}
