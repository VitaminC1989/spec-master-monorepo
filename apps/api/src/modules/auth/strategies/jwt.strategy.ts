import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma.service';

/**
 * JWT 验证策略
 * 用于验证请求头中的 Bearer Token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  /**
   * 验证 JWT payload，返回用户信息
   * 此方法会在每次请求时被调用
   */
  async validate(payload: { sub: number; username: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    if (user.isLocked) {
      throw new UnauthorizedException('账号已被锁定，请联系管理员');
    }

    // 提取角色和权限
    const roles = user.userRoles.map((ur) => ur.role.roleCode);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.permissionCode),
        ),
      ),
    ];

    return {
      id: user.id,
      username: user.username,
      realName: user.realName,
      email: user.email,
      roles,
      permissions,
    };
  }
}
