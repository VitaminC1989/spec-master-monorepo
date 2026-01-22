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
  bomItemId: number;

  @ApiPropertyOptional({ description: '尺码', example: 'M' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  size?: string;

  @ApiProperty({ description: '规格值', example: '58.5' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  specValue: string;

  @ApiProperty({ description: '规格单位', example: 'cm' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  specUnit: string;

  @ApiPropertyOptional({ description: '排序顺序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
