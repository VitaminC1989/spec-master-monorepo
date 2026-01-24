import { ApiProperty } from '@nestjs/swagger';

export class PresignUploadResponse {
  @ApiProperty({
    description: 'HTTP 方法',
    example: 'PUT',
  })
  method: string;

  @ApiProperty({
    description: '预签名上传 URL',
    example: 'https://objectstorageapi.hzh.sealos.run/bucket/key?signature=...',
  })
  url: string;

  @ApiProperty({
    description: '对象存储 key',
    example: 'samples/20260124/1737705600000_abc123.jpg',
  })
  key: string;

  @ApiProperty({
    description: '公开访问 URL',
    example: 'https://objectstorageapi.hzh.sealos.run/bucket/samples/20260124/1737705600000_abc123.jpg',
  })
  publicUrl: string;

  @ApiProperty({
    description: '上传时必须携带的 HTTP headers',
    example: { 'Content-Type': 'image/jpeg' },
  })
  headers: Record<string, string>;

  @ApiProperty({
    description: '预签名 URL 有效期（秒）',
    example: 900,
  })
  expiresIn: number;
}
