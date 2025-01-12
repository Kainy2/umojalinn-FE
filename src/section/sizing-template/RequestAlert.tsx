"use client";
import { Button } from "@/components/ui/button";
import NotificationBox from "@/icons/NotificationBox";
import { cn } from "@/lib/utils";
import { useGetBidById } from "@/tanstack/hooks/useBid";
import { useRequestSizingTemplateInProject } from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useParams } from "next/navigation";
import React from "react";

const RequestSizingTemplateAlert = () => {
  const { id } = useParams<{ id: string }>();
  const { data: bidData } = useGetBidById(id);

  const { data: me } = useGetMe();

  const bid = bidData?.data?.data;

  const project = bid?.project;

  const {
    mutate: requestSizingTemplate,
    isPending,
    isSuccess,
  } = useRequestSizingTemplateInProject();

  const requestSuccessfull = isSuccess || bid?.sizingTemplateRequested;

  if (
    bid &&
    project?.id &&
    !project?.sizingTemplateId &&
    me?.data?.data?.designerProfile?.id === bid?.designerId
  ) {
    return (
      <div className="flex flex-col lg:flex-row p-3 border rounded-md gap-2 border-yellow-200 bg-yellow-50 lg:items-center mb-8">
        <span className="size-8 shrink-0 rounded-full bg-yellow-100 text-error flex items-center justify-center">
          <NotificationBox />
        </span>
        <div className="flex flex-1 flex-col lg:flex-row text-sm gap-2 text-error">
          <h3 className="font-bold text-error-700">Missing Sizing Template!</h3>
          <p className="">
            This project doesn&apos;t include a sizing template. Please request
            to help complete the bidding process
          </p>
        </div>
        <Button
          className={cn(
            "rounded-md",
            requestSuccessfull ? "bg-yellow-200" : "bg-error"
          )}
          disabled={requestSuccessfull || isPending}
          onClick={() => requestSizingTemplate(project?.id)}
        >
          {requestSuccessfull ? "Requested" : "Request"}
        </Button>
      </div>
    );
  }

  return null;
};

export default RequestSizingTemplateAlert;
