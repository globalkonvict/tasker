"use client";
import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import generateColumns from "./generate-columns";
import TaskDrawer from "@/components/dashboard/task-drawer";
import {
  deleteTasks,
  fetchTasks,
  getAllUsers,
  updateTask,
} from "@/lib/api/requests";
import withDashLayout from "@/components/layouts/dashboard-layout/dashboard-layout";
import { useRealtime } from "@/contexts/realtime-context";

import type { TaskItem } from "@/types/api";
import pb from "@/lib/pocketbase/pocketbase";
import dayjs from "dayjs";

const Page = () => {
  const actionRef = useRealtime("todos");
  const [users, setUsers] = useState<{ label: string; value: string }[]>([]);
  const [viewTask, setViewTask] = useState<TaskItem>();
  const [openViewTask, setOpenViewTask] = useState<boolean>(false);
  const [openCreateTask, setOpenCreateTask] = useState<boolean>(false);

  useEffect(() => {
    getAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  return (
    <>
      <ProTable<TaskItem>
        columns={generateColumns({ users, setViewTask, setOpenViewTask })}
        scroll={{ x: 1200 }}
        actionRef={actionRef}
        cardBordered
        request={fetchTasks}
        editable={{
          type: "single",
          onSave: async (_, row, originalRow) => {
            try {
              const { status } = row;
              const { status: originalStatus } = originalRow;

              if (typeof status !== "string") {
                row.status = originalStatus;
              }

              // check if start and end date are valid using dayjs
              if (row.startDate && row.endDate) {
                const startDate = dayjs(row.startDate);
                const endDate = dayjs(row.endDate);
                if (startDate.isAfter(endDate)) {
                  throw new Error("Start date cannot be after end date");
                }
              }
              await updateTask(row.id, row);
            } catch (error) {
              message.error("Start date cannot be after end date");
            } finally {
              actionRef?.current?.reload();
            }
          },
          onDelete: async (_, row) => {
            await deleteTasks([row.id]);
          },
          deletePopconfirmMessage: "Are you sure you want to delete this task?",
        }}
        rowKey="id"
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                timeline: [values.startDate, values.endDate],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return (
            <Button
              size="small"
              danger
              onClick={() => deleteTasks(selectedRowKeys as string[])}
            >
              Delete Selected ({selectedRowKeys.length})
            </Button>
          );
        }}
        dateFormatter="string"
        headerTitle="Tasks"
        toolBarRender={() => [
          pb.authStore.model?.role === "admin" && (
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenCreateTask(true);
              }}
              type="primary"
            >
              New
            </Button>
          ),
        ]}
      />

      <TaskDrawer
        variant="view"
        viewTask={viewTask}
        openViewTask={openViewTask}
        setViewTask={setViewTask}
        setOpenViewTask={setOpenViewTask}
      />
      <TaskDrawer
        variant="create"
        users={users}
        openCreateTask={openCreateTask}
        setOpenCreateTask={setOpenCreateTask}
      />
    </>
  );
};

export default withDashLayout(Page);
