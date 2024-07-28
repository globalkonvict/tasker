"use client";

import { TableDropdown } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatSeconds } from "@/lib/utils";
import StatusTag from "@/components/ui/status-tag";
import type { TaskItem } from "@/types/api";
import { deleteTasks } from "@/lib/api/requests";

type generateColumnsProps = {
  users: { label: string; value: string }[];
  setViewTask: (val: TaskItem) => void;
  setOpenViewTask: (val: boolean) => void;
};

// Generate columns for the task table
const generateColumns = (params: generateColumnsProps) => {
  const { users, setViewTask, setOpenViewTask } = params;
  const columns: ProColumns<TaskItem>[] = [
    {
      dataIndex: "id",
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: "Title",
      dataIndex: "title",
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Title is required",
          },
        ],
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        pending: {
          text: "Pending",
          status: "Pending",
        },
        "in-progress": {
          text: "In Progress",
          status: "In Progress",
        },
        completed: {
          text: "Completed",
          status: "Completed",
        },
      },
      renderText: (text: "pending" | "in-progress" | "completed") => {
        return <StatusTag status={text} />;
      },
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      valueType: "date",
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Time (s)",
      dataIndex: "timer",
      valueType: "digit",
      sorter: true,
      hideInSearch: true,
      render: (x, task) => {
        return formatSeconds(task.timer);
      },
    },
    {
      title: "Assigned To ",
      dataIndex: "assignedTo",
      valueType: "select",
      render: (text, record) => {
        return record.expand?.assignedTo?.name;
      },
      fieldProps: {
        options: users,
        showSearch: true,
        style: { marginLeft: 8 },
      },
    },
    {
      title: "TimeLine",
      valueType: "dateRange",
      key: "timeline",
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startDate: value[0],
            endDate: value[1],
          };
        },
      },
    },
    {
      title: "Options",
      valueType: "option",
      key: "option",
      render: (text, record, _, action) => [
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            {
              key: "edit",
              name: "Edit",
              onClick: () => {
                action?.startEditable?.(record.id, record);
              },
              icon: <EditOutlined />,
            },
            {
              key: "view",
              name: "View",
              onClick: () => {
                setViewTask(record);
                setOpenViewTask(true);
              },
              icon: <EyeOutlined />,
            },
            {
              key: "delete",
              name: "Delete",
              icon: <DeleteOutlined />,
              onClick: () => {
                deleteTasks([record.id]);
              },
            },
          ]}
        >
          Operations
        </TableDropdown>,
      ],
    },
  ];

  return columns;
};

export default generateColumns;
