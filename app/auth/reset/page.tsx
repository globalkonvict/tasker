"use client";
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import withBasicLayout from "@/components/layouts/basic-layout/basic-layout";

const Reset = () => {
  return (
    <AuthForm type="reset" onSubmit={async (values) => {}} title="Reset" />
  );
};

export default withBasicLayout(Reset);
