"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogProps, DialogTitle } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import TextAreaField from "../input/TextAreaField";
import { useApproveOrRejectMilestone } from "@/tanstack/hooks/useProject";

const RejectMilestoneDialog = (props: DialogProps & { id: string }) => {
  const [open, setOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { mutate, isPending } = useApproveOrRejectMilestone(props.id, {
    onSuccess() {
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold">Rationale</DialogTitle>
          <DialogDescription>
            Please provide the rationale for your decision to decline the
            designer&apos;s milestone
          </DialogDescription>
        </DialogHeader>
        <TextAreaField
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          label="Specify your reason"
        />
        <DialogFooter>
          <Button
            fullWidth
            type="button"
            onClick={() =>
              mutate({
                status: "REJECTED",
                rejectionReason,
              })
            }
            disabled={isPending || !rejectionReason?.trim?.()}
          >
            Reject milestone
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectMilestoneDialog;
