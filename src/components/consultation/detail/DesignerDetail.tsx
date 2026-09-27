"use client";
import { useGetConsultationById, useAcceptConsultation, useRejectConsultation } from "@/tanstack/hooks/useConsultation";
import { Skeleton } from "@/components/ui/skeleton";
import { UmojaLinnConsultation } from "@/types/consultation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ConsultationStatusBadge from "../StatusBadge";
import RescheduleModal from "../modals/RescheduleModal";
import SummaryDocModal from "../modals/SummaryDocModal";
import ReportMissingModal from "../modals/ReportMissingModal";
import { FileText, Video, X, Calendar } from "lucide-react";
import ChatWindow from "@/section/dashboard/project/ChatWindow";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type DesignerConsultationDetailProps = {
  consultationId: string;
};

// ─── Project info panel (shared) ─────────────────────────────────────────────

const ProjectInfoPanel = ({ consultation }: { consultation: UmojaLinnConsultation }) => {
  const p = consultation.project;
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-4">
      {/* Slot */}
      {consultation.slot && (
        <div className="flex items-start justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <Video className="size-4 text-foreground-body" />
            <div>
              <p className="text-xs text-foreground-body">Consultation</p>
              <p className="text-sm font-medium">
                {consultation.slot.durationMins} Mins &nbsp;·&nbsp;
                {new Date(consultation.slot.date).toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                })}{" "}
                &nbsp;·&nbsp; {consultation.slot.startTime} pm – {consultation.slot.endTime}PM
              </p>
            </div>
          </div>
          <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium flex items-center gap-1">
            <Calendar className="size-3" />
            Add to Calendar
          </button>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border-b pb-4">
        <div>
          <p className="text-foreground-body">Project Title</p>
          <p className="font-medium text-foreground mt-0.5">{p.title}</p>
          {p.gender && <p className="text-foreground-body">{p.gender}</p>}
        </div>
        <div>
          <p className="text-foreground-body">Project Timeline</p>
          <p className="font-medium text-foreground mt-0.5">
            {p.timeline
              ? `${new Date(p.timeline.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - ${new Date(p.timeline.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-foreground-body">Project Budget</p>
          <p className="font-medium text-foreground mt-0.5">
            {p.budget ? `$${p.budget.min} - $${p.budget.max}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-foreground-body">Delivery Country</p>
          <p className="font-medium text-foreground mt-0.5">{p.deliveryCountry ?? "—"}</p>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm">
        <p className="text-xs text-foreground-body mb-1">Project Description</p>
        <p className="text-foreground leading-relaxed">{p.description}</p>
      </div>

      {/* Inspiration */}
      {p.inspirationImages.length > 0 && (
        <div>
          <p className="text-xs text-foreground-body mb-2">Project Inspiration</p>
          <div className="flex gap-2 flex-wrap">
            {p.inspirationImages.slice(0, 5).map((img, i) => (
              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                {img.startsWith("/mock") ? (
                  <div className="size-full bg-gray-300" />
                ) : (
                  <Image src={img} alt={`Inspiration ${i + 1}`} width={80} height={80} className="object-cover size-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary status */}
      {consultation.completedSubStatus === "AWAITING_SUMMARY" && (
        <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
          <span>Awaiting Summary</span><span>⏳</span>
        </div>
      )}

      {/* Invoice */}
      {consultation.invoiceUrl && (
        <div className="border rounded-lg p-3 flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Consultation invoice.pdf</p>
            <p className="text-xs text-foreground-body">200 KB</p>
          </div>
        </div>
      )}

      {consultation.escrow && (
        <p className="text-xs text-foreground-body">
          Funds are held securely in escrow and released only after you complete the consultation.
        </p>
      )}
    </div>
  );
};

// ─── Buyer sidebar ────────────────────────────────────────────────────────────

const BuyerSidebar = ({ consultation }: { consultation: UmojaLinnConsultation }) => {
  const b = consultation.buyer;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative size-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
          {b.profilePhotoUri ? (
            <Image src={b.profilePhotoUri} alt={`${b.firstName} ${b.lastName}`} fill className="object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center text-sm font-semibold text-gray-500">
              {b.firstName[0]}{b.lastName[0]}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{b.firstName} {b.lastName}</p>
          <p className="text-xs text-foreground-body">Buyer</p>
        </div>
      </div>
    </div>
  );
};

// ─── Assigned state: accept/reject ───────────────────────────────────────────

const AssignedActions = ({ consultation }: { consultation: UmojaLinnConsultation }) => {
  const { toast } = useToast();
  const { mutate: accept, isPending: accepting } = useAcceptConsultation({
    onSuccess: () => toast({ title: "Consultation accepted!" }),
  });
  const { mutate: reject, isPending: rejecting } = useRejectConsultation({
    onSuccess: () => toast({ title: "Consultation rejected." }),
  });

  if (consultation.buyerStatus === "MATCHED") {
    // Designer already accepted, waiting for buyer to book
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
        You&apos;ve accepted this consultation request. Waiting for the client to schedule their preferred timeslot.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-foreground-body">
        Umoja Linn has assigned you this consultation request. Do you want to accept or reject it?
      </p>
      <div className="flex gap-3">
        <button
          disabled={rejecting}
          onClick={() => reject(consultation.id)}
          className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded font-medium text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {rejecting ? "Rejecting..." : "Reject"}
        </button>
        <button
          disabled={accepting}
          onClick={() => accept(consultation.id)}
          className="flex-1 bg-primary text-white py-2.5 rounded font-medium text-sm disabled:opacity-50"
        >
          {accepting ? "Accepting..." : "Accept"}
        </button>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const DesignerConsultationDetail = ({ consultationId }: DesignerConsultationDetailProps) => {
  const { data, isPending } = useGetConsultationById(consultationId);
  const consultation = data?.data?.data;

  const [activeTab, setActiveTab] = useState<"info" | "chat">("info");
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [reportMissingModalOpen, setReportMissingModalOpen] = useState(false);

  if (isPending) {
    return (
      <div className="border rounded-lg p-6 flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!consultation) return null;

  const tabs = [
    { key: "info" as const, label: "My details" },
    ...(consultation.designerStatus === "COMPLETED" || consultation.designerStatus === "LIVE"
      ? [{ key: "chat" as const, label: "Chat" }]
      : []),
  ];

  const buyerName = `${consultation.buyer.firstName} ${consultation.buyer.lastName}`;
  const title = `Consultation with ${buyerName}`;

  return (
    <div className="border rounded-lg bg-white overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <button className="text-foreground-body hover:text-foreground">
            <X className="size-4" />
          </button>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <ConsultationStatusBadge
            designerStatus={consultation.designerStatus}
            isCancelled={consultation.isCancelled}
          />
        </div>

        {/* Header CTAs */}
        <div className="flex items-center gap-2">
          {consultation.designerStatus === "LIVE" && (
            <>
              <button
                onClick={() => setReportMissingModalOpen(true)}
                className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded font-medium hover:bg-red-50"
              >
                Report Buyer Missing
              </button>
              <Link
                href={`/video/${consultation.id}`}
                className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium"
              >
                Join Consultation
              </Link>
            </>
          )}
          {consultation.designerStatus === "AWAITING_SUMMARY" && (
            <button
              onClick={() => setSummaryModalOpen(true)}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium"
            >
              Add Summary
            </button>
          )}
          {consultation.designerStatus === "BOOKED" && (
            <button
              onClick={() => setRescheduleModalOpen(true)}
              className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded font-medium hover:bg-gray-50"
            >
              Reschedule
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex border-b px-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "py-3 px-4 text-sm border-b-2 -mb-px transition-colors",
                activeTab === tab.key
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-foreground-body hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "chat" && consultation.chatChannelId ? (
          <ChatWindow projectId={consultation.chatChannelId} />
        ) : (
          <div className="flex gap-5">
            {/* Left sidebar */}
            <div className="w-52 shrink-0">
              <BuyerSidebar consultation={consultation} />
            </div>

            {/* Right: content based on status */}
            <div className="flex-1 min-w-0">
              {(consultation.designerStatus === "ASSIGNED") ? (
                <AssignedActions consultation={consultation} />
              ) : (
                <ProjectInfoPanel consultation={consultation} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!consultation.isCancelled && consultation.designerStatus !== "ASSIGNED" && (
        <div className="border-t px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-foreground-body flex items-center gap-1">
            <span className="text-amber-600">▲</span>
            {consultation.designerStatus === "BOOKED"
              ? "Consultations cannot be rescheduled or cancelled less than 48 hours before the scheduled time."
              : "Funds are held securely in escrow and released only after you complete the consultation."}
          </p>
        </div>
      )}

      {/* Modals */}
      <RescheduleModal
        open={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        consultation={consultation}
        role="DESIGNER"
      />
      <SummaryDocModal
        open={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        consultation={consultation}
        role="DESIGNER"
      />
      <ReportMissingModal
        open={reportMissingModalOpen}
        onClose={() => setReportMissingModalOpen(false)}
        consultation={consultation}
        reportTarget="BUYER"
      />
    </div>
  );
};

export default DesignerConsultationDetail;
