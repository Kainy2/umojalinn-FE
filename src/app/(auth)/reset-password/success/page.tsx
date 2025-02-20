"use server";
import { Button } from "@/components/ui/button";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

const PasswordResetSuccessPage = () => {
  return (
    <div className="text-center flex flex-col items-center container max-w-[550px] text-md">
      <span className="icon-wrapper success mb-4">
        <CircleCheck />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">Password Reset</h1>
      <p className="mb-6 text-foreground-body">
        Your new password must be different to previously used passwords.{" "}
      </p>
      <Button fullWidth asChild>
        <Link href="/login">Sign in</Link>
      </Button>
    </div>
  );
};

export default PasswordResetSuccessPage;
