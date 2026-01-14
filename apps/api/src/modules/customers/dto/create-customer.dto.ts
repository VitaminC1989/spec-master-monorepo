import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: '客户名称', maxLength: 100 })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  customer_name: string;

  @ApiPropertyOptional({ description: '联系人', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contact_person?: string;

  @ApiPropertyOptional({ description: '联系电话', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  contact_phone?: string;

  @ApiPropertyOptional({ description: '联系邮箱', maxLength: 100 })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(100)
  contact_email?: string;

  @ApiPropertyOptional({ description: '地址' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note?: string;
}
