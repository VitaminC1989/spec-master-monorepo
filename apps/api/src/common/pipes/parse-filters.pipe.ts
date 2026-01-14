import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { RefineFilter, transformFiltersFieldNames } from '../utils/query-builder.util';

/**
 * 解析 Refine filters JSON 字符串的管道
 */
@Injectable()
export class ParseFiltersPipe implements PipeTransform<string, RefineFilter[]> {
  transform(value: string): RefineFilter[] {
    if (!value) {
      return [];
    }

    try {
      const filters = JSON.parse(value);
      if (!Array.isArray(filters)) {
        throw new BadRequestException('filters 必须是数组');
      }
      // 转换字段名从 snake_case 到 camelCase
      return transformFiltersFieldNames(filters);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('filters 格式不正确，必须是有效的 JSON 数组');
    }
  }
}

/**
 * 解析 Refine pagination JSON 字符串的管道
 */
@Injectable()
export class ParsePaginationPipe
  implements PipeTransform<string, { current: number; pageSize: number }>
{
  transform(value: string): { current: number; pageSize: number } {
    const defaultPagination = { current: 1, pageSize: 10 };

    if (!value) {
      return defaultPagination;
    }

    try {
      const pagination = JSON.parse(value);
      return {
        current: pagination.current ?? defaultPagination.current,
        pageSize: pagination.pageSize ?? defaultPagination.pageSize,
      };
    } catch {
      return defaultPagination;
    }
  }
}
