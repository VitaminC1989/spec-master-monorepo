import { PartialType } from '@nestjs/swagger';
import { CreateSpecSheetDto } from './create-spec-sheet.dto';

export class UpdateSpecSheetDto extends PartialType(CreateSpecSheetDto) {}
