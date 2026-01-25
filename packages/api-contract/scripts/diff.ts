/**
 * OpenAPI 规范破坏性变更检测脚本
 * 用于 CI/CD 流水线中检测 API 契约的破坏性变更
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface BreakingChange {
  path: string;
  message: string;
  type: 'breaking' | 'non-breaking';
}

/**
 * 简单的破坏性变更检测
 * 生产环境建议使用 openapi-diff 库
 */
async function detectBreakingChanges() {
  const oldSpecPath = join(__dirname, '../openapi.json');
  const newSpecPath = join(__dirname, '../../apps/api/dist/openapi.json');

  // 检查文件是否存在
  if (!existsSync(oldSpecPath)) {
    console.log('⚠️  旧的 OpenAPI 规范不存在，跳过破坏性变更检测');
    console.log('这是首次生成 OpenAPI 规范');
    return;
  }

  if (!existsSync(newSpecPath)) {
    console.error('❌ 新的 OpenAPI 规范不存在');
    console.error(`期望路径: ${newSpecPath}`);
    console.error('请先运行 "cd apps/api && pnpm build && pnpm generate:openapi"');
    process.exit(1);
  }

  try {
    const oldSpec = JSON.parse(readFileSync(oldSpecPath, 'utf-8'));
    const newSpec = JSON.parse(readFileSync(newSpecPath, 'utf-8'));

    const breakingChanges: BreakingChange[] = [];

    // 检测端点删除
    const oldPaths = Object.keys(oldSpec.paths || {});
    const newPaths = Object.keys(newSpec.paths || {});

    for (const path of oldPaths) {
      if (!newPaths.includes(path)) {
        breakingChanges.push({
          path,
          message: `端点已删除: ${path}`,
          type: 'breaking',
        });
      }
    }

    // 检测方法删除
    for (const path of oldPaths) {
      if (newPaths.includes(path)) {
        const oldMethods = Object.keys(oldSpec.paths[path] || {});
        const newMethods = Object.keys(newSpec.paths[path] || {});

        for (const method of oldMethods) {
          if (!newMethods.includes(method)) {
            breakingChanges.push({
              path: `${path}.${method}`,
              message: `HTTP 方法已删除: ${method.toUpperCase()} ${path}`,
              type: 'breaking',
            });
          }
        }
      }
    }

    // 输出结果
    if (breakingChanges.length > 0) {
      console.error('❌ 检测到破坏性变更:');
      console.error('');
      breakingChanges.forEach((change, index) => {
        console.error(`${index + 1}. ${change.message}`);
        console.error(`   路径: ${change.path}`);
        console.error('');
      });
      console.error('⚠️  如果这些变更是有意为之，请确保:');
      console.error('   1. 前端代码已同步更新');
      console.error('   2. 已通知所有相关团队成员');
      console.error('   3. 已更新 API 文档');
      console.error('');
      process.exit(1);
    } else {
      console.log('✅ 未检测到破坏性变更');
      console.log('');
      console.log('📊 变更摘要:');
      console.log(`   旧端点数: ${oldPaths.length}`);
      console.log(`   新端点数: ${newPaths.length}`);
      console.log(`   新增端点: ${newPaths.filter(p => !oldPaths.includes(p)).length}`);
    }
  } catch (error) {
    console.error('❌ 检测破坏性变更时出错:', error);
    process.exit(1);
  }
}

detectBreakingChanges();
