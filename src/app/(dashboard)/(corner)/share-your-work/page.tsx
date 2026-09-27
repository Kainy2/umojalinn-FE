"use client";
import ShareYourWorkForm from "@/section/form/shared-work/ShareYourWork";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ShareYourWorkPage = () => {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }
    >
      <ShareYourWorkForm />
    </Suspense>
  );
};

export default ShareYourWorkPage;
