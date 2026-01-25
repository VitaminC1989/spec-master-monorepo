/**
 * 用户菜单组件
 * 显示用户头像、用户名，提供用户中心和退出登录功能
 */

import { Avatar, Dropdown, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface UserIdentity {
  id: number;
  name: string;
  avatar: string | null;
}

export const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<UserIdentity>();
  const { mutate: logout } = useLogout();

  // 下拉菜单项
  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "用户中心",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
      onClick: () => logout(),
    },
  ];

  // 获取用户名首字母作为头像文字
  const getAvatarText = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
      <Space className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">
        <Avatar
          size="small"
          src={user?.avatar}
          icon={!user?.avatar && <UserOutlined />}
          style={{ backgroundColor: "#1890ff" }}
        >
          {user?.name && !user?.avatar ? getAvatarText(user.name) : null}
        </Avatar>
        <Text className="text-gray-700">{user?.name || "用户"}</Text>
      </Space>
    </Dropdown>
  );
};
