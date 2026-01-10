import { ApiProperty } from '@nestjs/swagger';

export class CreateSpecSheetDto {
  @ApiProperty({
    description: '规格单标题',
    example: '2026春季新款卫衣',
  })
  title: string;

  @ApiProperty({
    description: '规格单内容（JSON格式），包含尺码表、面料信息等',
    example: {
      sizes: {
        S: { chest: 96, length: 68, shoulder: 44 },
        M: { chest: 100, length: 70, shoulder: 46 },
        L: { chest: 104, length: 72, shoulder: 48 },
      },
      fabric: {
        main: '100% 纯棉',
        weight: '280g/m²',
      },
      colors: ['黑色', '白色', '灰色'],
    },
  })
  content: any; // JSON 类型

  @ApiProperty({
    description: '所属用户ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId: string;

  @ApiProperty({
    description: '状态',
    example: 'DRAFT',
    required: false,
    enum: ['DRAFT', 'PUBLISHED'],
  })
  status?: string;
}
