#!/usr/bin/env node
/**
 * 生成 JWT Secret
 *
 * 使用方法：
 *   node scripts/generate-jwt-secret.js
 *
 * 或在根目录运行：
 *   pnpm --filter @spec/api generate:jwt-secret
 */

const crypto = require('crypto');

// 生成 64 字节（512 位）的随机密钥，转为 hex 字符串
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 JWT Secret 已生成：\n');
console.log(secret);
console.log('\n📋 请将以下内容添加到 .env.local 文件：\n');
console.log(`JWT_SECRET=${secret}`);
console.log('\n⚠️  注意：请妥善保管此密钥，不要提交到版本控制系统！\n');
