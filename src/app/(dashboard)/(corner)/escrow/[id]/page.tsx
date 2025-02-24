"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import {
  useGetProjectById,
  useGetProjectMilestones,
} from "@/tanstack/hooks/useProject";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const EscrowPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: projectMilestonesData, isPending: isLoadingProjectMilestones } =
    useGetProjectMilestones(id);

  const { data: projectData, isPending: isLoadingProject } =
    useGetProjectById(id);

  if (isLoadingProjectMilestones || isLoadingProject)
    return (
      <div className="h-[30vh] flex items-center justify-center text-muted-foreground text-sm">
        <span>Loading...</span>
      </div>
    );

  return (
    <div className="py-8">
      <h2 className="font-semibold text-subtitle-2 mb-2">
        {projectData?.data?.data?.title} Escrow
      </h2>
      <p className="text-foreground-body mb-8">
        <span className="text-gray-400">with</span>{" "}
        {projectData?.data?.data?.designer?.user?.firstName}{" "}
        {projectData?.data?.data?.designer?.user?.lastName}
      </p>
      <div className="flex items-center justify-center relative h-48  mb-8">
        <Image
          src="/img/png/pattern.png"
          alt=""
          fill
          className="object-cover object-center object-no-repeat  absolute opacity-15"
        />
        <div className="relative text-center  text-foreground-body p-2 bg-white shadow-white shadow-[0px_0px_5px_4px] rounded-md inline-block">
          <p>Escrow Balance</p>
          <h3 className="text-lg font-semibold text-foreground">
            {getCurrencySymbol(projectData?.data?.data?.currency)}
            {formatCurrencyValue(projectData?.data?.data?.escrowBalance)}
          </h3>
        </div>
      </div>
      <Separator className="border-gray-200 mb-8" />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="p-2 bg-gray-200 flex justify-between">
            <p className="text-md">Paid Out</p>
            <p className="text-md font-semibold">
              {getCurrencySymbol(projectData?.data?.data?.currency)}
              {formatCurrencyValue(projectData?.data?.data?.amountFunded || 0)}
            </p>
          </div>
          <div className="label-grid mb-4 bg-gray-100 p-2">
            {projectMilestonesData?.data?.data?.map?.((milestone) => (
              <React.Fragment key={milestone?.id}>
                <p className="truncate">
                  {milestone?.title || "Delivery Milestone"}
                </p>
                <p
                  className={cn(
                    ["FUNDED", "PAID"].includes(milestone?.transactionStatus) &&
                      "line-through"
                  )}
                >
                  {getCurrencySymbol(projectData?.data?.data?.currency)}
                  {formatCurrencyValue(milestone?.amount)}
                </p>
              </React.Fragment>
            ))}
          </div>
          <div className="label-grid gap-8">
            <p className="text-md">Escrow Balance</p>
            <p className="text-md font-semibold">
              {getCurrencySymbol(projectData?.data?.data?.currency)}
              {formatCurrencyValue(projectData?.data?.data?.escrowBalance || 0)}
            </p>
            <p className="text-md">Project Price</p>
            <p className="text-md font-semibold">
              {getCurrencySymbol(projectData?.data?.data?.currency)}
              {formatCurrencyValue(
                projectData?.data?.data?.approvedBudget || 0
              )}
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-[300px] relative pb-8">
            <Image
              src="/img/svg/invoice illustration.svg"
              alt=""
              fill
              className="object-contain object-center object-no-repeat absolute "
            />
            <Button
              variant="outline"
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
            >
              Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowPage;
