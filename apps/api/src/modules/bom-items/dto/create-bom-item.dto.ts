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
  bomItemId?: number;

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

export class CreateBomItemDto {
  @ApiProperty({ description: '所属颜色版本ID' })
  @IsInt()
  variantId: number;

  @ApiProperty({ description: '辅料名称', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  materialName: string;

  @ApiPropertyOptional({ description: '辅料图片URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  materialImageUrl?: string;

  @ApiPropertyOptional({ description: '辅料颜色文字描述' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  materialColorText?: string;

  @ApiPropertyOptional({ description: '辅料颜色图片URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  materialColorImageUrl?: string;

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
  sortOrder?: number;

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
