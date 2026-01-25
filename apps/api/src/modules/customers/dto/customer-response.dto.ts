import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 客户响应 DTO
 */
export class CustomerResponseDto {
  @ApiProperty({ description: '客户ID', example: 1 })
  id: number;

  @ApiProperty({ description: '客户名称', example: '优衣库' })
  customerName: string;

  @ApiPropertyOptional({ description: '联系人', example: '张三' })
  contactPerson?: string;

  @ApiPropertyOptional({ description: '联系电话', example: '13800138000' })
  contactPhone?: string;

  @ApiPropertyOptional({ description: '联系邮箱', example: 'zhangsan@example.com' })
  contactEmail?: string;

  @ApiPropertyOptional({ description: '地址' })
  address?: string;

  @ApiPropertyOptional({ description: '备注' })
  note?: string;

  @ApiProperty({ description: '是否启用', example: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;

  @ApiPropertyOptional({ description: '创建人ID' })
  createdBy?: number;

  @ApiPropertyOptional({ description: '修改人ID' })
  updatedBy?: number;

  @ApiPropertyOptional({ description: '删除时间' })
  deletedAt?: string;
}

/**
 * 客户列表响应 DTO
 */
export class CustomerListResponseDto {
  @ApiProperty({ type: [CustomerResponseDto] })
  data: CustomerResponseDto[];

  @ApiProperty({ description: '总记录数' })
  total: number;
}
