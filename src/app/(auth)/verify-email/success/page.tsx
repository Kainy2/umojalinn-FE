"use server";
import { Button } from "@/components/ui/button";
import { PageProps } from "@/types/util";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

const ConfirmEmailSuccessPage = async (
  props: PageProps<unknown, { inviterTag?: string }>
) => {
  const searchParams = (await props?.searchParams) || {};

  return (
    <div className="text-center flex flex-col items-center container max-w-[550px] text-md">
      <span className="icon-wrapper success mb-4">
        <CircleCheck />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">Email Verified</h1>
      <p className="mb-6">
        Your account has been created, click continue to login. Welcome to{" "}
        <span className="font-semibold">Umoja linn</span>
      </p>
      <Button fullWidth asChild>
        <Link
          href={`/login${
            searchParams?.inviterTag
              ? `?inviterTag=${searchParams?.inviterTag}`
              : ""
          }`}
        >
          Continue
        </Link>
      </Button>
    </div>
  );
};

export default ConfirmEmailSuccessPage;
