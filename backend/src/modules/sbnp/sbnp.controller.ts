import { Controller, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SbnpService } from './sbnp.service';
import { CreateSBNPDto } from './dto/create-sbnp.dto';
import { UpdateSBNPDto } from './dto/update-sbnp.dto';

@ApiTags('Admin - SBNP Management')
@Controller('sbnp')
export class SbnpController {
  constructor(private readonly sbnpService: SbnpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SBNP station' })
  async create(@Body() createSBNPDto: CreateSBNPDto) {
    const data = await this.sbnpService.create(createSBNPDto);
    return { data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing SBNP station' })
  async update(@Param('id') id: string, @Body() updateSBNPDto: UpdateSBNPDto) {
    const data = await this.sbnpService.update(id, updateSBNPDto);
    return { data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an SBNP station' })
  async remove(@Param('id') id: string) {
    await this.sbnpService.remove(id);
    return { data: { message: `SBNP ${id} deleted successfully` } };
  }
}
