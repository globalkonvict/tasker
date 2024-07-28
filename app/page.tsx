"use client";
import { Spin } from "antd";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import pb from "@/lib/pocketbase/pocketbase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.push("/dashboard/tasks");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return <Spin fullscreen />;
}
