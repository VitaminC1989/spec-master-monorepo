import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 本地认证守卫
 * 用于登录接口验证用户名密码
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
