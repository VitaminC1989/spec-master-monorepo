/**
 * API 类型入口文件 - 读写分离类型设计
 *
 * 设计原则：
 * - 读取（响应）：使用 *Read 类型，对应后端 *ResponseDto
 * - 写入（请求）：使用 *Create / *Update 类型，对应后端 CreateXxxDto / UpdateXxxDto
 * - 所有类型来源于 OpenAPI 自动生成，保证前后端类型一致
 *
 * 使用规范：
 * - useCreate<StyleRead, HttpError, StyleCreate>()
 * - useUpdate<StyleRead, HttpError, StyleUpdate>()
 * - useList<StyleRead>() / useOne<StyleRead>()
 */

import type { components } from "@spec/types";

// ============================================================================
// 款号 (Styles) - 读写分离
// ============================================================================
/** 款号读取类型（响应） */
export type StyleRead = components["schemas"]["StyleResponseDto"];
/** 款号列表响应 */
export type StyleListRead = components["schemas"]["StyleListResponseDto"];
/** 款号创建类型（请求） */
export type StyleCreate = components["schemas"]["CreateStyleDto"];
/** 款号更新类型（请求） */
export type StyleUpdate = components["schemas"]["UpdateStyleDto"];

// ============================================================================
// 颜色版本 (Variants) - 读写分离
// ============================================================================
/** 颜色版本读取类型（响应） */
export type VariantRead = components["schemas"]["VariantResponseDto"];
/** 颜色版本列表响应 */
export type VariantListRead = components["schemas"]["VariantListResponseDto"];
/** 颜色版本创建类型（请求） */
export type VariantCreate = components["schemas"]["CreateVariantDto"];
/** 颜色版本更新类型（请求） */
export type VariantUpdate = components["schemas"]["UpdateVariantDto"];
/** 颜色版本克隆请求 */
export type VariantClone = components["schemas"]["CloneVariantDto"];
/** 颜色版本克隆响应 */
export type VariantCloneResponse = components["schemas"]["CloneVariantResponseDto"];

// ============================================================================
// 配料明细 (BOM Items) - 读写分离
// ============================================================================
/** 配料明细读取类型（响应） */
export type BOMItemRead = components["schemas"]["BOMItemResponseDto"];
/** 配料明细列表响应 */
export type BOMItemListRead = components["schemas"]["BOMItemListResponseDto"];
/** 配料明细创建类型（请求） */
export type BOMItemCreate = components["schemas"]["CreateBomItemDto"];
/** 配料明细更新类型（请求） */
export type BOMItemUpdate = components["schemas"]["UpdateBomItemDto"];

// ============================================================================
// 规格明细 (Spec Details) - 读写分离
// ============================================================================
/** 规格明细读取类型（响应） */
export type SpecDetailRead = components["schemas"]["SpecDetailResponseDto"];
/** 规格明细列表响应 */
export type SpecDetailListRead = components["schemas"]["SpecDetailListResponseDto"];
/** 规格明细创建类型（请求） */
export type SpecDetailCreate = components["schemas"]["CreateSpecDetailDto"];
/** 规格明细更新类型（请求） */
export type SpecDetailUpdate = components["schemas"]["UpdateSpecDetailDto"];

// ============================================================================
// 客户 (Customers) - 读写分离
// ============================================================================
/** 客户读取类型（响应） */
export type CustomerRead = components["schemas"]["CustomerResponseDto"];
/** 客户列表响应 */
export type CustomerListRead = components["schemas"]["CustomerListResponseDto"];
/** 客户创建类型（请求） */
export type CustomerCreate = components["schemas"]["CreateCustomerDto"];
/** 客户更新类型（请求） */
export type CustomerUpdate = components["schemas"]["UpdateCustomerDto"];

// ============================================================================
// 尺码 (Sizes) - 读写分离
// ============================================================================
/** 尺码读取类型（响应） */
export type SizeRead = components["schemas"]["SizeResponseDto"];
/** 尺码列表响应 */
export type SizeListRead = components["schemas"]["SizeListResponseDto"];
/** 尺码创建类型（请求） */
export type SizeCreate = components["schemas"]["CreateSizeDto"];
/** 尺码更新类型（请求） */
export type SizeUpdate = components["schemas"]["UpdateSizeDto"];

// ============================================================================
// 单位 (Units) - 读写分离
// ============================================================================
/** 单位读取类型（响应） */
export type UnitRead = components["schemas"]["UnitResponseDto"];
/** 单位列表响应 */
export type UnitListRead = components["schemas"]["UnitListResponseDto"];
/** 单位创建类型（请求） */
export type UnitCreate = components["schemas"]["CreateUnitDto"];
/** 单位更新类型（请求） */
export type UnitUpdate = components["schemas"]["UpdateUnitDto"];

// ============================================================================
// 客户端扩展类型（用于 UI 组件）
// ============================================================================
/** BOMItem 扩展类型，包含嵌套的 specDetails（用于客户端展示） */
export type BOMItemWithSpecs = BOMItemRead;

// ============================================================================
// 兼容性别名（渐进式迁移，后续可删除）
// ============================================================================
/** @deprecated 使用 StyleRead 替代 */
export type IStyle = StyleRead;
/** @deprecated 使用 VariantRead 替代 */
export type IColorVariant = VariantRead;
/** @deprecated 使用 BOMItemRead 替代 */
export type IBOMItem = BOMItemRead;
/** @deprecated 使用 SpecDetailRead 替代 */
export type ISpecDetail = SpecDetailRead;
/** @deprecated 使用 CustomerRead 替代 */
export type ICustomer = CustomerRead;
/** @deprecated 使用 SizeRead 替代 */
export type ISize = SizeRead;
/** @deprecated 使用 UnitRead 替代 */
export type IUnit = UnitRead;
/** @deprecated 使用 BOMItemWithSpecs 替代 */
export type IBOMItemWithSpecs = BOMItemWithSpecs;
