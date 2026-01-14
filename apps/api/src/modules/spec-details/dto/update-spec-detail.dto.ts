import { PartialType } from '@nestjs/swagger';
import { CreateSpecDetailDto } from './create-spec-detail.dto';

export class UpdateSpecDetailDto extends PartialType(CreateSpecDetailDto) {}
