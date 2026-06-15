"use client";

import React, { useCallback, useState } from "react";
import Collapsible from "@/components/custom/Collapsible";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { IProjectDisputesProps } from "./@types";
import DisputeListItem from "./DisputeListItem";
import { MOCK_PROJECT_DISPUTES } from "./mockDisputes";

const ProjectDisputes = ({ projectId, currency }: IProjectDisputesProps) => {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  // TODO: replace MOCK_PROJECT_DISPUTES with useGetProjectDisputes(projectId) when API is ready
  void projectId;
  const disputes = MOCK_PROJECT_DISPUTES;

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

  const handleSummaryDocClick = useCallback(() => {
    toast({
      title: "Coming soon",
      description: "The dispute summary document will be available shortly.",
    });
  }, [toast]);

  if (!disputes.length) return null;

  return (
    <Collapsible title="Disputes">
      <div className="flex flex-col gap-3">
        {disputes.map((dispute) => (
          <DisputeListItem
            key={dispute.id}
            dispute={dispute}
            currency={currency}
            expanded={expandedId === dispute.id}
            isResponding={respondingId === dispute.id}
            onToggleExpand={() => handleToggleExpand(dispute.id)}
            onRespondNow={() => handleRespondNow(dispute.id)}
            onCancelResponse={handleCancelResponse}
            onResponseSuccess={handleResponseSuccess}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleSummaryDocClick}
        className={cn(
          "mt-4 text-sm font-medium text-primary hover:underline",
        )}
      >
        View summary doc &gt;
      </button>
    </Collapsible>
  );
};

export default ProjectDisputes;
