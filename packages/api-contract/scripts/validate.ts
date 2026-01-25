/**
 * OpenAPI 规范验证脚本
 * 验证生成的 OpenAPI 规范是否符合标准
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function validateOpenAPI() {
  const specPath = join(__dirname, '../openapi.json');

  if (!existsSync(specPath)) {
    console.error('❌ OpenAPI 规范文件不存在');
    console.error(`期望路径: ${specPath}`);
    process.exit(1);
  }

  try {
    const spec = JSON.parse(readFileSync(specPath, 'utf-8'));

    // 基本验证
    const errors: string[] = [];

    if (!spec.openapi) {
      errors.push('缺少 openapi 版本字段');
    }

    if (!spec.info) {
      errors.push('缺少 info 字段');
    } else {
      if (!spec.info.title) errors.push('缺少 info.title');
      if (!spec.info.version) errors.push('缺少 info.version');
    }

    if (!spec.paths || Object.keys(spec.paths).length === 0) {
      errors.push('缺少 paths 或 paths 为空');
    }

    if (errors.length > 0) {
      console.error('❌ OpenAPI 规范验证失败:');
      errors.forEach((error, index) => {
        console.error(`   ${index + 1}. ${error}`);
      });
      process.exit(1);
    }

    console.log('✅ OpenAPI 规范验证通过');
    console.log('');
    console.log('📊 规范摘要:');
    console.log(`   OpenAPI 版本: ${spec.openapi}`);
    console.log(`   API 标题: ${spec.info.title}`);
    console.log(`   API 版本: ${spec.info.version}`);
    console.log(`   端点数量: ${Object.keys(spec.paths).length}`);
    console.log(`   Schema 数量: ${spec.components?.schemas ? Object.keys(spec.components.schemas).length : 0}`);
  } catch (error) {
    console.error('❌ 验证 OpenAPI 规范时出错:', error);
    process.exit(1);
  }
}

validateOpenAPI();
