"use client";

import React, { useCallback, useState } from "react";
import Collapsible from "@/components/custom/Collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjectDisputesWithDetails } from "@/tanstack/hooks/useDispute";
import { useSession } from "next-auth/react";
import { IProjectDisputesProps } from "./@types";
import DisputeListItem from "./DisputeListItem";

const ProjectDisputes = ({ projectId, currency }: IProjectDisputesProps) => {
  const { data: session } = useSession();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const { disputes, isLoading, detailLoadingById } =
    useGetProjectDisputesWithDetails(projectId);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => {
      if (prev === id) {
        setRespondingId(null);
        return null;
      }
      setRespondingId(null);
      return id;
    });
  }, []);

  const handleRespondNow = useCallback((id: string) => {
    setExpandedId(id);
    setRespondingId(id);
  }, []);

  const handleCancelResponse = useCallback(() => {
    setRespondingId(null);
  }, []);

  const handleResponseSuccess = useCallback(() => {
    setRespondingId(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    );
  }

  if (!disputes.length) return null;

  return (
    <Collapsible title="Disputes">
      <div className="flex flex-col gap-3">
        {disputes.map((dispute) => (
          <DisputeListItem
            key={dispute.id}
            dispute={dispute}
            currentUserId={session?.user?.id}
            currency={currency}
            expanded={expandedId === dispute.id}
            isResponding={respondingId === dispute.id}
            isDetailLoading={detailLoadingById[dispute.id]}
            onToggleExpand={() => handleToggleExpand(dispute.id)}
            onRespondNow={() => handleRespondNow(dispute.id)}
            onCancelResponse={handleCancelResponse}
            onResponseSuccess={handleResponseSuccess}
          />
        ))}
      </div>

      {/* <button
        type="button"
        onClick={handleSummaryDocClick}
        className={cn(
          "mt-4 text-sm font-medium text-primary hover:underline",
        )}
      >
        View summary doc &gt;
      </button> */}
    </Collapsible>
  );
};

export default ProjectDisputes;
