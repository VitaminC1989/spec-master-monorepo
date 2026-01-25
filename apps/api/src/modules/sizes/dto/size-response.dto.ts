import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 尺码响应 DTO
 */
export class SizeResponseDto {
  @ApiProperty({ description: '尺码ID', example: 1 })
  id: number;

  @ApiProperty({ description: '尺码代码', example: 'M' })
  sizeCode: string;

  @ApiProperty({ description: '尺码名称', example: '中号' })
  sizeName: string;

  @ApiProperty({ description: '排序顺序', example: 0 })
  sortOrder: number;

  @ApiPropertyOptional({ description: '备注' })
  note?: string;

  @ApiProperty({ description: '是否启用', example: true })
  isActive: boolean;

  @ApiProperty({ description: '创建时间' })
  createdAt: string;

  @ApiProperty({ description: '更新时间' })
  updatedAt: string;
}

/**
 * 尺码列表响应 DTO
 */
export class SizeListResponseDto {
  @ApiProperty({ type: [SizeResponseDto] })
  data: SizeResponseDto[];

  @ApiProperty({ description: '总记录数' })
  total: number;
}
