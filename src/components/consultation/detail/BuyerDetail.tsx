"use client";
import { useGetConsultationById } from "@/tanstack/hooks/useConsultation";
import { Skeleton } from "@/components/ui/skeleton";
import { UmojaLinnConsultation } from "@/types/consultation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ConsultationStatusBadge from "../StatusBadge";
import BookingCalendarModal from "../modals/BookingCalendarModal";
import RescheduleModal from "../modals/RescheduleModal";
import SummaryDocModal from "../modals/SummaryDocModal";
import ReportMissingModal from "../modals/ReportMissingModal";
import { FileText, Video, X, AlertTriangle, Calendar } from "lucide-react";
import ChatWindow from "@/section/dashboard/project/ChatWindow";
import { cn } from "@/lib/utils";

type BuyerConsultationDetailProps = {
  consultationId: string;
};

// ─── Project info panel ───────────────────────────────────────────────────────

const ProjectInfoPanel = ({ consultation }: { consultation: UmojaLinnConsultation }) => {
  const p = consultation.project;
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-4">
      {/* Slot info */}
      {consultation.slot && (
        <div className="flex items-start justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-2">
            <Video className="size-4 text-foreground-body" />
            <div>
              <p className="text-xs text-foreground-body">Consultation</p>
              <p className="text-sm font-medium">
                {consultation.slot.durationMins} Mins &nbsp;·&nbsp;
                {new Date(consultation.slot.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                &nbsp;·&nbsp; {consultation.slot.startTime} pm –{" "}
                {consultation.slot.endTime}PM
              </p>
              {consultation.bookedSubStatus === "RESCHEDULE_REQUESTED" && (
                <button className="text-xs text-primary underline mt-0.5">
                  Reschedule
                </button>
              )}
            </div>
          </div>
          <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0 flex items-center gap-1">
            <Calendar className="size-3" />
            Add to Calendar
          </button>
        </div>
      )}

      {/* Project metadata */}
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
          <p className="font-medium text-foreground mt-0.5 flex items-center gap-1">
            {p.deliveryCountry ?? "—"}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm">
        <p className="text-xs text-foreground-body mb-1">Project Description</p>
        <p className="text-foreground leading-relaxed">{p.description}</p>
      </div>

      {/* Inspiration images */}
      {p.inspirationImages.length > 0 && (
        <div>
          <p className="text-xs text-foreground-body mb-2">Project Inspiration</p>
          <div className="flex gap-2 flex-wrap">
            {p.inspirationImages.slice(0, 5).map((img, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0"
              >
                {img.startsWith("/mock") ? (
                  <div className="size-full bg-gray-300" />
                ) : (
                  <Image
                    src={img}
                    alt={`Inspiration ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-cover size-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary status */}
      {consultation.completedSubStatus === "AWAITING_SUMMARY" && (
        <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
          <span>Awaiting Summary</span>
          <span>⏳</span>
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

      {/* Escrow note */}
      {consultation.escrow && (
        <p className="text-xs text-foreground-body">
          Funds are held securely in escrow and released only after designer has attended the consultation.
        </p>
      )}
    </div>
  );
};

// ─── Designer sidebar ─────────────────────────────────────────────────────────

const DesignerSidebar = ({ consultation }: { consultation: UmojaLinnConsultation }) => {
  const d = consultation.designer;
  if (!d) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative size-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
          {d.profilePhotoUri ? (
            <Image src={d.profilePhotoUri} alt={`${d.firstName} ${d.lastName}`} fill className="object-cover" />
          ) : (
            <div className="size-full flex items-center justify-center text-sm font-semibold text-gray-500">
              {d.firstName[0]}{d.lastName[0]}
            </div>
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground">{d.firstName} {d.lastName}</p>
          <p className="text-xs text-foreground-body">Designer</p>
        </div>
      </div>

      {d.about && (
        <div>
          <p className="text-sm font-medium mb-1">About me</p>
          <p className="text-xs text-foreground-body leading-relaxed line-clamp-4">{d.about}</p>
          {consultation.buyerStatus === "MATCHED" && (
            <button className="text-xs text-primary mt-1">Find New Match</button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="text-xs flex flex-col gap-1 border-t pt-3">
        {d.location && (
          <div><span className="text-foreground-body">Location</span><p className="font-medium">{d.location}</p></div>
        )}
        {d.totalEarnings != null && (
          <div><span className="text-foreground-body">Total Earnings</span><p className="font-medium">${d.totalEarnings.toLocaleString()}</p></div>
        )}
        {d.totalJobs != null && (
          <div><span className="text-foreground-body">Total Jobs</span><p className="font-medium">{d.totalJobs} Jobs</p></div>
        )}
        {d.successRate != null && (
          <div><span className="text-foreground-body">Success rate</span><p className="font-medium">{d.successRate}%</p></div>
        )}
        {d.averageRating != null && (
          <div><span className="text-foreground-body">Ratings</span><p className="font-medium">{d.averageRating}</p></div>
        )}
        {d.specialistType && (
          <div><span className="text-foreground-body">Specialty</span><p className="font-medium">{d.specialistType}</p></div>
        )}
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const BuyerConsultationDetail = ({ consultationId }: BuyerConsultationDetailProps) => {
  const { data, isPending } = useGetConsultationById(consultationId);
  const consultation = data?.data?.data;

  const [activeTab, setActiveTab] = useState<"info" | "calendar" | "chat">("info");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
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
    ...(consultation.buyerStatus === "MATCHED"
      ? [{ key: "calendar" as const, label: "Calendar Preference" }]
      : []),
    ...(consultation.buyerStatus === "COMPLETED" || consultation.buyerStatus === "LIVE"
      ? [{ key: "chat" as const, label: "Chat" }]
      : []),
  ];

  const title = consultation.designer
    ? `Consultation with ${consultation.designer.firstName} ${consultation.designer.lastName}`
    : "Consult with an Experienced Fashion Designer";

  return (
    <div className="border rounded-lg bg-white overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div className="flex items-center gap-3">
          <button className="text-foreground-body hover:text-foreground">
            <X className="size-4" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          </div>
          <ConsultationStatusBadge
            buyerStatus={consultation.buyerStatus}
            isCancelled={consultation.isCancelled}
          />
        </div>

        {/* Header CTAs */}
        <div className="flex items-center gap-2">
          {consultation.buyerStatus === "LIVE" && (
            <>
              <button
                onClick={() => setReportMissingModalOpen(true)}
                className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded font-medium hover:bg-red-50"
              >
                Report Designer Missing
              </button>
              <Link
                href={`/video/${consultation.id}`}
                className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium"
              >
                Join Consultation
              </Link>
            </>
          )}
          {consultation.completedSubStatus === "SUMMARY_SUBMITTED" && (
            <button
              onClick={() => setSummaryModalOpen(true)}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium"
            >
              Review Summary
            </button>
          )}
          {consultation.completedSubStatus === "SUMMARY_ACCEPTED" && (
            <button
              onClick={() => setBookingModalOpen(true)}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium"
            >
              Book another consultation
            </button>
          )}
        </div>
      </div>

      {/* Tabs (shown for matched/completed) */}
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
            {/* Left sidebar: designer info or consultation info */}
            <div className="w-52 shrink-0">
              {consultation.buyerStatus === "MATCHING" ? (
                <div className="text-sm">
                  <p className="font-semibold mb-2">Consultation info</p>
                  <p className="text-foreground-body text-xs leading-relaxed mb-3">
                    Umoja linn will connect you with the right designer.
                  </p>
                  <p className="text-foreground-body text-xs mb-2">
                    Consult with an experienced fashion designer to discuss:
                  </p>
                  <ul className="text-xs text-foreground-body space-y-1 list-disc list-inside">
                    <li>Design ideas</li>
                    <li>Fabric choices</li>
                    <li>Fit and measurements</li>
                    <li>Budget planning</li>
                    <li>Project scope</li>
                    <li>and more</li>
                  </ul>
                </div>
              ) : (
                <DesignerSidebar consultation={consultation} />
              )}
            </div>

            {/* Right: project info or calendar */}
            <div className="flex-1 min-w-0">
              {activeTab === "calendar" ? (
                <div className="flex flex-col items-center justify-center h-48 text-foreground-body text-sm gap-3">
                  <p>Select a timeslot with your matched designer</p>
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    className="text-sm bg-primary text-white px-4 py-2 rounded font-medium"
                  >
                    Choose a time
                  </button>
                </div>
              ) : (
                <ProjectInfoPanel consultation={consultation} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!consultation.isCancelled && (
        <div className="border-t px-5 py-3 flex items-center justify-between">
          <p className="text-xs text-foreground-body flex items-center gap-1">
            {consultation.buyerStatus === "BOOKED" ? (
              <>
                <AlertTriangle className="size-3 text-amber-500" />
                Consultations cannot be rescheduled or cancelled less than 48 hours before the scheduled time.
              </>
            ) : consultation.buyerStatus === "MATCHING" ? (
              <>
                Consultation fees vary by designer and typically range from [default currency min] to [default currency max].
                The final fee will be displayed once you&apos;ve been matched.
              </>
            ) : (
              <>
                <span className="text-amber-600">▲</span>
                Funds are held securely in escrow and released only after designer has attended the consultation.
              </>
            )}
          </p>
          {consultation.buyerStatus !== "MATCHING" &&
            consultation.buyerStatus !== "LIVE" &&
            consultation.buyerStatus !== "COMPLETED" && (
              <button className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded font-medium hover:bg-gray-50">
                Cancel Consultation
              </button>
            )}
        </div>
      )}

      {/* Modals */}
      <BookingCalendarModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        consultation={consultation}
      />
      <RescheduleModal
        open={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        consultation={consultation}
        role="BUYER"
      />
      <SummaryDocModal
        open={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        consultation={consultation}
        role="BUYER"
      />
      <ReportMissingModal
        open={reportMissingModalOpen}
        onClose={() => setReportMissingModalOpen(false)}
        consultation={consultation}
        reportTarget="DESIGNER"
      />
    </div>
  );
};

export default BuyerConsultationDetail;
