import { PartialType } from '@nestjs/mapped-types';
import { CreateOpdDto } from './create-opd.dto';

export class UpdateOpdDto extends PartialType(CreateOpdDto) {}
