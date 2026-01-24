import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Matches, Max, Min } from 'class-validator';

export class PresignUploadDto {
  @ApiProperty({
    description: '文件名',
    example: 'sample.jpg',
  })
  @IsString()
  filename: string;

  @ApiProperty({
    description: '文件 MIME 类型',
    example: 'image/jpeg',
  })
  @IsString()
  contentType: string;

  @ApiProperty({
    description: '文件大小（字节）',
    example: 1024000,
    maximum: 10485760, // 10MB
  })
  @IsNumber()
  @Max(10485760, { message: '文件大小不能超过 10MB' })
  @Min(1, { message: '文件大小必须大于 0' })
  size: number;

  @ApiProperty({
    description: '文件路径前缀（如 samples, materials, colors）',
    example: 'samples',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9/_-]{1,50}$/, {
    message: '前缀只能包含字母、数字、斜杠、下划线和连字符，长度 1-50',
  })
  prefix?: string;
}
