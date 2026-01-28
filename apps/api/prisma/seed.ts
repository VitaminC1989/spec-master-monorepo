/**
 * Prisma Seed 脚本
 * 用于初始化系统基础数据：角色、权限、管理员账号
 *
 * 运行方式：
 * npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 开始初始化数据...\n');

  // 1. 创建角色
  console.log('📋 创建系统角色...');
  const roles = await createRoles();
  console.log('✅ 角色创建完成\n');

  // 2. 创建权限
  console.log('🔐 创建系统权限...');
  const permissions = await createPermissions();
  console.log('✅ 权限创建完成\n');

  // 3. 分配角色权限
  console.log('🔗 分配角色权限...');
  await assignRolePermissions(roles, permissions);
  console.log('✅ 角色权限分配完成\n');

  // 4. 创建超级管理员账号
  console.log('👤 创建超级管理员账号...');
  await createSuperAdmin(roles);
  console.log('✅ 超级管理员创建完成\n');

  console.log('🎉 数据初始化完成！');
  console.log('\n默认管理员账号：');
  console.log('  用户名: admin');
  console.log('  密码: admin123');
  console.log('  ⚠️  请在生产环境中立即修改默认密码！\n');
}

// 创建角色
async function createRoles() {
  const rolesData = [
    {
      roleCode: 'super_admin',
      roleName: '超级管理员',
      description: '系统最高权限，可管理所有功能',
      isSystem: true,
    },
    {
      roleCode: 'admin',
      roleName: '管理员',
      description: '可管理业务数据和普通用户',
      isSystem: true,
    },
    {
      roleCode: 'user',
      roleName: '普通用户',
      description: '可操作业务数据',
      isSystem: true,
    },
    {
      roleCode: 'viewer',
      roleName: '只读用户',
      description: '只能查看数据，不能修改',
      isSystem: true,
    },
  ];

  const roles = {};
  for (const roleData of rolesData) {
    const role = await prisma.role.upsert({
      where: { roleCode: roleData.roleCode },
      update: {},
      create: roleData,
    });
    roles[roleData.roleCode] = role;
    console.log(`  - ${role.roleName} (${role.roleCode})`);
  }

  return roles;
}

// 创建权限
async function createPermissions() {
  const permissionsData = [
    // 款号管理权限
    { code: 'style:create', name: '创建款号', resource: 'style', action: 'create' },
    { code: 'style:read', name: '查看款号', resource: 'style', action: 'read' },
    { code: 'style:update', name: '修改款号', resource: 'style', action: 'update' },
    { code: 'style:delete', name: '删除款号', resource: 'style', action: 'delete' },

    // 客户管理权限
    { code: 'customer:create', name: '创建客户', resource: 'customer', action: 'create' },
    { code: 'customer:read', name: '查看客户', resource: 'customer', action: 'read' },
    { code: 'customer:update', name: '修改客户', resource: 'customer', action: 'update' },
    { code: 'customer:delete', name: '删除客户', resource: 'customer', action: 'delete' },

    // 用户管理权限
    { code: 'user:create', name: '创建用户', resource: 'user', action: 'create' },
    { code: 'user:read', name: '查看用户', resource: 'user', action: 'read' },
    { code: 'user:update', name: '修改用户', resource: 'user', action: 'update' },
    { code: 'user:delete', name: '删除用户', resource: 'user', action: 'delete' },

    // 角色权限管理
    { code: 'role:manage', name: '管理角色权限', resource: 'role', action: 'manage' },
  ];

  const permissions = {};
  for (const permData of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { permissionCode: permData.code },
      update: {},
      create: {
        permissionCode: permData.code,
        permissionName: permData.name,
        resource: permData.resource,
        action: permData.action,
      },
    });
    permissions[permData.code] = permission;
  }

  console.log(`  - 共创建 ${permissionsData.length} 个权限`);
  return permissions;
}

// 分配角色权限
async function assignRolePermissions(roles: any, permissions: any) {
  // 超级管理员：所有权限
  const superAdminPerms = Object.values(permissions) as any[];
  for (const perm of superAdminPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.super_admin.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roles.super_admin.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`  - 超级管理员: ${superAdminPerms.length} 个权限`);

  // 管理员：业务数据 + 用户管理
  const adminPermCodes = [
    'style:create', 'style:read', 'style:update', 'style:delete',
    'customer:create', 'customer:read', 'customer:update', 'customer:delete',
    'user:create', 'user:read', 'user:update', 'user:delete',
  ];
  for (const code of adminPermCodes) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.admin.id,
          permissionId: permissions[code].id,
        },
      },
      update: {},
      create: {
        roleId: roles.admin.id,
        permissionId: permissions[code].id,
      },
    });
  }
  console.log(`  - 管理员: ${adminPermCodes.length} 个权限`);

  // 普通用户：业务数据 CRUD
  const userPermCodes = [
    'style:create', 'style:read', 'style:update', 'style:delete',
    'customer:read',
  ];
  for (const code of userPermCodes) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.user.id,
          permissionId: permissions[code].id,
        },
      },
      update: {},
      create: {
        roleId: roles.user.id,
        permissionId: permissions[code].id,
      },
    });
  }
  console.log(`  - 普通用户: ${userPermCodes.length} 个权限`);

  // 只读用户：只能查看
  const viewerPermCodes = ['style:read', 'customer:read'];
  for (const code of viewerPermCodes) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.viewer.id,
          permissionId: permissions[code].id,
        },
      },
      update: {},
      create: {
        roleId: roles.viewer.id,
        permissionId: permissions[code].id,
      },
    });
  }
  console.log(`  - 只读用户: ${viewerPermCodes.length} 个权限`);
}

// 创建超级管理员账号
async function createSuperAdmin(roles) {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      realName: '系统管理员',
      email: 'admin@specmaster.com',
      isActive: true,
    },
  });

  // 分配超级管理员角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: roles.super_admin.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: roles.super_admin.id,
    },
  });

  console.log(`  - 用户名: ${admin.username}`);
  console.log(`  - 真实姓名: ${admin.realName}`);
}

main()
  .catch((e) => {
    console.error('❌ 初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
