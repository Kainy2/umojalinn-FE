import { cn } from "@/lib/utils";
import { UmojaLinnConsultation } from "@/types/consultation";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

type EscrowAlertProps = {
  consultation: UmojaLinnConsultation;
  role: "BUYER" | "DESIGNER";
  className?: string;
};

const formatAmount = (amount: number, currency: string) => {
  const symbols: Record<string, string> = {
    NAIRA: "₦",
    USD: "$",
    EURO: "€",
    GBP: "£",
    CAD: "CA$",
  };
  return `${symbols[currency] ?? ""}${amount.toLocaleString()}`;
};

const EscrowAlert = ({ consultation, role, className }: EscrowAlertProps) => {
  const { escrow, hasOpenDispute, bookedSubStatus, completedSubStatus, isCancelled } = consultation;

  if (isCancelled) {
    const refunded = consultation.refundedAmount;
    const cancelledBy = consultation.cancelledBy;
    const msg = refunded
      ? `${cancelledBy === "DESIGNER" ? "[Username]" : "[Username]"} cancelled · Refunded amount: ${formatAmount(refunded, consultation.currency)}`
      : `[Username] cancelled · No Payment was taken`;
    return (
      <div className={cn("flex items-start gap-1.5 text-xs text-amber-700", className)}>
        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
        <span>{msg}</span>
      </div>
    );
  }

  if (!escrow) return null;

  const amountStr = formatAmount(escrow.heldAmount || escrow.amount, escrow.currency);

  // Dispute state
  if (hasOpenDispute) {
    return (
      <div className={cn("flex items-start gap-1.5 text-xs text-red-600", className)}>
        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
        <span>
          {amountStr} held in escrow due to an open{" "}
          <Link href="#" className="underline font-medium">
            Dispute
          </Link>{" "}
          →
        </span>
      </div>
    );
  }

  // No show by both
  if (bookedSubStatus === "NO_SHOW") {
    return (
      <div className={cn("flex items-start gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded", className)}>
        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
        <span>
          {amountStr} held in escrow · Neither you nor [user first name] joined the consultation
        </span>
      </div>
    );
  }

  // Released — awaiting summary
  if (
    completedSubStatus === "AWAITING_SUMMARY" &&
    escrow.status === "RELEASED"
  ) {
    return (
      <div className={cn("flex items-start gap-1.5 text-xs text-amber-700", className)}>
        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
        <span>
          {formatAmount(escrow.releasedAmount, escrow.currency)} Released · Awaiting Summary ⏳
        </span>
      </div>
    );
  }

  // Released — summary submitted
  if (completedSubStatus === "SUMMARY_SUBMITTED" && escrow.status === "RELEASED") {
    return (
      <div className={cn("flex items-start gap-1.5 text-xs text-amber-700", className)}>
        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
        <span>
          {formatAmount(escrow.releasedAmount, escrow.currency)} Released · Summary Submitted
        </span>
      </div>
    );
  }

  // Released (accepted)
  if (escrow.status === "RELEASED" && escrow.releasedAmount > 0) {
    return (
      <div className={cn("flex items-start gap-1.5 text-xs text-green-700", className)}>
        <AlertTriangle className="size-3 shrink-0 mt-0.5" />
        <span>{formatAmount(escrow.releasedAmount, escrow.currency)} Released</span>
      </div>
    );
  }

  // Held / funded — default message differs by role
  const designerMsg = role === "DESIGNER"
    ? `${amountStr} held in escrow · Released after you complete Consultation.`
    : `${amountStr} held in escrow · Released after designer completes Consultation.`;

  return (
    <div className={cn("flex items-start gap-1.5 text-xs text-amber-700", className)}>
      <AlertTriangle className="size-3 shrink-0 mt-0.5" />
      <span>{designerMsg}</span>
    </div>
  );
};

export default EscrowAlert;
