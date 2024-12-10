"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

const NextAuthProvider = ({ children }: LayoutProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
