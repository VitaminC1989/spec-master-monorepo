import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器
 * 用于标记接口所需的角色
 * @example @Roles('admin', 'super_admin')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
