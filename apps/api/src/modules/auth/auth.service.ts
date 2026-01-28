import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma.service';

/**
 * 认证服务
 * 处理登录、Token 生成和刷新等核心认证逻辑
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 验证用户名和密码
   */
  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
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

    if (!user || user.deletedAt) {
      return null;
    }

    // 检查账号是否被锁定
    if (user.isLocked && user.lockedUntil) {
      if (new Date() < user.lockedUntil) {
        throw new UnauthorizedException('账号已被锁定，请稍后再试');
      }
      // 锁定时间已过，解锁账号
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isLocked: false, loginFailCount: 0, lockedUntil: null },
      });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await this.handleLoginFailure(user.id, user.loginFailCount);
      return null;
    }

    // 登录成功，重置失败次数
    await this.prisma.user.update({
      where: { id: user.id },
      data: { loginFailCount: 0 },
    });

    return user;
  }

  /**
   * 处理登录失败
   */
  private async handleLoginFailure(userId: number, currentFailCount: number) {
    const maxAttempts = 5;
    const lockDurationMinutes = 30;
    const newFailCount = currentFailCount + 1;

    if (newFailCount >= maxAttempts) {
      // 锁定账号
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          loginFailCount: newFailCount,
          isLocked: true,
          lockedUntil: new Date(Date.now() + lockDurationMinutes * 60 * 1000),
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: userId },
        data: { loginFailCount: newFailCount },
      });
    }
  }

  /**
   * 用户登录，生成 Token
   */
  async login(user: any, ip?: string) {
    const payload = { sub: user.id, username: user.username };

    // 生成 Access Token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
    });

    // 生成 Refresh Token
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d'),
    });

    // 计算 Refresh Token 过期时间
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    // 保存 Refresh Token 到数据库
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshTokenExpiry,
      },
    });

    // 更新用户最后登录信息
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ip || null,
      },
    });

    // 提取角色和权限
    const roles = user.userRoles.map((ur: any) => ur.role.roleCode);
    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur: any) =>
          ur.role.rolePermissions.map((rp: any) => rp.permission.permissionCode),
        ),
      ),
    ];

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        email: user.email,
        avatar: user.avatar,
        roles,
        permissions,
      },
    };
  }

  /**
   * 刷新 Token
   */
  async refreshToken(refreshToken: string) {
    // 验证 Refresh Token
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('无效的 Refresh Token');
    }

    if (tokenRecord.isRevoked) {
      throw new UnauthorizedException('Refresh Token 已被撤销');
    }

    if (new Date() > tokenRecord.expiresAt) {
      throw new UnauthorizedException('Refresh Token 已过期');
    }

    // 生成新的 Access Token
    const payload = {
      sub: tokenRecord.user.id,
      username: tokenRecord.user.username,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN', '15m'),
    });

    return { accessToken };
  }

  /**
   * 登出，撤销 Refresh Token
   */
  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { isRevoked: true },
    });
    return { message: '登出成功' };
  }

  /**
   * 获取用户信息
   */
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

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
      phone: user.phone,
      avatar: user.avatar,
      roles,
      permissions,
      lastLoginAt: user.lastLoginAt,
    };
  }
}
