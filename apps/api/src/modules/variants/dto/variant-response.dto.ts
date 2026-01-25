import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 颜色版本响应 DTO
 */
export class VariantResponseDto {
  @ApiProperty({ description: '颜色版本ID', example: 1 })
  id: number;

  @ApiProperty({ description: '款号ID', example: 1 })
  styleId: number;

  @ApiProperty({ description: '颜色名称', example: '天蓝色' })
  colorName: string;

  @ApiPropertyOptional({ description: '样衣图片URL' })
  sampleImageUrl?: string;

  @ApiPropertyOptional({ description: '尺码范围', example: 'S/M/L/XL' })
  sizeRange?: string;

  @ApiProperty({ description: '排序顺序', example: 0 })
  sortOrder: number;

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

  @ApiPropertyOptional({ description: '克隆来源ID' })
  clonedFromId?: number;
}

/**
 * 颜色版本列表响应 DTO
 */
export class VariantListResponseDto {
  @ApiProperty({ type: [VariantResponseDto] })
  data: VariantResponseDto[];

  @ApiProperty({ description: '总记录数' })
  total: number;
}
