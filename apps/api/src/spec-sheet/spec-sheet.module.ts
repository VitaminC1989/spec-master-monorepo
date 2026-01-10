import { Module } from '@nestjs/common';
import { SpecSheetService } from './spec-sheet.service';
import { SpecSheetController } from './spec-sheet.controller';

@Module({
  controllers: [SpecSheetController],
  providers: [SpecSheetService],
})
export class SpecSheetModule {}
