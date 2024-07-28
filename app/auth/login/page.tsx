"use client";
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import pb from "@/lib/pocketbase/pocketbase";
import withBasicLayout from "@/components/layouts/basic-layout/basic-layout";

const Login = () => {
  const handleLogin = async (values: any) => {
    return await pb
      .collection("users")
      .authWithPassword(values.username, values.password);
  };

  return <AuthForm type="login" onSubmit={handleLogin} title="Login" />;
};

export default withBasicLayout(Login);
