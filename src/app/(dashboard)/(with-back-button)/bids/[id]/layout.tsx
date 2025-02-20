import BidTab from "@/section/dashboard/project/bid/tab";
import BidTitle from "@/section/dashboard/project/bid/Title";
import RequestSizingTemplateAlert from "@/section/sizing-template/RequestAlert";
import React, { Suspense } from "react";

const BidLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <RequestSizingTemplateAlert />
      <BidTitle />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-gray-100 p-4">{children}</div>
        <aside className="w-full lg:max-w-80 shrink-0">
          <Suspense>
            <BidTab />
          </Suspense>
        </aside>
      </div>
    </>
  );
};

export default BidLayout;
