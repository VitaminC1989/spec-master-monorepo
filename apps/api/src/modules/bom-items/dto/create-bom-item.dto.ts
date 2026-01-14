import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  ValidateNested,
  MaxLength,
  MinLength,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSpecDetailDto {
  @ApiPropertyOptional({ description: 'BOM项ID（创建时可省略）' })
  @IsOptional()
  @IsInt()
  bom_item_id?: number;

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

export class CreateBomItemDto {
  @ApiProperty({ description: '所属颜色版本ID' })
  @IsInt()
  variant_id: number;

  @ApiProperty({ description: '辅料名称', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  material_name: string;

  @ApiPropertyOptional({ description: '辅料图片URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  material_image_url?: string;

  @ApiPropertyOptional({ description: '辅料颜色文字描述' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  material_color_text?: string;

  @ApiPropertyOptional({ description: '辅料颜色图片URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  material_color_image_url?: string;

  @ApiProperty({ description: '单耗', example: 0.8 })
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsPositive({ message: '单耗必须大于0' })
  usage: number;

  @ApiProperty({ description: '单位', example: '米' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  unit: string;

  @ApiPropertyOptional({ description: '供应商' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  supplier?: string;

  @ApiPropertyOptional({ description: '排序顺序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({
    description: '规格明细列表',
    type: [CreateSpecDetailDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecDetailDto)
  @IsArray()
  specDetails?: CreateSpecDetailDto[];
}
