import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 响应转换拦截器
 * 确保所有响应都符合 Refine DataProvider 格式
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        // 如果响应已经有 data 字段（列表响应或标准响应），直接返回
        if (response && ('data' in response || 'total' in response)) {
          return response;
        }
        // 否则包装成 { data: response }
        return { data: response };
      }),
    );
  }
}
