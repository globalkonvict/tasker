import React, { CSSProperties } from "react";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

type StatusTagProps = {
  status: "pending" | "in-progress" | "completed";
  style?: CSSProperties
};

const StatusTag: React.FC<StatusTagProps> = ({ status, style = {} }) => {
  const statusConfig = {
    "in-progress": [ClockCircleOutlined, "processing"],
    completed: [CheckCircleOutlined, "success"],
    pending: [ExclamationCircleOutlined, "warning"],
  };

  const StatusIcon = statusConfig[status][0];
  const statusColor = statusConfig[status][1];
  const statusText = status[0].toUpperCase() + status.slice(1);

  return (
    <Tag icon={<StatusIcon />} color={statusColor as "warning"} style={style}>
      {statusText}
    </Tag>
  );
};

export default StatusTag;
