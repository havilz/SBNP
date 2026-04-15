import { Controller, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SbnpService } from './sbnp.service';
import { CreateSBNPDto } from './dto/create-sbnp.dto';
import { UpdateSBNPDto } from './dto/update-sbnp.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - SBNP Management')
@ApiBearerAuth()
@Controller('sbnp')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SbnpController {
  constructor(private readonly sbnpService: SbnpService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SBNP station' })
  async create(@Body() createSBNPDto: CreateSBNPDto) {
    return this.sbnpService.create(createSBNPDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing SBNP station' })
  async update(@Param('id') id: string, @Body() updateSBNPDto: UpdateSBNPDto) {
    return this.sbnpService.update(id, updateSBNPDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete an SBNP station (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.sbnpService.remove(id);
    return { message: `SBNP ${id} deleted successfully` };
  }
}
