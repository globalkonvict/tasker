"use client";
import {
  PageContainer,
  ProConfigProvider,
  ProLayout,
} from "@ant-design/pro-components";
import { ConfigProvider, Dropdown, Grid, Flex } from "antd";
import React, { useState, useEffect } from "react";
import defaultProps from "./_defaultProps";
import enUS from "antd/locale/en_US";
import { usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Basic Layout only for auth pages like login and signup
 * @param param0  children
 * @returns
 */
const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const path = usePathname();
  const screens = Grid.useBreakpoint();
  const [pathname, setPathname] = useState("/auth/login");

  useEffect(() => {
    setPathname(path);
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
          menuFooterRender={() => {
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
          fixSiderbar={true}
          layout="top"
          splitMenus={true}
          contentWidth="Fixed"
          menuProps={
            screens.md
              ? {
                  style: {
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: "auto",
                    minWidth: "100%",
                  },
                }
              : {}
          }
        >
          <PageContainer breadcrumb={{ itemRender: () => null }} title={false}>
            <Flex
              justify="center"
              align="center"
              style={{ minHeight: "calc(100vh - 150px)" }}
            >
              {children}
            </Flex>
          </PageContainer>
        </ProLayout>
      </ProConfigProvider>
    </ConfigProvider>
  );
};

/**
 * HOC to wrap a component with BasicLayout
 * @param Component
 * @returns
 */
const withBasicLayout = (Component: React.FC) => {
  const WrappedComponent: React.FC = () => (
    <BasicLayout>
      <Component />
    </BasicLayout>
  );
  return WrappedComponent;
};

export default withBasicLayout;

export { BasicLayout };
