import { Module } from '@nestjs/common';
import { SpecDetailsController } from './spec-details.controller';
import { SpecDetailsService } from './spec-details.service';

@Module({
  controllers: [SpecDetailsController],
  providers: [SpecDetailsService],
  exports: [SpecDetailsService],
})
export class SpecDetailsModule {}
