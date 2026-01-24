import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { PresignUploadResponse } from './dto/presign-upload.response';

@ApiTags('对象存储')
@Controller('api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取预签名上传 URL',
    description: '生成 S3 预签名 URL，用于前端直传文件到对象存储',
  })
  @ApiResponse({
    status: 200,
    description: '成功生成预签名 URL',
    type: PresignUploadResponse,
  })
  @ApiResponse({
    status: 400,
    description: '请求参数错误（文件类型不支持、文件过大等）',
  })
  async presignUpload(
    @Body() dto: PresignUploadDto,
  ): Promise<PresignUploadResponse> {
    return this.storageService.generatePresignedUrl(dto);
  }
}
