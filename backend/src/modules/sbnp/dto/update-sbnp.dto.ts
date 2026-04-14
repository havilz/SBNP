import { PartialType } from '@nestjs/swagger';
import { CreateSBNPDto } from './create-sbnp.dto';

export class UpdateSBNPDto extends PartialType(CreateSBNPDto) {}
