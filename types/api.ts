import type { ParamsType } from "@ant-design/pro-components";
import exp from "constants";

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  created: string;
  updated: string;
  timer: number;
  assignedTo: string;
  startTime: string | null;
  expand: {
    assignedTo: {
      id: string;
      name: string;
      email: string;
      username: string;
    };
  };
  owner: string;
};

export type TaskSearchParam = {
  pageSize?: number;
  current?: number;
} & TaskItem &
  ParamsType;

export type Comment = {
  todo: string;
  user: string;
  content: React.ReactNode;
  created?: string;
  expand?: {
    user?: {
      id: string;
      name: string;
      email: string;
      username: string;
      avatar: string;
    };
    todo?: TaskItem;
  };
};

export type User = {
  id: string;
  name: string;
  role: "admin" | "developer";
  email: string;
  username: string;
  avatar?: string;
  created: string;
  updated: string;
};

export type UserSearchParam = {
  pageSize?: number;
  current?: number;
} & User &
  ParamsType;