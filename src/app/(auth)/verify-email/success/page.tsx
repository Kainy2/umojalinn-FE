import { Button } from "@/components/ui/button";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

const ConfirmEmailSuccessPage = () => {
  return (
    <div className="text-center flex flex-col items-center container max-w-[550px] text-md">
      <span className="icon-wrapper success mb-4">
        <CircleCheck />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">Email Verified</h1>
      <p className="mb-6">
        Your account has been created. Welcome to{" "}
        <span className="font-semibold">Umoja Linn</span>
      </p>
      <Button fullWidth asChild>
        <Link href="/login">Continue</Link>
      </Button>
    </div>
  );
};

export default ConfirmEmailSuccessPage;
