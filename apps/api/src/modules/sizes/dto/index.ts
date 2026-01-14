import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSizeDto {
  @ApiProperty({ description: '尺码代码', example: 'M' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  size_code: string;

  @ApiProperty({ description: '尺码名称', example: '中号' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  size_name: string;

  @ApiPropertyOptional({ description: '排序顺序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateSizeDto {
  @ApiPropertyOptional({ description: '尺码代码' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  size_code?: string;

  @ApiPropertyOptional({ description: '尺码名称' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  size_name?: string;

  @ApiPropertyOptional({ description: '排序顺序' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sort_order?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
