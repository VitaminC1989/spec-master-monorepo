import { Test, TestingModule } from '@nestjs/testing';
import { SpecSheetController } from './spec-sheet.controller';
import { SpecSheetService } from './spec-sheet.service';

describe('SpecSheetController', () => {
  let controller: SpecSheetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecSheetController],
      providers: [SpecSheetService],
    }).compile();

    controller = module.get<SpecSheetController>(SpecSheetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
