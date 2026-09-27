"use client";
import { cn } from "@/lib/utils";
import { UmojaLinnConsultation } from "@/types/consultation";
import { UmojaLinnUserRole } from "@/types/user";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import EscrowAlert from "./EscrowAlert";
import ConsultationStatusBadge from "./StatusBadge";

type ConsultationCardProps = {
  consultation: UmojaLinnConsultation;
  role: UmojaLinnUserRole;
  baseHref: string; // e.g. "/consultations" or "/jobs/consultations"
};


const ConsultationCard = ({ consultation, role, baseHref }: ConsultationCardProps) => {
  const params = useParams<{ id: string }>();
  const isActive = params?.id === consultation.id;

  const counterpart =
    role === "BUYER" ? consultation.designer : consultation.buyer;

  const slot = consultation.slot;

  const getCtaButton = () => {
    if (consultation.isCancelled) return null;

    if (role === "BUYER") {
      switch (consultation.buyerStatus) {
        case "MATCHED":
          return (
            <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
              Schedule
            </button>
          );
        case "BOOKED":
          if (consultation.bookedSubStatus === "RESCHEDULE_REQUESTED") {
            return (
              <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
                Reschedule
              </button>
            );
          }
          if (consultation.bookedSubStatus === "NO_SHOW") {
            return (
              <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
                Reschedule
              </button>
            );
          }
          return null;
        case "LIVE":
          return (
            <Link
              href={`/video/${consultation.id}`}
              className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0"
            >
              Join Consultation
            </Link>
          );
        case "COMPLETED":
          if (consultation.completedSubStatus === "SUMMARY_ACCEPTED") {
            return (
              <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
                Book another consultation
              </button>
            );
          }
          return null;
        default:
          return null;
      }
    }

    // Designer CTA
    switch (consultation.designerStatus) {
      case "ASSIGNED":
        if (
          consultation.buyerStatus === "MATCHED" ||
          consultation.buyerStatus === "MATCHING"
        ) {
          // Designer hasn't accepted yet
          return (
            <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
              Respond
            </button>
          );
        }
        return null;
      case "BOOKED":
        if (consultation.bookedSubStatus === "NO_SHOW") {
          return (
            <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
              Reschedule
            </button>
          );
        }
        return null;
      case "LIVE":
        return (
          <Link
            href={`/video/${consultation.id}`}
            className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0"
          >
            Join Consultation
          </Link>
        );
      case "AWAITING_SUMMARY":
        return (
          <button className="text-xs bg-primary text-white px-3 py-1.5 rounded font-medium shrink-0">
            Add Summary
          </button>
        );
      default:
        return null;
    }
  };

  const viewDetailsButton = (
    <Link
      href={`${baseHref}/${consultation.id}`}
      className="text-xs border border-gray-300 text-gray-700 px-3 py-1.5 rounded font-medium shrink-0 hover:bg-gray-50"
    >
      View Details
    </Link>
  );

  const hasViewDetails =
    !getCtaButton() &&
    !consultation.isCancelled &&
    consultation.buyerStatus !== "MATCHING";

  const subStatusNote = (() => {
    if (consultation.bookedSubStatus === "RESCHEDULE_REQUESTED")
      return " (Reschedule Request Sent)";
    if (consultation.bookedSubStatus === "NO_SHOW")
      return " (Missed by both parties)";
    if (
      consultation.designerStatus === "ASSIGNED" &&
      consultation.buyerStatus === "MATCHED"
    )
      return " (You've accepted)";
    return null;
  })();

  return (
    <Link
      href={`${baseHref}/${consultation.id}`}
      className={cn(
        "block border rounded-lg bg-white transition-colors hover:bg-gray-50",
        isActive && "ring-2 ring-primary",
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 p-4 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar */}
          <div className="relative size-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
            {counterpart?.profilePhotoUri ? (
              <Image
                src={counterpart.profilePhotoUri}
                alt={`${counterpart.firstName} ${counterpart.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-sm font-semibold text-gray-500">
                {counterpart
                  ? `${counterpart.firstName[0]}${counterpart.lastName[0]}`
                  : "?"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {counterpart
                ? `${counterpart.firstName} ${counterpart.lastName}`
                : "Finding your match..."}
            </p>
            {slot ? (
              <p className="text-xs text-foreground-body truncate">
                {slot.startTime} - {slot.endTime} ({slot.timezone})
                {subStatusNote && (
                  <span className="text-amber-600">{subStatusNote}</span>
                )}
              </p>
            ) : (
              subStatusNote && (
                <p className="text-xs text-amber-600 truncate">{subStatusNote}</p>
              )
            )}
          </div>
        </div>

        {/* CTA or view details */}
        <div className="flex items-center gap-2 shrink-0">
          {consultation.hasOpenDispute && (
            <MessageSquare className="size-4 text-red-500" />
          )}
          {getCtaButton() ?? (hasViewDetails ? viewDetailsButton : null)}
        </div>
      </div>

      {/* Project info row */}
      {consultation.project && (
        <div className="grid grid-cols-3 gap-x-4 px-4 pb-2 text-xs">
          <div>
            <p className="text-foreground-body">Project Title</p>
            <p className="font-medium text-foreground truncate">
              {consultation.project.title}
            </p>
          </div>
          <div>
            <p className="text-foreground-body">Description</p>
            <p className="font-medium text-foreground truncate">
              {consultation.project.description}
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-foreground-body">Budget</p>
              {consultation.project.budget ? (
                <p className="font-medium text-foreground">
                  ${consultation.project.budget.min} - $
                  {consultation.project.budget.max}
                </p>
              ) : (
                <p className="font-medium text-foreground">—</p>
              )}
            </div>
            <div>
              <p className="text-foreground-body">Status</p>
              <ConsultationStatusBadge
                buyerStatus={
                  role === "BUYER" ? consultation.buyerStatus : undefined
                }
                designerStatus={
                  role === "DESIGNER" ? consultation.designerStatus : undefined
                }
                isCancelled={consultation.isCancelled}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer strip (escrow / fee info) */}
      {consultation.buyerStatus === "MATCHING" ? (
        <div className="px-4 pb-3">
          <p className="text-xs text-foreground-body italic">
            We&apos;re matching you with the right Designer...
          </p>
        </div>
      ) : consultation.buyerStatus === "MATCHED" ||
        consultation.designerStatus === "REQUESTED" ? (
        <div className="px-4 pb-3">
          <p className="text-xs text-foreground-body">
            Consultation fees: $5 for 30 minutes or $20 for 45 minutes.
          </p>
        </div>
      ) : consultation.designerStatus === "ASSIGNED" ? (
        <div className="px-4 pb-3">
          <p className="text-xs text-amber-700">
            Waiting for client to schedule
          </p>
        </div>
      ) : (
        <div className="px-4 pb-3">
          <EscrowAlert
            consultation={consultation}
            role={role}
          />
        </div>
      )}
    </Link>
  );
};

export default ConsultationCard;
