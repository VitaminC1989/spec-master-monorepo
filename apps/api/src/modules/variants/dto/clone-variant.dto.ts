import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CloneVariantDto {
  @ApiProperty({ description: '新颜色名称' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  newColorName: string;

  @ApiPropertyOptional({ description: '是否复制样衣图片', default: true })
  @IsOptional()
  @IsBoolean()
  copySampleImage?: boolean;
}

export class CloneVariantResponseDto {
  @ApiProperty({ description: '新颜色版本ID' })
  id: number;

  @ApiProperty({ description: '新颜色名称' })
  colorName: string;

  @ApiProperty({ description: '复制的配料数量' })
  clonedBomCount: number;

  @ApiProperty({ description: '复制的规格数量' })
  clonedSpecCount: number;
}
