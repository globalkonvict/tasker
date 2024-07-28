"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Drawer,
  Flex,
  Typography,
  Space,
  Tooltip,
  Avatar,
  Button,
  message,
} from "antd";
import StatusTag from "@/components/ui/status-tag";
import Comments from "@/components/ui/comments";
import TaskForm from "@/components/dashboard/task-form";
import ReadMoreParagraph from "@/components/ui/read-more";
import { formatSeconds } from "@/lib/utils";
import type { TaskItem } from "@/types/api";
import { updateTaskTimer } from "@/lib/api/requests";

type TaskDrawerViewProps = {
  variant: "view";
  viewTask: TaskItem | undefined;
  openViewTask: boolean;
  setViewTask: (val: TaskItem | undefined) => void;
  setOpenViewTask: (val: boolean) => void;
};

type TaskDrawerCreateProps = {
  variant: "create";
  users: { label: string; value: string }[];
  openCreateTask: boolean;
  setOpenCreateTask: (val: boolean) => void;
};

type TaskDrawerProps = TaskDrawerViewProps | TaskDrawerCreateProps;

const TaskDrawer: React.FC<TaskDrawerProps> = (props) => {
  const { variant } = props;
  const [totalTimeWorked, setTotalTimeWorked] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setInterval(() => {
      if (variant === "view") {
        if (props.viewTask) {
          if (props.viewTask.startTime) {
            const timeWorked = dayjs().diff(
              dayjs(props.viewTask.startTime),
              "second"
            );
            setTotalTimeWorked(props.viewTask.timer + timeWorked);
          } else {
            setTotalTimeWorked(props.viewTask.timer);
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [props, variant]);

  if (variant === "view") {
    const { viewTask, openViewTask, setViewTask, setOpenViewTask } = props;

    const toggleTimer = async () => {
      if (!viewTask) return;

      if (viewTask.startTime) {
        // Stop timer
        const timeWorked = dayjs().diff(dayjs(viewTask.startTime), "second");
        await updateTaskTimer(viewTask?.id, viewTask?.timer + timeWorked, null);
        setViewTask({
          ...viewTask,
          startTime: null,
          timer: viewTask?.timer + timeWorked,
        });
        message.success("Timer stopped");
      } else {
        // Start timer
        await updateTaskTimer(
          viewTask.id,
          viewTask.timer,
          dayjs().toISOString()
        );
        setViewTask({
          ...viewTask,
          startTime: dayjs().toISOString(),
        });
        message.success("Timer started");
      }
    };

    return (
      <>
        <Drawer
          open={openViewTask}
          closable={false}
          onClose={() => {
            setViewTask(undefined);
            setOpenViewTask(false);
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Tooltip title={viewTask?.title}>
              <Typography.Title level={4} underline>
                {viewTask?.title}
              </Typography.Title>
            </Tooltip>
            <Button block onClick={toggleTimer}>
              {viewTask?.startTime ? "Stop Timer" : "Start Timer"}
            </Button>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Deadline
              </Typography.Title>
              <Typography.Text mark style={{ marginLeft: 8 }}>
                {dayjs(viewTask?.startDate).format("D MMM YYYY") +
                  " - " +
                  dayjs(viewTask?.endDate).format("D MMM YYYY")}
              </Typography.Text>
            </Flex>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Status
              </Typography.Title>
              <StatusTag
                status={viewTask?.status ?? "pending"}
                style={{ marginLeft: 8 }}
              />
            </Flex>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Assigned To
              </Typography.Title>
              <Tooltip
                title={viewTask?.expand.assignedTo.name.replace(/^./, (m) =>
                  m.toUpperCase()
                )}
              >
                <Avatar
                  size={24}
                  style={{ backgroundColor: "#87d068", marginLeft: 8 }}
                >
                  {viewTask?.expand.assignedTo.username[0].toUpperCase()}
                </Avatar>
              </Tooltip>
            </Flex>
            <Flex align="center" justify="flex-start">
              <Typography.Title style={{ margin: 0 }} level={5}>
                Total Time Worked
              </Typography.Title>
              <Typography.Text code style={{ marginLeft: 8 }}>
                {formatSeconds(totalTimeWorked ?? 0)}
              </Typography.Text>
            </Flex>
            <Typography.Title style={{ margin: 0 }} level={5}>
              Task Description
            </Typography.Title>
            <ReadMoreParagraph text={viewTask?.description ?? ""} lines={3} />
            <Flex vertical>
              <Typography.Title level={4}>Discussions</Typography.Title>
              <Typography.Text type="secondary">
                Ask Questions or comment
              </Typography.Text>
              {viewTask?.id && <Comments todo={viewTask?.id} />}
            </Flex>
          </Space>
        </Drawer>
      </>
    );
  }

  if (variant === "create") {
    const { users, openCreateTask, setOpenCreateTask } = props;
    return (
      <Drawer
        open={openCreateTask}
        onClose={() => setOpenCreateTask(false)}
        closable={false}
      >
        <TaskForm users={users} setOpenCreateTask={setOpenCreateTask} />
      </Drawer>
    );
  }
};

export default TaskDrawer;
