"use client";
import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import UserForm from "@/components/dashboard/user-form";
import { updateTaskTimer } from "@/lib/api/requests";

type UserDrawerProps = {
  openCreateUser: boolean;
  setOpenCreateUser: (val: boolean) => void;
};

const UserDrawer: React.FC<UserDrawerProps> = (props) => {
  const { openCreateUser, setOpenCreateUser } = props;

  return (
    <Drawer
      open={openCreateUser}
      onClose={() => setOpenCreateUser(false)}
      closable={false}
    >
      <UserForm setOpenCreateTask={setOpenCreateUser} />
    </Drawer>
  );
};

export default UserDrawer;
