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
  style_no: string;

  @ApiPropertyOptional({ description: '款式名称', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  style_name?: string;

  @ApiPropertyOptional({ description: '客户ID' })
  @IsOptional()
  @IsInt()
  customer_id?: number;

  @ApiPropertyOptional({ description: '公共备注' })
  @IsOptional()
  @IsString()
  public_note?: string;
}
