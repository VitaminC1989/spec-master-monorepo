import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignUploadResponse } from './dto/presign-upload.response';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly expiresIn: number;

  constructor(private configService: ConfigService) {
    // 获取必需的环境变量
    const endpoint = this.configService.get<string>('OSS_ENDPOINT');
    const accessKey = this.configService.get<string>('OSS_ACCESS_KEY');
    const secretKey = this.configService.get<string>('OSS_SECRET_KEY');
    const bucket = this.configService.get<string>('OSS_BUCKET');

    // 验证必需的环境变量
    if (!endpoint || !accessKey || !secretKey || !bucket) {
      throw new Error('缺少必需的对象存储环境变量配置');
    }

    // 初始化 S3 客户端
    this.s3Client = new S3Client({
      endpoint,
      region: this.configService.get<string>('OSS_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true, // 关键：Sealos 要求路径风格 URL
    });

    this.bucket = bucket;
    this.expiresIn = this.configService.get<number>('OSS_PRESIGN_EXPIRES_IN') || 900;

    // 公开访问 URL 基础路径
    this.publicBaseUrl = this.configService.get<string>('OSS_PUBLIC_BASE_URL') ||
      `${endpoint}/${bucket}`;
  }

  /**
   * 生成预签名上传 URL
   */
  async generatePresignedUrl(dto: PresignUploadDto): Promise<PresignUploadResponse> {
    // 验证文件类型（仅允许图片）
    if (!dto.contentType.startsWith('image/')) {
      throw new BadRequestException('仅支持图片文件上传');
    }

    // 生成唯一的对象 key
    const key = this.generateUniqueKey(dto.filename, dto.prefix || 'uploads');

    // 创建 PutObject 命令
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.contentType,
    });

    // 生成预签名 URL
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.expiresIn,
    });

    // 构造公开访问 URL
    const publicUrl = `${this.publicBaseUrl}/${key}`;

    return {
      method: 'PUT',
      url,
      key,
      publicUrl,
      headers: {
        'Content-Type': dto.contentType,
      },
      expiresIn: this.expiresIn,
    };
  }

  /**
   * 生成唯一的对象 key
   * 格式: {prefix}/{YYYYMMDD}/{timestamp}_{random}.{ext}
   */
  private generateUniqueKey(filename: string, prefix: string): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, ''); // 20260124
    const timestamp = now.getTime();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';

    return `${prefix}/${date}/${timestamp}_${random}.${ext}`;
  }
}
