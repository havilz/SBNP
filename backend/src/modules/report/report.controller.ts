import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@ApiTags('Reports')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // --- Public Routes ---

  @Get('latest')
  @ApiOperation({ summary: 'Get latest reports for all stations' })
  async findAllLatest() {
    return this.reportService.findAllLatest();
  }

  @Get('station/:id')
  @ApiOperation({ summary: 'Get all reports for a specific station' })
  async findByStation(@Param('id') id: string) {
    return this.reportService.findByStation(id);
  }

  // --- Admin Routes ---

  @Post()
  @ApiOperation({ summary: 'Create a new monthly report' })
  async create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing report' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return this.reportService.update(id, updateReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.remove(id);
  }
}
