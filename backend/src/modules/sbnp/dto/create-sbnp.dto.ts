import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSBNPDto {
  @ApiProperty({ example: '5904', description: 'DSI (ID Unik SBNP)' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Mensu Tg. Waka', description: 'Nama Station' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID Kategori SBNP (1: Menara Suar, dll)',
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ example: -2.469 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 126.045 })
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional({ example: 'EG/EB' })
  @IsString()
  @IsOptional()
  powerSource?: string;

  @ApiPropertyOptional({ example: '1998/2012' })
  @IsString()
  @IsOptional()
  yearBuilt?: string;
}
