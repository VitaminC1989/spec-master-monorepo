import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUnitDto {
  @ApiProperty({ description: '单位代码', example: 'm' })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  unit_code: string;

  @ApiProperty({ description: '单位名称', example: '米' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unit_name: string;

  @ApiPropertyOptional({ description: '单位类型', example: '长度' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit_type?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateUnitDto {
  @ApiPropertyOptional({ description: '单位代码' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  unit_code?: string;

  @ApiPropertyOptional({ description: '单位名称' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unit_name?: string;

  @ApiPropertyOptional({ description: '单位类型' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unit_type?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
