/**
 * Refine DataProvider 筛选器接口
 */
export interface RefineFilter {
  field: string;
  operator: 'eq' | 'ne' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
  value: any;
}

/**
 * 将 Refine filters 转换为 Prisma where 条件
 */
export function buildPrismaWhere(filters: RefineFilter[]): Record<string, any> {
  const where: Record<string, any> = {};

  if (!filters || !Array.isArray(filters)) {
    return where;
  }

  for (const filter of filters) {
    const { field, operator, value } = filter;

    switch (operator) {
      case 'eq':
        where[field] = value;
        break;
      case 'ne':
        where[field] = { not: value };
        break;
      case 'contains':
        where[field] = { contains: value, mode: 'insensitive' };
        break;
      case 'gt':
        where[field] = { gt: value };
        break;
      case 'gte':
        where[field] = { gte: value };
        break;
      case 'lt':
        where[field] = { lt: value };
        break;
      case 'lte':
        where[field] = { lte: value };
        break;
      case 'in':
        where[field] = { in: Array.isArray(value) ? value : [value] };
        break;
    }
  }

  return where;
}

/**
 * 构建 Prisma 分页参数
 */
export function buildPrismaPagination(current: number, pageSize: number) {
  return {
    skip: (current - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * 将字段名从 snake_case 转换为 camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 将字段名从 camelCase 转换为 snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * 转换 filters 中的字段名从 snake_case 到 camelCase
 */
export function transformFiltersFieldNames(
  filters: RefineFilter[],
): RefineFilter[] {
  if (!filters || !Array.isArray(filters)) {
    return [];
  }

  return filters.map((filter) => ({
    ...filter,
    field: snakeToCamel(filter.field),
  }));
}
