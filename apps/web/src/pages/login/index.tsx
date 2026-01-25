/**
 * 登录页面
 */

import { useState } from "react";
import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { mutate: login } = useLogin<LoginFormValues>();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    login(values, {
      onSuccess: () => {
        message.success("登录成功");
      },
      onError: (error) => {
        message.error(error?.message || "登录失败");
      },
      onSettled: () => {
        setLoading(false);
      },
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            SpecMaster
          </Title>
          <Typography.Text type="secondary">
            服装配方管理系统
          </Typography.Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            默认账号: admin / admin123
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};
