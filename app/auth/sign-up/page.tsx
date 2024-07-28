"use client";
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import pb from "@/lib/pocketbase/pocketbase";
import withBasicLayout from "@/components/layouts/basic-layout/basic-layout";

const SignUp = () => {
  const handleSignUp = async (values: any) => {
    const user = await pb.collection("users").create({
      username: values.username,
      email: values.email,
      password: values.password,
      passwordConfirm: values.confirmPassword,
      name: values.name,
      role: "developer",
    });
    return user;
  };

  return <AuthForm type="signup" onSubmit={handleSignUp} title="Sign Up" />;
};

export default withBasicLayout(SignUp);
