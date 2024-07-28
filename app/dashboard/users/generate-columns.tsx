"use client";

import { TableDropdown } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import type { User } from "@/types/api";
import {} from "@/lib/api/requests";
import { Tag } from "antd";

type generateColumnsProps = {};

// Generate columns for the task table
const generateColumns = (params: generateColumnsProps) => {
  const {} = params;
  const columns: ProColumns<User>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      dataIndex: "id",
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      ellipsis: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Name is required",
          },
        ],
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Username is required",
          },
        ],
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Email is required",
          },
        ],
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      valueType: "select",
      valueEnum: {
        admin: {
          text: "Admin",
        },
        developer: {
          text: "Developer",
        },
      },
      renderText: (text) => {
        return <Tag color={text === "admin" ? "red" : "blue"}>{text}</Tag>;
      },
    },
  ];

  return columns;
};

export default generateColumns;
