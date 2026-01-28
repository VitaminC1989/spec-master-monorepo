/**
 * 用户中心页面
 * 显示用户基本信息、角色权限等
 */

import { Card, Descriptions, Avatar, Tag, Space, Button, message } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useLogout } from "@refinedev/core";
import { getStoredUser } from "../../providers/authProvider";

export const ProfilePage: React.FC = () => {
  const user = getStoredUser();
  const { mutate: logout, isLoading: logoutLoading } = useLogout();

  const handleLogout = () => {
    logout();
    message.success("已退出登录");
  };

  // 获取用户名首字母
  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="用户中心" className="shadow-sm">
        {/* 用户头像区域 */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b">
          <Avatar
            size={80}
            src={user?.avatar}
            icon={!user?.avatar && <UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          >
            {user?.username && !user?.avatar
              ? getAvatarText(user.username)
              : null}
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold m-0 mb-1">
              {user?.realName || user?.username || "未知用户"}
            </h2>
            <p className="text-gray-500 m-0">@{user?.username}</p>
          </div>
        </div>

        {/* 基本信息 */}
        <Descriptions
          title="基本信息"
          column={1}
          bordered
          size="middle"
          className="mb-6"
        >
          <Descriptions.Item label="用户ID">{user?.id}</Descriptions.Item>
          <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
          <Descriptions.Item label="真实姓名">
            {user?.realName || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {user?.email || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            <Space>
              {user?.roles?.length ? (
                user.roles.map((role) => (
                  <Tag color="blue" key={role}>
                    {role}
                  </Tag>
                ))
              ) : (
                <span className="text-gray-400">暂无角色</span>
              )}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        {/* 操作按钮 */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={logoutLoading}
          >
            退出登录
          </Button>
        </div>
      </Card>
    </div>
  );
};
