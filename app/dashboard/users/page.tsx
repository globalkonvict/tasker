"use client";
import { ProTable } from "@ant-design/pro-components";
import generateColumns from "./generate-columns";
import { fetchUsers } from "@/lib/api/requests";
import withDashLayout from "@/components/layouts/dashboard-layout/dashboard-layout";

const Page = () => {
  return (
    <>
      <ProTable
        columns={generateColumns({})}
        scroll={{ x: 1200 }}
        cardBordered
        request={fetchUsers}
        rowKey="id"
        form={{
          syncToUrl: true,
        }}
        pagination={{
          pageSize: 5,
        }}
        dateFormatter="string"
        headerTitle="Users"
      />
    </>
  );
};

export default withDashLayout(Page);
