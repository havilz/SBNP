import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IssueStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: '5904', description: 'DSI (ID Station SBNP)' })
  @IsString()
  @IsNotEmpty()
  stationId: string;

  @ApiProperty({ example: '2026-04-10T10:00:00Z', description: 'Tanggal laporan dibuat' })
  @IsDateString()
  @IsNotEmpty()
  reportedAt: string;

  @ApiPropertyOptional({ example: 90, minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  conditionPercent?: number;

  @ApiProperty({ enum: IssueStatus, example: IssueStatus.NIHIL })
  @IsEnum(IssueStatus)
  issueStatus: IssueStatus;

  @ApiPropertyOptional({ example: 0, description: 'Lama kendala dalam hari' })
  @IsInt()
  @Min(0)
  @IsOptional()
  issueDuration?: number;

  @ApiPropertyOptional({ example: 'Lampu mati' })
  @IsString()
  @IsOptional()
  issueCause?: string;

  @ApiPropertyOptional({ example: 'Perlu perbaikan segera' })
  @IsString()
  @IsOptional()
  note?: string;
}
