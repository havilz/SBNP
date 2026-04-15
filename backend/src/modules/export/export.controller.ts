import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { type Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('csv')
  @ApiOperation({ summary: 'Export all reports to CSV' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.exportService.exportCsv();
    res.header('Content-Type', 'text/csv');
    res.attachment(`sbnp-reports-${new Date().getTime()}.csv`);
    return res.send(csv);
  }

  @Get('excel')
  @ApiOperation({ summary: 'Export all reports to Excel' })
  async exportExcel(@Res() res: Response) {
    const buffer = await this.exportService.exportExcel();
    res.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.attachment(`sbnp-reports-${new Date().getTime()}.xlsx`);
    return res.send(buffer);
  }
}
