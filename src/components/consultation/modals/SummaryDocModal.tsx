"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAcceptSummary,
  useRejectSummary,
  useSubmitSummary,
} from "@/tanstack/hooks/useConsultation";
import { UmojaLinnConsultation } from "@/types/consultation";
import { UmojaLinnUserRole } from "@/types/user";
import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type SummaryDocModalProps = {
  open: boolean;
  onClose: () => void;
  consultation: UmojaLinnConsultation;
  role: UmojaLinnUserRole;
};

const SummaryDocModal = ({ open, onClose, consultation, role }: SummaryDocModalProps) => {
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const { mutate: submitSummary, isPending: submitting } = useSubmitSummary({
    onSuccess: () => {
      toast({ title: "Summary submitted!" });
      onClose();
    },
  });

  const { mutate: acceptSummary, isPending: accepting } = useAcceptSummary({
    onSuccess: () => {
      toast({ title: "Summary accepted!" });
      onClose();
    },
  });

  const { mutate: rejectSummary, isPending: rejecting } = useRejectSummary({
    onSuccess: () => {
      toast({ title: "Summary rejected." });
      onClose();
      setRejectionReason("");
      setShowRejectForm(false);
    },
  });

  const summary = consultation.summary;

  // ── Designer: submit summary ────────────────────────────────────────────────
  if (role === "DESIGNER") {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Summary Document</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-foreground-body">
              Upload a summary document for the buyer. This will be shared with the buyer for review.
            </p>

            {/* Upload area */}
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-3 text-foreground-body cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="size-8 text-gray-400" />
              <p className="text-sm font-medium">Click to upload or drag & drop</p>
              <p className="text-xs">PDF, DOC, DOCX up to 10MB</p>
            </div>

            {/* If summary already submitted */}
            {summary?.docUrl && (
              <div className="border rounded-lg p-3 flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">{summary.docName}</p>
                  <p className="text-xs text-foreground-body">{summary.docSizeKb} KB</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600">
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={() =>
                  submitSummary({
                    consultationId: consultation.id,
                    docUrl: "/mock/summary.pdf",
                    docName: "Consultation Summary.pdf",
                    docSizeKb: 200,
                  })
                }
                className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Summary"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Buyer: review summary ───────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review Summary Document</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground-body">
            {consultation.designer?.firstName} has submitted a consultation summary for your review.
          </p>

          {summary?.docUrl && (
            <div className="border rounded-lg p-3 flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">{summary.docName ?? "Summary.pdf"}</p>
                <p className="text-xs text-foreground-body">{summary.docSizeKb} KB</p>
              </div>
              <a
                href={summary.docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline"
              >
                View
              </a>
            </div>
          )}

          {showRejectForm ? (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Reason for rejection</label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder="Please explain why you are rejecting the summary..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowRejectForm(false)} className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600">
                  Back
                </button>
                <button
                  disabled={!rejectionReason.trim() || rejecting}
                  onClick={() => rejectSummary(consultation.id)}
                  className="text-sm bg-red-600 text-white px-5 py-2 rounded font-medium disabled:opacity-50"
                >
                  {rejecting ? "Rejecting..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectForm(true)}
                className="text-sm border border-red-300 text-red-600 px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                disabled={accepting}
                onClick={() => acceptSummary(consultation.id)}
                className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
              >
                {accepting ? "Accepting..." : "Accept Summary"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDocModal;
