"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

const NextAuthProvider = ({ children }: LayoutProps) => {
  return (
    <SessionProvider
      baseUrl={
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/auth`
          : undefined
      }
    >
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
