import {
  IsString,
  IsOptional,
  IsInt,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStyleDto {
  @ApiProperty({ description: '款号', example: '9128', maxLength: 20 })
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  styleNo: string;

  @ApiPropertyOptional({ description: '款式名称', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  styleName?: string;

  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsInt()
  customerId?: number;

  @ApiPropertyOptional({ description: '公共备注' })
  @IsOptional()
  @IsString()
  publicNote?: string;
}
