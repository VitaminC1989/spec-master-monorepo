import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 款号响应 DTO
 * 用于 API 响应的类型定义，确保前端类型安全
 */
export class StyleResponseDto {
  @ApiProperty({ description: '款号ID', example: 1 })
  id: number;

  @ApiProperty({ description: '款号（唯一标识）', example: 'ST2024001' })
  styleNo: string;

  @ApiPropertyOptional({ description: '款式名称', example: '春季连衣裙' })
  styleName?: string;

  @ApiPropertyOptional({ description: '客户ID', example: 1 })
  customerId?: number;

  @ApiPropertyOptional({ description: '客户名称', example: '优衣库' })
  customerName?: string;

  @ApiPropertyOptional({ description: '公共备注', example: '所有颜色共用的备注信息' })
  publicNote?: string;

  @ApiProperty({ description: '创建时间', example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ description: '更新时间', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;

  @ApiPropertyOptional({ description: '创建人ID', example: 1 })
  createdBy?: number;

  @ApiPropertyOptional({ description: '修改人ID', example: 1 })
  updatedBy?: number;

  @ApiPropertyOptional({ description: '删除时间', example: null })
  deletedAt?: string;
}

/**
 * 款号列表响应 DTO
 * 用于分页列表接口的响应
 */
export class StyleListResponseDto {
  @ApiProperty({ type: [StyleResponseDto], description: '款号列表' })
  data: StyleResponseDto[];

  @ApiProperty({ description: '总记录数', example: 100 })
  total: number;
}
