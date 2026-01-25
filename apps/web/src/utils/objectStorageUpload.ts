/**
 * Sealos 对象存储上传工具
 * 支持前端直传，自动处理文件名、进度、错误
 *
 * 使用方式：
 * import { uploadToObjectStorage } from '@/utils/objectStorageUpload';
 *
 * const url = await uploadToObjectStorage({
 *   file,
 *   prefix: 'samples',
 *   onProgress: (percent) => console.log(percent)
 * });
 */

/**
 * 对象存储配置
 */
interface ObjectStorageConfig {
  presignEndpoint: string; // 预签名接口端点
  maxSizeBytes: number; // 最大文件大小
}

const OBJECT_STORAGE_CONFIG: ObjectStorageConfig = {
  presignEndpoint:
    import.meta.env.VITE_OBJECT_STORAGE_PRESIGN_ENDPOINT ||
    "/api/storage/presign",
  maxSizeBytes: import.meta.env.VITE_OBJECT_STORAGE_MAX_SIZE_BYTES || 10485760, // 10MB
};

/**
 * 上传选项
 */
export interface ObjectStorageUploadOptions {
  file: File; // 要上传的文件
  prefix?: string; // 文件路径前缀（如 'samples', 'colors'）
  onProgress?: (percent: number) => void; // 上传进度回调 0-100
  onSuccess?: (url: string) => void; // 上传成功回调
  onError?: (error: Error) => void; // 上传失败回调
}

/**
 * 预签名响应接口
 */
interface PresignResponse {
  method: string;
  url: string;
  key: string;
  publicUrl: string;
  headers: Record<string, string>;
  expiresIn: number;
}

/**
 * 上传文件到对象存储
 * @returns 返回文件的完整 URL
 */
export async function uploadToObjectStorage(
  options: ObjectStorageUploadOptions,
): Promise<string> {
  const { file, prefix = "uploads", onProgress, onSuccess, onError } = options;

  try {
    // 1. 文件大小校验
    if (file.size > OBJECT_STORAGE_CONFIG.maxSizeBytes) {
      throw new Error(
        `文件大小不能超过 ${OBJECT_STORAGE_CONFIG.maxSizeBytes / 1024 / 1024}MB`,
      );
    }

    // 2. 获取预签名 URL
    const presignData = await getPresignedUrl(file, prefix);

    // 3. 使用预签名 URL 上传文件
    const publicUrl = await uploadWithPresignedUrl(
      file,
      presignData,
      onProgress,
    );

    onSuccess?.(publicUrl);
    return publicUrl;
  } catch (error) {
    const err = error as Error;
    console.error("对象存储上传失败:", err);
    onError?.(err);
    throw err;
  }
}

/**
 * 获取预签名 URL
 */
async function getPresignedUrl(
  file: File,
  prefix: string,
): Promise<PresignResponse> {
  const response = await fetch(OBJECT_STORAGE_CONFIG.presignEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      size: file.size,
      prefix,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `获取预签名 URL 失败: ${response.status}`,
    );
  }

  // 后端返回格式为 { data: PresignResponse }，需要解包
  const result = await response.json();
  return result.data || result; // 兼容两种格式
}

/**
 * 使用预签名 URL 上传文件
 */
async function uploadWithPresignedUrl(
  file: File,
  presignData: PresignResponse,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 监听上传进度
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress?.(percent);
      }
    });

    // 监听上传完成
    xhr.addEventListener("load", () => {
      if (xhr.status === 200 || xhr.status === 204) {
        console.log("对象存储上传成功:", presignData.publicUrl);
        resolve(presignData.publicUrl);
      } else {
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
      }
    });

    // 监听上传错误
    xhr.addEventListener("error", () => {
      reject(new Error("上传失败: 网络错误"));
    });

    // 发起 PUT 请求
    xhr.open("PUT", presignData.url);

    // 设置必需的 headers
    Object.entries(presignData.headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(file);
  });
}

/**
 * 批量上传文件
 * @returns 返回所有文件的 URL 数组
 */
export async function uploadMultipleToObjectStorage(
  files: File[],
  options: Omit<ObjectStorageUploadOptions, "file">,
): Promise<string[]> {
  const uploadPromises = files.map((file) =>
    uploadToObjectStorage({ ...options, file }),
  );

  return Promise.all(uploadPromises);
}

/**
 * 带降级的上传（开发阶段使用）
 * 如果对象存储上传失败，自动降级为 base64
 */
export async function uploadWithFallback(
  file: File,
  options: ObjectStorageUploadOptions,
): Promise<string> {
  try {
    // 优先使用对象存储上传
    return await uploadToObjectStorage(options);
  } catch (error) {
    console.warn("对象存储上传失败，降级为 base64 模式:", error);

    // 降级为 base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        options.onSuccess?.(result);
        resolve(result);
      };
      reader.onerror = () => {
        const err = new Error("文件读取失败");
        options.onError?.(err);
        reject(err);
      };
    });
  }
}
