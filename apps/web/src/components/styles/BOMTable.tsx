/**
 * L3 配料明细表格组件（核心难点）
 * 功能：
 * 1. 展示当前颜色版本下的所有配料明细
 * 2. 支持行内编辑（除规格明细外的字段）
 * 3. L4 规格明细聚合展示（多条规格记录显示为堆叠文本）
 * 4. 点击"编辑规格"按钮打开 L4 编辑弹窗
 * 5. 支持添加、删除配料
 */

import React, { useState } from "react";
import { EditableProTable } from "@ant-design/pro-components";
import { Image, Button, Tag, Upload, message } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useList, useCreate, useUpdate, useDelete, HttpError } from "@refinedev/core";
import type { BOMItemRead, BOMItemCreate, BOMItemUpdate, BOMItemWithSpecs, SpecDetailRead } from "../../types/api";
import { SpecDetailModalForm } from "./SpecDetailModalForm";
import { MaterialColorEditor, MaterialColorDisplay } from "./MaterialColorEditor";
import { uploadToQiniu } from "../../utils/qiniuUpload";

interface BOMTableProps {
  variantId: number;
}

/**
 * 辅料图片上传组件
 */
interface MaterialImageUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
}

const MaterialImageUploader: React.FC<MaterialImageUploaderProps> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadToQiniu({
        file,
        prefix: "materials", // 辅料图片前缀
        onProgress: (percent) => {
          console.log(`辅料图片上传进度: ${percent}%`);
        },
      });

      onChange?.(url);
      message.success("辅料图片上传成功");
    } catch (error) {
      console.error("辅料图片上传失败:", error);
      message.error("辅料图片上传失败");
    } finally {
      setUploading(false);
    }
    return false; // 阻止默认上传
  };

  return (
    <div className="relative inline-block">
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={handleUpload}
        accept="image/*"
        disabled={uploading}
      >
        {value ? (
          <Image
            src={value}
            width={100}
            height={100}
            style={{ objectFit: "cover" }}
            preview={false}
          />
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
              {uploading ? "上传中..." : "上传图片"}
            </div>
          </div>
        )}
      </Upload>
      {value && (
        <Button
          type="primary"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onChange?.("");
            message.success("图片已移除");
          }}
          className="absolute -top-2 -right-2 z-10"
          style={{ minWidth: 24, padding: "0 4px" }}
        />
      )}
    </div>
  );
};

export const BOMTable: React.FC<BOMTableProps> = ({ variantId }) => {
  // 当前正在编辑规格的配料记录
  const [editingRecord, setEditingRecord] = useState<BOMItemWithSpecs | null>(null);

  // 加载 L3 配料数据（按 variantId 筛选）
  const { data: bomData, isLoading } = useList<BOMItemWithSpecs>({
    resource: "bom_items",
    filters: [{ field: "variantId", operator: "eq", value: variantId }],
    pagination: { pageSize: 100 }, // 加载所有配料
  });

  const dataSource = bomData?.data || [];

  // 创建配料的 Hook（使用读写分离泛型）
  const { mutate: createBomItem } = useCreate<BOMItemRead, HttpError, BOMItemCreate>();

  // 更新配料的 Hook（使用读写分离泛型）
  const { mutate: updateBomItem } = useUpdate<BOMItemRead, HttpError, BOMItemUpdate>();

  // 删除配料的 Hook
  const { mutate: deleteBomItem } = useDelete();

  /**
   * 统一错误处理函数
   * 根据错误类型提供友好的用户提示
   */
  const handleError = (error: HttpError, operation: string) => {
    console.error(`${operation}失败:`, error);

    const statusCode = error.statusCode;
    const errorMessage = error.message || "未知错误";

    if (statusCode === 400) {
      message.error(`${operation}失败：数据验证不通过 - ${errorMessage}`);
    } else if (statusCode === 401) {
      message.error(`${operation}失败：未登录或登录已过期，请重新登录后再试`);
    } else if (statusCode === 403) {
      message.error(`${operation}失败：权限不足，您没有执行此操作的权限`);
    } else if (statusCode === 404) {
      message.error(`${operation}失败：数据不存在，该配料可能已被删除`);
    } else if (statusCode === 409) {
      message.error(`${operation}失败：数据冲突 - ${errorMessage}`);
    } else if (statusCode >= 500) {
      message.error(`${operation}失败：服务器错误，请稍后重试或联系管理员`);
    } else if (!statusCode) {
      message.error(`${operation}失败：网络连接失败，请检查网络连接后重试`);
    } else {
      message.error(`${operation}失败：${errorMessage || "请稍后重试"}`);
    }
  };

  /**
   * 处理行内编辑保存
   * 智能判断：新记录调用 CREATE，已存在记录调用 UPDATE
   */
  const handleSave = async (_key: React.Key, record: BOMItemRead) => {
    // 检查记录是否已存在于数据库中
    const existingRecord = dataSource.find((item) => item.id === record.id);

    if (existingRecord) {
      // ========== 更新操作 ==========
      // 显式构造 UpdateBomItemDto，仅包含可写字段
      const updateData: BOMItemUpdate = {
        materialName: record.materialName,
        materialImageUrl: record.materialImageUrl || undefined,
        materialColorText: record.materialColorText || undefined,
        materialColorImageUrl: record.materialColorImageUrl || undefined,
        usage: record.usage,
        unit: record.unit,
        supplier: record.supplier || undefined,
        sortOrder: record.sortOrder,
      };

      updateBomItem(
        {
          resource: "bom_items",
          id: record.id,
          values: updateData,
        },
        {
          onSuccess: () => {
            message.success("配料更新成功");
          },
          onError: (error) => {
            handleError(error, "更新配料");
          },
        }
      );
    } else {
      // ========== 创建操作 ==========
      // 显式构造 CreateBomItemDto，仅包含可写字段
      const createData: BOMItemCreate = {
        variantId: variantId,
        materialName: record.materialName,
        materialImageUrl: record.materialImageUrl || undefined,
        materialColorText: record.materialColorText || undefined,
        materialColorImageUrl: record.materialColorImageUrl || undefined,
        usage: record.usage,
        unit: record.unit,
        supplier: record.supplier || undefined,
        sortOrder: record.sortOrder ?? 0,
        // 嵌套创建规格明细（如果存在）
        specDetails: record.specDetails && record.specDetails.length > 0
          ? record.specDetails.map((spec: SpecDetailRead) => ({
              size: spec.size || undefined,
              specValue: String(spec.specValue),
              specUnit: spec.specUnit,
              sortOrder: spec.sortOrder ?? 0,
            }))
          : undefined,
      };

      createBomItem(
        {
          resource: "bom_items",
          values: createData,
        },
        {
          onSuccess: () => {
            message.success("配料添加成功");
          },
          onError: (error) => {
            handleError(error, "添加配料");
          },
        }
      );
    }
  };

  /**
   * 处理删除配料
   */
  const handleDelete = (record: BOMItemRead) => {
    deleteBomItem(
      {
        resource: "bom_items",
        id: record.id,
      },
      {
        onSuccess: () => {
          message.success("配料删除成功");
        },
        onError: (error) => {
          handleError(error, "删除配料");
        },
      }
    );
  };

  /**
   * 渲染 L4 规格明细聚合显示
   * 关键实现：将 specDetails 数组映射为堆叠的文本块
   */
  const renderSpecDetails = (specDetails: SpecDetailRead[] | undefined, record: BOMItemWithSpecs) => {
    if (!specDetails || specDetails.length === 0) {
      return (
        <div className="text-center">
          <span className="text-gray-400">无规格</span>
          <div className="mt-2">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => setEditingRecord(record)}
            >
              添加规格
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {/* 聚合显示所有规格 */}
        <div className="space-y-1">
          {specDetails.map((spec, idx) => (
            <div key={spec.id || idx} className="flex items-center gap-2">
              {/* 尺码标签 */}
              {spec.size && (
                <Tag color="blue" className="m-0">
                  {spec.size}
                </Tag>
              )}
              {/* 规格值和单位 */}
              <span className="font-medium text-gray-800">
                {spec.specValue}
              </span>
              <span className="text-gray-500 text-sm">{spec.specUnit}</span>
            </div>
          ))}
        </div>

        {/* 编辑按钮 */}
        <div>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditingRecord(record)}
            className="p-0 h-auto"
          >
            编辑规格
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 m-0">
            📦 配料明细表（BOM）
          </h3>
        </div>

        <EditableProTable<BOMItemWithSpecs>
          rowKey="id"
          loading={isLoading}
          value={dataSource}
          columns={[
            {
              title: "辅料名称",
              dataIndex: "materialName",
              width: 180,
              formItemProps: {
                rules: [{ required: true, message: "请输入辅料名称" }],
              },
            },
            {
              title: "辅料图片",
              dataIndex: "materialImageUrl",
              width: 120,
              render: (url) => {
                if (!url) {
                  return (
                    <div className="w-[60px] h-[60px] bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                      无图片
                    </div>
                  );
                }
                return (
                  <Image
                    src={url as string}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                );
              },
              renderFormItem: (_, { record, recordKey }, form) => {
                return (
                  <MaterialImageUploader
                    value={record?.materialImageUrl}
                    onChange={(url) => {
                      if (record && recordKey !== undefined) {
                        record.materialImageUrl = url;
                        form?.setFieldsValue({
                          [recordKey as string]: {
                            ...record,
                            materialImageUrl: url,
                          },
                        });
                      }
                    }}
                  />
                );
              },
            },
            {
              title: "辅料颜色",
              dataIndex: "materialColorText", // 使用真实字段名
              width: 250,
              render: (_, record) => (
                <MaterialColorDisplay
                  text={record.materialColorText}
                  imageUrl={record.materialColorImageUrl}
                />
              ),
              renderFormItem: (_, { record, recordKey }, form) => {
                return (
                  <MaterialColorEditor
                    value={{
                      text: record?.materialColorText,
                      imageUrl: record?.materialColorImageUrl,
                    }}
                    onChange={(value) => {
                      // 使用表单实例更新值（确保被追踪）
                      if (record && recordKey !== undefined) {
                        record.materialColorText = value.text;
                        record.materialColorImageUrl = value.imageUrl;
                        // 触发表单值变化
                        form?.setFieldsValue({
                          [recordKey as string]: {
                            ...record,
                            materialColorText: value.text,
                            materialColorImageUrl: value.imageUrl,
                          },
                        });
                      }
                    }}
                  />
                );
              },
            },
            // 隐藏字段：辅料颜色图片URL（用于保存数据）
            {
              title: "色卡图片",
              dataIndex: "materialColorImageUrl",
              hideInTable: true, // 表格中隐藏
              editable: false,   // 不可编辑（通过上面的颜色列编辑）
            },
            {
              title: "单耗",
              dataIndex: "usage",
              width: 80,
              valueType: "digit",
              formItemProps: {
                rules: [{ required: true, message: "请输入单耗" }],
              },
            },
            {
              title: "单位",
              dataIndex: "unit",
              width: 80,
              valueType: "select",
              valueEnum: {
                米: { text: "米" },
                条: { text: "条" },
                粒: { text: "粒" },
                套: { text: "套" },
                片: { text: "片" },
              },
              formItemProps: {
                rules: [{ required: true, message: "请选择单位" }],
              },
            },
            {
              title: "供应商",
              dataIndex: "supplier",
              width: 150,
            },
            {
              title: "规格明细（尺码/值/单位）",
              dataIndex: "specDetails",
              width: 260,
              editable: false,
              render: (_, record) => renderSpecDetails(record.specDetails, record),
            },
            {
              title: "操作",
              valueType: "option",
              width: 120,
              render: (_, record, __, action) => [
                <a
                  key="edit"
                  onClick={() => {
                    action?.startEditable(record.id);
                  }}
                >
                  编辑
                </a>,
                <a
                  key="delete"
                  onClick={() => handleDelete(record)}
                  className="text-red-500"
                >
                  删除
                </a>,
              ],
            },
          ]}
          recordCreatorProps={{
            creatorButtonText: "添加配料",
            record: () => ({
              id: Date.now(), // 临时ID
              variantId: variantId,
              materialName: "",
              materialImageUrl: "", // 让用户自己上传
              usage: 1,
              unit: "条",
              sortOrder: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              specDetails: [],
            }),
          }}
          editable={{
            type: "multiple",
            onSave: async (key, record) => {
              await handleSave(key as React.Key, record as BOMItemRead);
            },
          }}
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* L4 规格编辑弹窗 */}
      <SpecDetailModalForm
        open={!!editingRecord}
        bomItem={editingRecord}
        onClose={() => setEditingRecord(null)}
      />
    </>
  );
};

