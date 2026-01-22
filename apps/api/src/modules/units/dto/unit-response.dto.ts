import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 单位响应 DTO
 */
export class UnitResponseDto {
  @ApiProperty({ description: '单位ID', example: 1 })
  id: number;

  @ApiProperty({ description: '单位代码', example: 'm' })
  unitCode: string;

  @ApiProperty({ description: '单位名称', example: '米' })
  unitName: string;

  @ApiPropertyOptional({ description: '单位类型', example: '长度' })
  unitType?: string;

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
 * 单位列表响应 DTO
 */
export class UnitListResponseDto {
  @ApiProperty({ type: [UnitResponseDto] })
  data: UnitResponseDto[];

  @ApiProperty({ description: '总记录数' })
  total: number;
}
