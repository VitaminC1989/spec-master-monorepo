/**
 * L4 规格明细编辑弹窗组件（核心难点）
 * 功能：
 * 1. 以弹窗形式展示和编辑 L4 规格子列表
 * 2. 使用 Form.List 实现动态表单（支持添加、删除行）
 * 3. 三个字段：尺码（可选）、规格值（必填）、规格单位（必填）
 * 4. 保存时更新父级 L3 配料记录的 specDetails 字段
 */

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Divider,
  Empty,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useUpdate, useInvalidate, HttpError } from "@refinedev/core";
import type { BOMItemRead, BOMItemUpdate, BOMItemWithSpecs, SpecDetailRead } from "../../types/api";

interface SpecDetailModalFormProps {
  open: boolean;
  bomItem: BOMItemWithSpecs | null;
  onClose: () => void;
}

export const SpecDetailModalForm: React.FC<SpecDetailModalFormProps> = ({
  open,
  bomItem,
  onClose,
}) => {
  const [form] = Form.useForm();

  // 用于更新配料记录的 Hook（使用读写分离泛型）
  const { mutate: updateBomItem, isLoading } = useUpdate<BOMItemRead, HttpError, BOMItemUpdate>();
  
  // 用于刷新数据的钩子
  const invalidate = useInvalidate();

  /**
   * 当弹窗打开或 bomItem 变化时，初始化表单数据
   * 确保每个规格都有唯一的 id，避免 key 冲突
   */
  useEffect(() => {
    if (open && bomItem) {
      // 确保每个规格都有唯一的 id
      const specDetailsWithId = (bomItem.specDetails || []).map((spec: SpecDetailRead, index: number) => ({
        ...spec,
        id: spec.id || Date.now() + index * 1000 + Math.random(),
      }));

      form.setFieldsValue({
        specDetails: specDetailsWithId,
      });
    }
  }, [open, bomItem, form]);

  /**
   * 处理保存操作
   * 提取表单中的 L4 数组数据，更新父级 L3 记录
   */
  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedSpecDetails = values.specDetails || [];

        // 调用更新 API（仅传递可写字段，ID 由后端生成）
        const updateData: BOMItemUpdate = {
          specDetails: updatedSpecDetails.map((spec: { size?: string; specValue: string | number; specUnit: string; sortOrder?: number }) => ({
            bomItemId: bomItem!.id,
            size: spec.size,
            specValue: String(spec.specValue),
            specUnit: spec.specUnit,
            sortOrder: spec.sortOrder,
          })),
        };

        updateBomItem(
          {
            resource: "bom_items",
            id: bomItem!.id,
            values: updateData,
            successNotification: {
              message: "规格明细已更新",
              description: `已保存 ${updatedSpecDetails.length} 条规格记录`,
              type: "success",
            },
          },
          {
            onSuccess: () => {
              // 刷新配料列表数据
              invalidate({
                resource: "bom_items",
                invalidates: ["list"],
              });

              // 关闭弹窗
              handleClose();
            },
          }
        );
      })
      .catch((errorInfo) => {
        console.error("表单验证失败:", errorInfo);
      });
  };

  /**
   * 处理关闭弹窗
   */
  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-lg">
          <span className="mr-2">📏</span>
          编辑规格明细 - {bomItem?.materialName}
        </div>
      }
      open={open}
      onOk={handleSave}
      onCancel={handleClose}
      width={800}
      confirmLoading={isLoading}
      okText="保存"
      cancelText="取消"
      destroyOnClose
    >
      <Divider />

      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-gray-700 m-0">
          💡 <strong>提示：</strong>一条配料可以有多条规格记录，用于区分不同尺码。
          如果所有尺码通用，只需添加一条"通码"规格即可。
        </p>
      </div>

      <Form form={form} layout="vertical">
        <Form.List name="specDetails">
          {(fields, { add, remove }) => (
            <>
              {fields.length === 0 && (
                <Empty
                  description="暂无规格记录，请点击下方按钮添加"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  className="my-8"
                />
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-700">
                        规格 #{index + 1}
                      </span>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        删除
                      </Button>
                    </div>

                    <Space size="middle" align="start" className="w-full">
                      {/* 尺码字段（可选）*/}
                      <Form.Item
                        name={[field.name, "size"]}
                        label="尺码"
                        style={{ marginBottom: 0, width: 140 }}
                        tooltip="如：S, M, L, XL，或 通码"
                      >
                        <Input
                          placeholder="如: S, M, 通码"
                          maxLength={10}
                        />
                      </Form.Item>

                      {/* 规格值字段（必填）*/}
                      <Form.Item
                        name={[field.name, "specValue"]}
                        label="规格值"
                        rules={[{ required: true, message: "请输入规格值" }]}
                        style={{ marginBottom: 0, width: 180 }}
                        tooltip="具体的规格参数，如：58.5, 2"
                      >
                        <InputNumber
                          placeholder="如: 58.5"
                          style={{ width: "100%" }}
                          precision={2}
                        />
                      </Form.Item>

                      {/* 规格单位字段（必填）*/}
                      <Form.Item
                        name={[field.name, "specUnit"]}
                        label="规格单位"
                        rules={[{ required: true, message: "请输入单位" }]}
                        style={{ marginBottom: 0, width: 120 }}
                        tooltip="计量单位，如：cm, mm, 寸"
                      >
                        <Input placeholder="如: cm, mm" maxLength={10} />
                      </Form.Item>
                    </Space>
                  </div>
                ))}
              </div>

              {/* 添加规格按钮 */}
              <Button
                type="dashed"
                onClick={() => add({
                  size: "",
                  specValue: undefined,
                  specUnit: "",
                })}
                block
                icon={<PlusOutlined />}
                size="large"
                className="mt-4"
              >
                添加规格行
              </Button>
            </>
          )}
        </Form.List>
      </Form>

      <Divider />

      <div className="text-sm text-gray-500">
        <p className="m-0">
          <strong>示例：</strong>
        </p>
        <ul className="mt-2 space-y-1">
          <li>• 拉链：S码 58.5cm, M码 59.5cm, L码 60.5cm</li>
          <li>• 纽扣：通码 10mm（所有尺码通用）</li>
        </ul>
      </div>
    </Modal>
  );
};

