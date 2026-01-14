import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CloneVariantDto {
  @ApiProperty({ description: '新颜色名称' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  new_color_name: string;

  @ApiPropertyOptional({ description: '是否复制样衣图片', default: true })
  @IsOptional()
  @IsBoolean()
  copy_sample_image?: boolean;
}

export class CloneVariantResponseDto {
  @ApiProperty({ description: '新颜色版本ID' })
  id: number;

  @ApiProperty({ description: '新颜色名称' })
  color_name: string;

  @ApiProperty({ description: '复制的配料数量' })
  cloned_bom_count: number;

  @ApiProperty({ description: '复制的规格数量' })
  cloned_spec_count: number;
}
