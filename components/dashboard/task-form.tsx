"use client";
import React from "react";

import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";
import pb from "@/lib/pocketbase/pocketbase";

import type { TaskItem } from "@/types/api";
import dayjs from "dayjs";

type TaskFormProps = {
  users: { label: string; value: string }[];
  setOpenCreateTask: (v: boolean) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ users, setOpenCreateTask }) => {
  const [form] = ProForm.useForm();
  const handleSubmit = async (values: TaskItem) => {
    try {
      await pb.collection("todos").create({
        title: values.title,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
        timer: values.timer,
        assignedTo: values.assignedTo,
      });
      message.success("Todo created successfully");
      form.resetFields();
      setOpenCreateTask(false);
    } catch (error) {
      message.error("Failed to create todo");
    }
  };

  return (
    <ProForm
      form={form}
      onFinish={handleSubmit}
      layout="vertical"
      submitter={{
        searchConfig: {
          submitText: "Create Todo",
        },
      }}
    >
      <ProFormText
        name="title"
        label="Title"
        placeholder="Enter the title"
        rules={[{ required: true, message: "Title is required" }]}
      />
      <ProFormTextArea
        name="description"
        label="Description"
        placeholder="Enter the description"
        rules={[{ required: true, message: "Description is required" }]}
      />
      <ProFormSelect
        name="status"
        label="Status"
        options={[
          { label: "Pending", value: "pending" },
          { label: "In Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
        ]}
        placeholder="Select the status"
        rules={[{ required: true, message: "Status is required" }]}
        initialValue={"pending"}
      />
      <ProForm.Group>
        <ProFormDatePicker
          name="startDate"
          label="Start Date"
          placeholder="Select the start date"
          rules={[
            { required: true, message: "Start Date is required" },
            {
              validator: async (_, value) => {
                if (value && form.getFieldValue("endDate")) {
                  if (
                    dayjs(value).isAfter(dayjs(form.getFieldValue("endDate")))
                  ) {
                    return Promise.reject("Start Date must be before End Date");
                  }
                }
              },
            },
          ]}
          fieldProps={{
            disabledDate: (current) => {
              return current && current < dayjs().startOf("day");
            },
          }}
        />
        <ProFormDatePicker
          name="endDate"
          label="End Date"
          placeholder="Select the end date"
          rules={[
            { required: true, message: "End Date is required" },
            {
              validator: async (_, value) => {
                if (value && form.getFieldValue("startDate")) {
                  if (
                    dayjs(value).isBefore(
                      dayjs(form.getFieldValue("startDate"))
                    )
                  ) {
                    return Promise.reject("End Date must be after Start Date");
                  }
                }
              },
            },
          ]}
          fieldProps={{
            disabledDate: (current) => {
              return current && current < dayjs().startOf("day");
            },
          }}
        />
      </ProForm.Group>
      <ProFormDigit
        name="timer"
        label="Timer"
        placeholder="Enter the timer (default 0)"
        min={0}
        initialValue={0}
      />
      <ProFormSelect
        name="assignedTo"
        label="Assigned To"
        options={users}
        placeholder="Select the user"
        rules={[{ required: true, message: "Assigned To is required" }]}
        fieldProps={{
          showSearch: true,
        }}
      />
    </ProForm>
  );
};

export default TaskForm;
