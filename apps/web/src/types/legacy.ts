/**
 * 类型桥接文件 - 用于渐进式迁移
 *
 * 这个文件将生成的类型重新导出为旧的接口名称，
 * 允许组件逐步迁移到新的类型系统。
 *
 * 推荐使用：从 ./api.ts 导入读写分离的类型
 * 迁移完成后，这个文件将被删除。
 */

import type { components } from "@spec/types";

// ============================================================================
// 重新导出 api.ts 中的读写分离类型（推荐使用）
// ============================================================================
export type {
  // 款号
  StyleRead, StyleCreate, StyleUpdate,
  // 颜色版本
  VariantRead, VariantCreate, VariantUpdate, VariantClone, VariantCloneResponse,
  // 配料明细
  BOMItemRead, BOMItemCreate, BOMItemUpdate, BOMItemWithSpecs,
  // 规格明细
  SpecDetailRead, SpecDetailCreate, SpecDetailUpdate,
  // 客户
  CustomerRead, CustomerCreate, CustomerUpdate,
  // 尺码
  SizeRead, SizeCreate, SizeUpdate,
  // 单位
  UnitRead, UnitCreate, UnitUpdate,
} from "./api";

// ============================================================================
// 款号 (Styles)
// ============================================================================
export type IStyle = components["schemas"]["StyleResponseDto"];
export type IStyleList = components["schemas"]["StyleListResponseDto"];

// ============================================================================
// 颜色版本 (Variants)
// ============================================================================
export type IColorVariant = components["schemas"]["VariantResponseDto"];
export type IVariantList = components["schemas"]["VariantListResponseDto"];

// ============================================================================
// 配料明细 (BOM Items)
// ============================================================================
export type IBOMItem = components["schemas"]["BOMItemResponseDto"];
export type IBOMItemList = components["schemas"]["BOMItemListResponseDto"];

// ============================================================================
// 规格明细 (Spec Details)
// ============================================================================
export type ISpecDetail = components["schemas"]["SpecDetailResponseDto"];
export type ISpecDetailList = components["schemas"]["SpecDetailListResponseDto"];

// ============================================================================
// 客户 (Customers)
// ============================================================================
export type ICustomer = components["schemas"]["CustomerResponseDto"];
export type ICustomerList = components["schemas"]["CustomerListResponseDto"];

// ============================================================================
// 尺码 (Sizes)
// ============================================================================
export type ISize = components["schemas"]["SizeResponseDto"];
export type ISizeList = components["schemas"]["SizeListResponseDto"];

// ============================================================================
// 单位 (Units)
// ============================================================================
export type IUnit = components["schemas"]["UnitResponseDto"];
export type IUnitList = components["schemas"]["UnitListResponseDto"];

// ============================================================================
// 特殊操作响应
// ============================================================================
export type ICloneVariantResponse = components["schemas"]["CloneVariantResponseDto"];

// ============================================================================
// 下单相关类型
// ============================================================================
export interface ISizeOrderQty {
  size: string;
  quantity: number;
}

// ============================================================================
// 客户端扩展类型（用于 UI 组件）
// ============================================================================
// BOMItem 扩展类型，包含嵌套的 specDetails（用于客户端展示）
export interface IBOMItemWithSpecs extends IBOMItem {
  specDetails?: ISpecDetail[];
}
