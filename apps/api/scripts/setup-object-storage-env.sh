#!/bin/bash

# Sealos 对象存储环境配置脚本
# 用于生成 .env.local 文件，避免密钥进入仓库

set -e

echo "=========================================="
echo "  Sealos 对象存储环境配置"
echo "=========================================="
echo ""

# 检查是否已存在 .env.local
if [ -f ".env.local" ]; then
  echo "⚠️  检测到已存在 .env.local 文件"
  read -p "是否覆盖？(y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消配置"
    exit 0
  fi
fi

echo "请输入 Sealos 对象存储配置信息："
echo ""

# 读取配置信息
read -p "OSS Endpoint [https://objectstorageapi.hzh.sealos.run]: " OSS_ENDPOINT
OSS_ENDPOINT=${OSS_ENDPOINT:-https://objectstorageapi.hzh.sealos.run}

read -p "OSS Region [us-east-1]: " OSS_REGION
OSS_REGION=${OSS_REGION:-us-east-1}

read -p "OSS Bucket [wit020qo-spec-master]: " OSS_BUCKET
OSS_BUCKET=${OSS_BUCKET:-wit020qo-spec-master}

read -p "OSS Access Key: " OSS_ACCESS_KEY
if [ -z "$OSS_ACCESS_KEY" ]; then
  echo "❌ Access Key 不能为空"
  exit 1
fi

read -s -p "OSS Secret Key: " OSS_SECRET_KEY
echo
if [ -z "$OSS_SECRET_KEY" ]; then
  echo "❌ Secret Key 不能为空"
  exit 1
fi

read -p "OSS Public Base URL [$OSS_ENDPOINT/$OSS_BUCKET]: " OSS_PUBLIC_BASE_URL
OSS_PUBLIC_BASE_URL=${OSS_PUBLIC_BASE_URL:-$OSS_ENDPOINT/$OSS_BUCKET}

read -p "预签名 URL 有效期（秒）[900]: " OSS_PRESIGN_EXPIRES_IN
OSS_PRESIGN_EXPIRES_IN=${OSS_PRESIGN_EXPIRES_IN:-900}

read -p "CORS Origins [http://localhost:5173]: " CORS_ORIGINS
CORS_ORIGINS=${CORS_ORIGINS:-http://localhost:5173}

echo ""
echo "=========================================="
echo "  配置信息确认"
echo "=========================================="
echo "OSS Endpoint: $OSS_ENDPOINT"
echo "OSS Region: $OSS_REGION"
echo "OSS Bucket: $OSS_BUCKET"
echo "OSS Access Key: $OSS_ACCESS_KEY"
echo "OSS Secret Key: ********"
echo "OSS Public Base URL: $OSS_PUBLIC_BASE_URL"
echo "预签名有效期: $OSS_PRESIGN_EXPIRES_IN 秒"
echo "CORS Origins: $CORS_ORIGINS"
echo "=========================================="
echo ""

read -p "确认以上配置并生成 .env.local？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 已取消配置"
  exit 0
fi

# 生成 .env.local 文件
cat > .env.local << EOF
# Sealos 对象存储配置
# 此文件由 scripts/setup-object-storage-env.sh 生成
# 请勿提交到 Git 仓库

OSS_ENDPOINT=$OSS_ENDPOINT
OSS_REGION=$OSS_REGION
OSS_BUCKET=$OSS_BUCKET
OSS_ACCESS_KEY=$OSS_ACCESS_KEY
OSS_SECRET_KEY=$OSS_SECRET_KEY
OSS_PUBLIC_BASE_URL=$OSS_PUBLIC_BASE_URL
OSS_PRESIGN_EXPIRES_IN=$OSS_PRESIGN_EXPIRES_IN

# CORS 配置
CORS_ORIGINS=$CORS_ORIGINS
EOF

echo ""
echo "✅ 配置文件已生成：.env.local"
echo ""
echo "⚠️  重要提示："
echo "1. .env.local 文件包含敏感信息，请勿提交到 Git 仓库"
echo "2. 该文件已被 .gitignore 忽略"
echo "3. 生产环境请通过部署平台的环境变量配置"
echo ""
echo "🚀 现在可以启动后端服务："
echo "   pnpm -F @spec/api dev"
echo ""

