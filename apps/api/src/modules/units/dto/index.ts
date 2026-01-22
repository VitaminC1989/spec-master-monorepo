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
  unitCode: string;

  @ApiProperty({ description: '单位名称', example: '米' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitName: string;

  @ApiPropertyOptional({ description: '单位类型', example: '长度' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unitType?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: '是否启用', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUnitDto {
  @ApiPropertyOptional({ description: '单位代码' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  unitCode?: string;

  @ApiPropertyOptional({ description: '单位名称' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  unitName?: string;

  @ApiPropertyOptional({ description: '单位类型' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  unitType?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ description: '是否启用' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export * from './unit-response.dto';
