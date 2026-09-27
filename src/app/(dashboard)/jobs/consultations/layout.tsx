"use client";
import ConsultationCardList from "@/components/consultation/ConsultationCardList";

const DesignerConsultationsLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex gap-4 min-h-[600px]">
      <div className="w-full md:w-[420px] shrink-0">
        <ConsultationCardList role="DESIGNER" baseHref="/jobs/consultations" />
      </div>
      <div className="flex-1 min-w-0 hidden md:block">{children}</div>
    </div>
  );
};

export default DesignerConsultationsLayout;
