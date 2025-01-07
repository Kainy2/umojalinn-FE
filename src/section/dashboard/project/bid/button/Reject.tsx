"use client";
import VerifyDialog from "@/components/custom/dialog/Verify";
import TextAreaField from "@/components/custom/TextAreaField";
import { Button } from "@/components/ui/button";
import { useAcceptOrRejectBid } from "@/tanstack/hooks/useBid";
import React, { useState } from "react";
type RejectButtonProps = { bidId: string };

const RejectButton = (props: RejectButtonProps) => {
  const [reason, setReason] = useState<string>("");
  const { mutate } = useAcceptOrRejectBid(props.bidId);
  return (
    <VerifyDialog
      title="Rational"
      description="Please provide the rationale for your decision to decline the designer's proposal"
      confirmText="Reject proposal"
      hideCancel
      fullWidthActions
      additionalComponent={
        <TextAreaField
          label="Specify your reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      }
      onConfirm={() =>
        mutate({
          status: "REJECTED",
          rejectionReason: reason,
        })
      }
      disableActions={!reason}
    >
      <Button variant="outline" className="border-error text-error">
        Reject proposal
      </Button>
    </VerifyDialog>
  );
};

export default RejectButton;
