"use client";
import {
  PageContainer,
  ProConfigProvider,
  ProLayout,
} from "@ant-design/pro-components";
import { ConfigProvider, Dropdown, message } from "antd";
import React, { useState, useEffect } from "react";
import defaultProps from "./_defaultProps";
import enUS from "antd/locale/en_US";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import SettingOutlined from "@ant-design/icons/SettingOutlined";
import pb from "@/lib/pocketbase/pocketbase";
import { AuthModel } from "pocketbase";
import { removeCookie } from "@/lib/utils";

/**
 * Dash Layout only for the main app pages like dashboard
 * @param param0  children
 * @returns
 */
const DashLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();
  const router = useRouter();
  const [pathname, setPathname] = useState("/auth/login");
  const [user, setUser] = useState<AuthModel>();

  useEffect(() => {
    setPathname(path);
    if (pb.authStore.model) setUser(pb.authStore.model);
  }, [path]);

  if (typeof document === "undefined") {
    return <div />;
  }

  return (
    <ConfigProvider locale={enUS}>
      <ProConfigProvider hashed={false}>
        <ProLayout
          {...defaultProps}
          location={{
            pathname,
          }}
          token={{
            header: {
              colorBgMenuItemSelected: "rgba(0,0,0,0.10)",
            },
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed) return null;

            return (
              <div
                style={{
                  textAlign: "center",
                  paddingBlockStart: 12,
                }}
              >
                <div>Tasker Made with love</div>
                <div>by Sarthak</div>
              </div>
            );
          }}
          menuItemRender={(item, dom) => (
            <Link
              href={item.path || path}
              onClick={() => {
                setPathname(item.path || path);
              }}
            >
              {dom}
            </Link>
          )}
          layout="mix"
          avatarProps={{
            src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
            size: "small",
            title: user?.username ?? "User",
            render: (props, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "settings",
                        icon: <SettingOutlined />,
                        label: "Settings",
                      },
                      {
                        key: "logout",
                        icon: <LogoutOutlined />,
                        label: "LogOut",
                        onClick: () => {
                          message.loading("Logging you out...", () => {
                            pb.authStore.clear();
                            removeCookie("pb_auth");
                            window.location.href = "/auth/login";
                            message.success("Logged out!");
                          });
                        },
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
        >
          <PageContainer>{children}</PageContainer>
        </ProLayout>
      </ProConfigProvider>
    </ConfigProvider>
  );
};

/**
 * HOC to wrap a component with DashLayout
 * @param Component
 * @returns
 */
const withDashLayout = (Component: React.FC) => {
  const WrappedComponent: React.FC = () => (
    <DashLayout>
      <Component />
    </DashLayout>
  );
  return WrappedComponent;
};

export default withDashLayout;

export { DashLayout };
