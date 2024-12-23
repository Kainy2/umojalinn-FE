"use client";
import { useGetMe } from "@/tanstack/hooks/useUser";
import React from "react";

const WelcomeName = () => {
  const { data: me } = useGetMe();
  const name = `${me?.data?.data?.firstName || ""}`.trim();
  return (
    <h1 className="text-subtitle-1 font-bold mb-8">
      Welcome{name ? `, ${name}` : ""}
    </h1>
  );
};

export default WelcomeName;
