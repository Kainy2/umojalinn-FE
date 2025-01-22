import MilestoneProgress from "@/components/custom/milestone/Progress";
import { Button } from "@/components/ui/button";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { cn } from "@/lib/utils";
import { UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";
import { CircleAlert, MoreVertical } from "lucide-react";
import React from "react";

type EscrowCardProps = {
  milestones: UmojaLinnMilestone[];
  paidOut: number;
  escrowBalance: number;
  currency?: UmojaLinnProject["currency"];
  projectPrice: number;
};

const EscrowCard = (props: EscrowCardProps) => {
  return (
    <div className="flex flex-col gap-4 bg-gray-50 rounded-md p-4 py-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-subtitle-2 font-bold">Project Escrow</h2>
        <button>
          <MoreVertical className="text-primary" />
        </button>
      </div>
      <MilestoneProgress
        total={props?.milestones?.length}
        value={
          props?.milestones?.filter?.(
            (milestone) => milestone?.status !== "IN_ACTIVE"
          )?.length
        }
      />
      <div className="label-grid mb-4">
        <p className="text-md">Paid Out</p>
        <p className="text-md font-semibold">
          {getCurrencySymbol(props?.currency)}
          {formatCurrencyValue(props.paidOut)}
        </p>
        {props.milestones?.map?.((milestone) => (
          <React.Fragment key={milestone.id}>
            <p className="truncate">
              {milestone?.title || "Delivery Milestone"}
            </p>
            <p
              className={cn(
                ["FUNDED", "PAID"].includes(milestone?.transactionStatus) &&
                  "line-through"
              )}
            >
              {getCurrencySymbol(props?.currency)}
              {formatCurrencyValue(milestone?.amount)}
            </p>
          </React.Fragment>
        ))}
      </div>
      <div className="label-grid gap-8">
        <p className="text-md">Escrow Balance</p>
        <p className="text-md font-semibold">
          {getCurrencySymbol(props?.currency)}
          {formatCurrencyValue(props.escrowBalance)}
        </p>
        <p className="text-md">Project Price</p>
        <p className="text-md font-semibold">
          {getCurrencySymbol(props?.currency)}
          {formatCurrencyValue(props.projectPrice)}
        </p>
      </div>
      <Button variant="outline" fullWidth>
        Invoice
      </Button>
      <div className="flex gap-2 items-center">
        <span className="h-6 w-6 shrink-0 bg-error-100 rounded-full flex items-center justify-center text-error">
          <CircleAlert className="h-4 w-4" />
        </span>
        <span className="text-gray-500 text-xs flex-1">
          Upon milestone approval, funds are deposited into the designer&apos;s
          wallet.
        </span>
      </div>
    </div>
  );
};

export default EscrowCard;
