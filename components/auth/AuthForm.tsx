import React, { useState } from "react";
import { Form, Button, message, Typography, Space, Flex } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  ProForm,
  ProFormText,
  ProFormCheckbox,
  ProCard,
} from "@ant-design/pro-components";
import Link from "next/link";
import pb from "@/lib/pocketbase/pocketbase";
import type { RecordModel, RecordAuthResponse } from "pocketbase";
import { api } from "@/lib/api/api";
import { debounce } from "@/lib/utils";

type AuthFormProps = {
  title: string;
  type: "login" | "signup" | "reset";
  onSubmit: (
    values: any
  ) => Promise<RecordModel | RecordAuthResponse<RecordModel> | void>;
  initialValues?: Record<string, any>;
};

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  initialValues = {},
  title = "",
}) => {
  const router = useRouter();
  const search = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      await onSubmit(values);

      if (type === "login") {
        //  add the authstore to a cookie for easy server side use
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

        if (search.get("next")) {
          router.push(search.get("next") as string);
        } else {
          router.push("/dashboard/tasks");
        }
      }

      message.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} successful!`
      );
      form.resetFields();
    } catch (error) {
      message.error(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } failed. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the username/email already exists
  const checkUserExists =
    (type: "email" | "username") => async (rule: any, value: string) => {
      if (!value) {
        return Promise.resolve();
      }
      try {
        const { data } = await api.get("/auth/validation", {
          params: type === "email" ? { email: value } : { username: value },
        });

        if (data.success) {
          return Promise.resolve();
        }
        return Promise.reject(
          `${type === "email" ? "Email" : "Username"} already exists!`
        );
      } catch (err) {
        return Promise.reject(
          `Error checking ${type === "email" ? "email" : "username"}!`
        );
      }
    };

  // Debounce the validation function
  const debouncedCheckUserExists = (
    type: "email" | "username",
    wait: number
  ) => {
    const debouncedFunc = debounce(
      (
        resolve: (value: unknown) => void,
        reject: (reason?: any) => void,
        value: string
      ) => {
        checkUserExists(type)(null, value).then(resolve).catch(reject);
      },
      wait
    );

    return async (_: any, value: string) => {
      return new Promise((resolve, reject) => {
        debouncedFunc(resolve, reject, value);
      });
    };
  };

  const getFields = () => {
    switch (type) {
      case "login":
        return (
          <>
            <ProFormText
              name="username"
              label="Username/Email"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="site-form-item-icon" />,
              }}
              placeholder="Username"
              rules={[
                {
                  required: true,
                  message: "Please input your username or email!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              label="Password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="site-form-item-icon" />,
              }}
              placeholder="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            />
          </>
        );
      case "signup":
        return (
          <>
            <ProFormText
              name="name"
              label="Name"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="site-form-item-icon" />,
              }}
              placeholder="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            />
            <ProFormText
              name="username"
              label="Username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className="site-form-item-icon" />,
              }}
              placeholder="Username"
              rules={[
                {
                  min: 3,
                  message: "Username must be at least 3 characters long!",
                },
                {
                  max: 150,
                  message: "Username must be at most 150 characters long!",
                },
                { required: true, message: "Please input your username!" },
                { validator: debouncedCheckUserExists("username", 500) },
              ]}
              validateFirst="parallel"
            />
            <ProFormText
              name="email"
              label="Email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined className="site-form-item-icon" />,
              }}
              placeholder="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
                { validator: debouncedCheckUserExists("email", 500) },
              ]}
              validateFirst="parallel"
            />
            <ProFormText.Password
              name="password"
              label="Password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="site-form-item-icon" />,
              }}
              placeholder="Password"
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long!",
                },
              ]}
              validateFirst="parallel"
            />
            <ProFormText.Password
              name="confirmPassword"
              label="Confirm Password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className="site-form-item-icon" />,
              }}
              placeholder="Confirm Password"
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            />
          </>
        );
      case "reset":
        return (
          <>
            <ProFormText
              name="email"
              label="Email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined className="site-form-item-icon" />,
              }}
              placeholder="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ProCard
      style={{ maxWidth: 500, padding: 16 }}
      title={
        <Typography.Title
          style={{ width: "100%", textAlign: "center" }}
          level={2}
        >
          {title}
        </Typography.Title>
      }
    >
      <ProForm
        form={form}
        name="auth-form"
        initialValues={initialValues}
        onFinish={handleSubmit}
        scrollToFirstError
        submitter={{
          render: (props, dom) => (
            <Flex
              vertical
              style={{ width: "100%" }}
              align="center"
              justify="center"
              gap="large"
            >
              {type !== "reset" && (
                <Space
                  direction="vertical"
                  style={{ width: "100%", marginTop: -18 }}
                  align="end"
                >
                  <Typography.Text>
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Typography.Text>
                </Space>
              )}
              <Button type="primary" htmlType="submit" loading={loading} block>
                {type === "login"
                  ? "Log in"
                  : type === "signup"
                  ? "Sign up"
                  : "Reset Password"}
              </Button>
              {/** Render the login or sign up link based on the type but don't render on reset password page */}
              {type !== "reset" && (
                <>
                  <Typography.Text
                    style={{ width: "100%", textAlign: "center" }}
                    type="secondary"
                    underline
                  >
                    {type === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </Typography.Text>
                  <Link
                    href={type === "login" ? "/auth/sign-up" : "/auth/login"}
                    style={{ width: "100%" }}
                  >
                    <Button block>
                      {type === "login" ? "Sign up" : "Log in"}
                    </Button>
                  </Link>
                </>
              )}
            </Flex>
          ),
        }}
      >
        {getFields()}
      </ProForm>
    </ProCard>
  );
};

export default AuthForm;
