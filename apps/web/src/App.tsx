/**
 * SpecMaster 应用主组件
 * 负责：配置 Refine 框架、路由、数据提供者、国际化
 */

import { Refine, Authenticated } from "@refinedev/core";
import routerBindings, {
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ConfigProvider, App as AntApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { VibeKanbanWebCompanion } from "vibe-kanban-web-companion";

// 配置 dayjs 中文
dayjs.locale("zh-cn");

// 导入 API 数据提供者
import { apiDataProvider } from "./providers/apiDataProvider";

// 导入认证提供者
import { authProvider } from "./providers/authProvider";

// 导入布局组件
import { Layout } from "./components/layouts/Layout";

// 导入页面组件
import { StyleList } from "./pages/styles/list";
import { StyleDetailPage } from "./pages/styles/detail";
import { CustomerList } from "./pages/customers/list";
import { CustomerDetailPage } from "./pages/customers/detail";
import { SizeList } from "./pages/sizes/list";
import { UnitList } from "./pages/units/list";
import { LoginPage } from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <VibeKanbanWebCompanion />
      {/* Ant Design 中文配置 */}
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 6,
          },
        }}
      >
        <AntApp>
          {/* Refine 核心配置 */}
          <Refine
            dataProvider={apiDataProvider}
            authProvider={authProvider}
            routerProvider={routerBindings}
            resources={[
              {
                name: "styles",
                list: "/styles",
                show: "/styles/:id",
                meta: {
                  label: "款号管理",
                  icon: "📋",
                },
              },
              {
                name: "customers",
                list: "/customers",
                show: "/customers/:id",
                meta: {
                  label: "客户管理",
                  icon: "👥",
                },
              },
              {
                name: "sizes",
                list: "/sizes",
                meta: {
                  label: "尺码管理",
                  icon: "📏",
                },
              },
              {
                name: "units",
                list: "/units",
                meta: {
                  label: "单位管理",
                  icon: "⚖️",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              disableTelemetry: true,
            }}
          >
            {/* 路由配置 */}
            <Routes>
              {/* 登录页面 - 不需要认证 */}
              <Route path="/login" element={<LoginPage />} />

              {/* 根路径自动跳转到款号列表 */}
              <Route
                index
                element={<NavigateToResource resource="styles" />}
              />

              {/* 受保护的路由 - 需要认证 */}
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<LoginPage />}
                  >
                    <Layout />
                  </Authenticated>
                }
              >
                {/* 款号管理 */}
                <Route path="/styles" element={<StyleList />} />
                <Route path="/styles/:id" element={<StyleDetailPage />} />

                {/* 客户管理 */}
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/customers/:id" element={<CustomerDetailPage />} />

                {/* 尺码管理 */}
                <Route path="/sizes" element={<SizeList />} />

                {/* 单位管理 */}
                <Route path="/units" element={<UnitList />} />
              </Route>

              {/* 404 页面 */}
              <Route path="*" element={<div>页面不存在</div>} />
            </Routes>

            {/* Refine 功能组件 */}
            <UnsavedChangesNotifier />
          </Refine>
        </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
