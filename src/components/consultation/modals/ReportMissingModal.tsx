"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReportMissing } from "@/tanstack/hooks/useConsultation";
import { UmojaLinnConsultation } from "@/types/consultation";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ReportMissingModalProps = {
  open: boolean;
  onClose: () => void;
  consultation: UmojaLinnConsultation;
  reportTarget: "DESIGNER" | "BUYER";
};

const ReportMissingModal = ({
  open,
  onClose,
  consultation,
  reportTarget,
}: ReportMissingModalProps) => {
  const { toast } = useToast();
  const { mutate: reportMissing, isPending } = useReportMissing({
    onSuccess: () => {
      toast({
        title: `${reportTarget === "DESIGNER" ? "Designer" : "Buyer"} reported as missing.`,
        description: "Our team has been notified and will investigate.",
      });
      onClose();
    },
  });

  const targetName =
    reportTarget === "DESIGNER"
      ? consultation.designer
        ? `${consultation.designer.firstName} ${consultation.designer.lastName}`
        : "the designer"
      : `${consultation.buyer.firstName} ${consultation.buyer.lastName}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-500" />
            Report {reportTarget === "DESIGNER" ? "Designer" : "Buyer"} Missing
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground-body">
            Are you sure you want to report <strong>{targetName}</strong> as
            missing from the consultation session?
          </p>
          <p className="text-xs text-foreground-body bg-amber-50 border border-amber-200 rounded p-3">
            If the {reportTarget === "DESIGNER" ? "designer" : "buyer"} has been
            absent for more than 10 minutes, funds in escrow will be held pending
            review.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              onClick={() => reportMissing(consultation.id)}
              className="text-sm bg-red-600 text-white px-5 py-2 rounded font-medium disabled:opacity-50"
            >
              {isPending ? "Reporting..." : "Report Missing"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportMissingModal;
