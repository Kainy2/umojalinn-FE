"use client";
import ConsultationCardList from "@/components/consultation/ConsultationCardList";
import { useState } from "react";
import ConsultationRequestModal from "@/components/consultation/modals/ConsultationRequestModal";

const ConsultationsLayout = ({ children }: LayoutProps) => {
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Consultations</h2>
        <button
          onClick={() => setRequestModalOpen(true)}
          className="text-sm bg-primary text-white px-3 py-1.5 rounded font-medium hover:bg-primary/90 transition-colors"
        >
          + New Consultation Request
        </button>
      </div>

      {/* Split panel: card list + detail */}
      <div className="flex gap-4 min-h-[600px]">
        <div className="w-full md:w-[420px] shrink-0">
          <ConsultationCardList role="BUYER" baseHref="/consultations" />
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0 hidden md:block">
          {children}
        </div>
      </div>

      <ConsultationRequestModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
    </div>
  );
};

export default ConsultationsLayout;
