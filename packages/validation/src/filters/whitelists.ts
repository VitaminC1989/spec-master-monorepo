/**
 * 过滤器字段白名单注册表
 * 
 * 定义每个资源允许的过滤字段，用于：
 * 1. 后端运行时验证（防止未授权查询）
 * 2. 前端类型检查（编译期类型安全）
 * 
 * 安全原则：只允许明确列出的字段，未知字段返回 400 错误
 */

/**
 * 款号（Styles）允许的过滤字段
 */
export const STYLE_FILTER_FIELDS = [
  'styleNo',
  'styleName',
  'customerId',
  'customerName',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 颜色版本（Variants）允许的过滤字段
 */
export const VARIANT_FILTER_FIELDS = [
  'styleId',
  'colorName',
  'sortOrder',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 配料明细（BOM Items）允许的过滤字段
 */
export const BOM_ITEM_FILTER_FIELDS = [
  'variantId',
  'materialName',
  'supplier',
  'unit',
  'usage',
  'sortOrder',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 规格明细（Spec Details）允许的过滤字段
 */
export const SPEC_DETAIL_FILTER_FIELDS = [
  'bomItemId',
  'size',
  'specValue',
  'specUnit',
  'sortOrder',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 客户（Customers）允许的过滤字段
 */
export const CUSTOMER_FILTER_FIELDS = [
  'customerName',
  'contactPerson',
  'contactPhone',
  'contactEmail',
  'isActive',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 尺码（Sizes）允许的过滤字段
 */
export const SIZE_FILTER_FIELDS = [
  'sizeCode',
  'sizeName',
  'sortOrder',
  'isActive',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 单位（Units）允许的过滤字段
 */
export const UNIT_FILTER_FIELDS = [
  'unitCode',
  'unitName',
  'unitType',
  'isActive',
  'createdAt',
  'updatedAt',
] as const;

/**
 * 所有资源的过滤器白名单注册表
 */
export const FILTER_WHITELISTS = {
  styles: STYLE_FILTER_FIELDS,
  variants: VARIANT_FILTER_FIELDS,
  'bom-items': BOM_ITEM_FILTER_FIELDS,
  'spec-details': SPEC_DETAIL_FILTER_FIELDS,
  customers: CUSTOMER_FILTER_FIELDS,
  sizes: SIZE_FILTER_FIELDS,
  units: UNIT_FILTER_FIELDS,
} as const;

/**
 * 资源名称类型
 */
export type ResourceName = keyof typeof FILTER_WHITELISTS;

/**
 * 款号过滤字段类型
 */
export type StyleFilterField = typeof STYLE_FILTER_FIELDS[number];

/**
 * 颜色版本过滤字段类型
 */
export type VariantFilterField = typeof VARIANT_FILTER_FIELDS[number];

/**
 * 配料明细过滤字段类型
 */
export type BOMItemFilterField = typeof BOM_ITEM_FILTER_FIELDS[number];

/**
 * 规格明细过滤字段类型
 */
export type SpecDetailFilterField = typeof SPEC_DETAIL_FILTER_FIELDS[number];

/**
 * 客户过滤字段类型
 */
export type CustomerFilterField = typeof CUSTOMER_FILTER_FIELDS[number];

/**
 * 尺码过滤字段类型
 */
export type SizeFilterField = typeof SIZE_FILTER_FIELDS[number];

/**
 * 单位过滤字段类型
 */
export type UnitFilterField = typeof UNIT_FILTER_FIELDS[number];

/**
 * 获取指定资源的过滤字段白名单
 */
export function getFilterWhitelist(resource: ResourceName): readonly string[] {
  return FILTER_WHITELISTS[resource];
}

/**
 * 验证过滤字段是否在白名单中
 */
export function isFilterFieldAllowed(
  resource: ResourceName,
  field: string,
): boolean {
  const whitelist = getFilterWhitelist(resource);
  return whitelist.includes(field as any);
}
