import {
  IsString,
  IsOptional,
  IsInt,
  IsUrl,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ description: '所属款号ID' })
  @IsInt()
  style_id: number;

  @ApiProperty({ description: '颜色名称', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  color_name: string;

  @ApiPropertyOptional({ description: '样衣图片URL', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  sample_image_url?: string;

  @ApiPropertyOptional({ description: '尺码范围说明', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  size_range?: string;

  @ApiPropertyOptional({ description: '排序顺序', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;
}
