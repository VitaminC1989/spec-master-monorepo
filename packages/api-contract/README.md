# @spec/api-contract

OpenAPI 规范存储和验证包。

## 用途

- 存储从后端生成的 OpenAPI 规范
- 验证 OpenAPI 规范的有效性
- 检测 API 契约的破坏性变更

## 文件结构

```
packages/api-contract/
├── openapi.json          # 生成的 OpenAPI 规范（由后端生成）
├── scripts/
│   ├── validate.ts       # 验证 OpenAPI 规范
│   └── diff.ts           # 检测破坏性变更
└── package.json
```

## 使用方法

### 验证 OpenAPI 规范

```bash
pnpm run validate
```

### 检测破坏性变更

```bash
pnpm run diff
```

## 工作流

1. 后端修改 API 后运行 `pnpm generate:openapi`
2. 生成的规范会输出到 `packages/api-contract/openapi.json`
3. CI 会自动运行 `validate` 和 `diff` 检查
4. 如果检测到破坏性变更，CI 会失败并提示

## 注意事项

- `openapi.json` 应该提交到 Git，作为 API 契约的版本记录
- 破坏性变更需要显式批准才能合并
- 前端类型生成依赖此文件
