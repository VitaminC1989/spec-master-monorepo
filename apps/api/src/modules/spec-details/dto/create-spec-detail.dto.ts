import {
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpecDetailDto {
  @ApiProperty({ description: '所属配料明细ID' })
  @IsInt()
  bom_item_id: number;

  @ApiPropertyOptional({ description: '尺码', example: 'M' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  size?: string;

  @ApiProperty({ description: '规格值', example: '58.5' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  spec_value: string;

  @ApiProperty({ description: '规格单位', example: 'cm' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  spec_unit: string;

  @ApiPropertyOptional({ description: '排序顺序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;
}
