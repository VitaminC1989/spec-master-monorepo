import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 规格明细响应 DTO
 */
export class SpecDetailResponseDto {
  @ApiProperty({ description: '规格明细ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'BOM配料ID', example: 1 })
  bomItemId: number;

  @ApiPropertyOptional({ description: '尺码', example: 'M' })
  size?: string;

  @ApiProperty({ description: '规格值', example: '5.5' })
  specValue: string;

  @ApiProperty({ description: '规格单位', example: 'cm' })
  specUnit: string;

  @ApiProperty({ description: '排序顺序', example: 0 })
  sortOrder: number;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;
}

/**
 * 规格明细列表响应 DTO
 */
export class SpecDetailListResponseDto {
  @ApiProperty({ type: [SpecDetailResponseDto] })
  data: SpecDetailResponseDto[];

  @ApiProperty({ description: '总记录数' })
  total: number;
}
