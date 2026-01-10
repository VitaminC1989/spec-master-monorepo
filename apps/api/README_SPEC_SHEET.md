# SpecSheet API 使用文档

## 概述

规格单（SpecSheet）模块提供了完整的 CRUD 功能，用于管理服装规格单数据。

## API 端点

### 1. 创建规格单

```http
POST /spec-sheets
Content-Type: application/json

{
  "title": "2026春季新款卫衣",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "content": {
    "sizes": {
      "S": { "chest": 96, "length": 68, "shoulder": 44 },
      "M": { "chest": 100, "length": 70, "shoulder": 46 },
      "L": { "chest": 104, "length": 72, "shoulder": 48 }
    },
    "fabric": {
      "main": "100% 纯棉",
      "weight": "280g/m²"
    },
    "colors": ["黑色", "白色", "灰色"]
  },
  "status": "DRAFT"
}
```

### 2. 获取所有规格单

```http
GET /spec-sheets
```

可选查询参数：

- `status`: 按状态筛选（DRAFT 或 PUBLISHED）

```http
GET /spec-sheets?status=DRAFT
```

### 3. 根据用户ID获取规格单

```http
GET /spec-sheets/user/:userId
```

示例：

```http
GET /spec-sheets/user/550e8400-e29b-41d4-a716-446655440000
```

### 4. 获取单个规格单详情

```http
GET /spec-sheets/:id
```

示例：

```http
GET /spec-sheets/1
```

### 5. 更新规格单

```http
PATCH /spec-sheets/:id
Content-Type: application/json

{
  "title": "2026春季新款卫衣（已修改）",
  "status": "PUBLISHED"
}
```

### 6. 删除规格单

```http
DELETE /spec-sheets/:id
```

## 测试步骤

### 前置条件

1. 确保数据库已启动
2. 确保 NestJS 应用已运行：`pnpm start:dev`
3. 访问 Swagger 文档：http://localhost:3000/docs

### 使用 curl 测试

#### 1. 先创建一个用户（因为规格单需要关联用户）

```bash
# 注意：你需要先在数据库中手动创建一个用户，或者创建用户管理接口
# 这里假设已有用户 ID: 550e8400-e29b-41d4-a716-446655440000
```

#### 2. 创建规格单

```bash
curl -X POST http://localhost:3000/spec-sheets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2026春季新款卫衣",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "content": {
      "sizes": {
        "S": { "chest": 96, "length": 68, "shoulder": 44 },
        "M": { "chest": 100, "length": 70, "shoulder": 46 },
        "L": { "chest": 104, "length": 72, "shoulder": 48 }
      },
      "fabric": {
        "main": "100% 纯棉",
        "weight": "280g/m²"
      },
      "colors": ["黑色", "白色", "灰色"]
    }
  }'
```

#### 3. 获取所有规格单

```bash
curl http://localhost:3000/spec-sheets
```

#### 4. 获取单个规格单

```bash
curl http://localhost:3000/spec-sheets/1
```

#### 5. 更新规格单

```bash
curl -X PATCH http://localhost:3000/spec-sheets/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED"
  }'
```

#### 6. 删除规格单

```bash
curl -X DELETE http://localhost:3000/spec-sheets/1
```

## 数据模型

### SpecSheet

```typescript
{
  id: number; // 自增ID
  title: string; // 标题
  content: any; // JSON 格式的内容
  status: string; // 状态：DRAFT 或 PUBLISHED
  userId: string; // 所属用户ID
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  user: User; // 关联的用户对象
}
```

### Content 结构示例

```json
{
  "sizes": {
    "S": { "chest": 96, "length": 68, "shoulder": 44 },
    "M": { "chest": 100, "length": 70, "shoulder": 46 },
    "L": { "chest": 104, "length": 72, "shoulder": 48 }
  },
  "fabric": {
    "main": "100% 纯棉",
    "weight": "280g/m²",
    "composition": "棉 100%"
  },
  "colors": ["黑色", "白色", "灰色"],
  "process": {
    "printing": "数码印花",
    "washing": "酵素洗"
  },
  "accessories": {
    "zipper": "YKK拉链",
    "buttons": "金属四合扣"
  }
}
```

## 注意事项

1. **用户必须存在**：创建规格单前，确保 `userId` 对应的用户已存在于数据库中
2. **JSON 灵活性**：`content` 字段是 JSON 类型，可以存储任意结构的数据
3. **状态管理**：默认状态为 `DRAFT`，可以更新为 `PUBLISHED`
4. **关联查询**：所有查询都会自动返回关联的用户信息

## Swagger 文档

访问 http://localhost:3000/docs 可以看到完整的交互式 API 文档，可以直接在浏览器中测试所有接口。
