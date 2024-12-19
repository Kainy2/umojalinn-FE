"use client";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useSession } from "next-auth/react";
import React from "react";

const WelcomeName = () => {
  const { data: session } = useSession();
  const { data: me } = useGetMe({ enabled: !!session?.user });
  const name = `${me?.data?.data?.firstName}`.trim();
  return (
    <h1 className="text-lg font-bold mb-8">Welcome{name && `, ${name}`}</h1>
  );
};

export default WelcomeName;
