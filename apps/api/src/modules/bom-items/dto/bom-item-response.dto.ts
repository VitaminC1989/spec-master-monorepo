import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpecDetailResponseDto } from '../../spec-details/dto/spec-detail-response.dto';

/**
 * BOM配料响应 DTO
 */
export class BOMItemResponseDto {
  @ApiProperty({ description: 'BOM配料ID', example: 1 })
  id: number;

  @ApiProperty({ description: '颜色版本ID', example: 1 })
  variantId: number;

  @ApiProperty({ description: '辅料名称', example: '拉链' })
  materialName: string;

  @ApiPropertyOptional({ description: '辅料图片URL' })
  materialImageUrl?: string;

  @ApiPropertyOptional({ description: '辅料颜色文字描述', example: '黑色' })
  materialColorText?: string;

  @ApiPropertyOptional({ description: '辅料颜色图片URL' })
  materialColorImageUrl?: string;

  @ApiProperty({ description: '单耗', example: 0.8 })
  usage: number;

  @ApiProperty({ description: '单位', example: '米' })
  unit: string;

  @ApiPropertyOptional({ description: '供应商', example: 'YKK拉链' })
  supplier?: string;

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

  @ApiPropertyOptional({ description: '规格明细列表', type: [SpecDetailResponseDto] })
  specDetails?: SpecDetailResponseDto[];
}

/**
 * BOM配料列表响应 DTO
 */
export class BOMItemListResponseDto {
  @ApiProperty({ type: [BOMItemResponseDto] })
  data: BOMItemResponseDto[];

  @ApiProperty({ description: '总记录数' })
  total: number;
}
