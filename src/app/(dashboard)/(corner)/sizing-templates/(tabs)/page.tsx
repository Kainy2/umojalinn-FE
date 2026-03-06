"use client";
import SizingTemplateCard from "@/components/custom/card/SizingTemplate";
import SizingTemplateDialog from "@/components/custom/dialog/SizingTemplate";
import BuyExtraTemplateCard from "@/components/custom/card/BuyExtraTemplateCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllDesignerSizingTemplates,
  useGetAllSizingTemplates,
} from "@/tanstack/hooks/useSizingTemplates";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Plus, AlertCircle } from "lucide-react";
const SizingTemplatesPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isPending } = (
    session?.user?.profileRole === "BUYER"
      ? useGetAllSizingTemplates
      : useGetAllDesignerSizingTemplates
  )();


  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {new Array(4).fill("").map((_, index) => (
          <Skeleton className="h-52" key={index} />
        ))}
      </div>
    );
  }

  if (session?.user?.profileRole === "DESIGNER" && !data?.data?.data?.length) return <p className="h-[40vh] flex items-center justify-center text-gray-400">
    No active sizing templates at the moment
  </p>

  return (
    <div className="flex flex-col min-h-[calc(100vh-230px)] gap-8">
      <div className="flex flex-wrap gap-4">
        {session?.user?.profileRole === "BUYER" && (data?.data?.data?.length || 0) < 3 && (
          <SizingTemplateDialog>
            <button className="flex flex-col p-2 border-2 border-dotted border-gray-200 gap-2 rounded-[16px] w-full lg:w-[300px] text-left bg-white transition-opacity hover:opacity-80 group">
              {/* Top Image Section */}
              <div className="relative h-52 w-full overflow-hidden bg-[#f8f9fa] flex items-center justify-center shrink-0">
                <Image
                  src="/img/png/buy-template.png"
                  alt=""
                  className="object-cover object-center blur-sm scale-105 opacity-60"
                  fill
                />

                {/* Yellow Add Pill */}
                <div className="absolute top-4 inset-x-4 border border-dashed border-[#EAAA08] bg-[#FEF7C3] rounded-[8px] py-1.5 px-3 flex items-center justify-between text-[#CA8504] font-medium text-xs z-10 shadow-sm">
                  Add Sizing template
                  <div className="bg-[#EAAA08] text-white rounded-full size-6 flex items-center justify-center  text-lg font-semibold shrink-0 ml-2 shadow-sm">

                    <Plus />
                  </div>
                </div>
              </div>

              {/* Bottom Info Section */}
              <div className="flex items-center justify-between w-full mt-1 px-1 pb-1">
                <p className="text-[13px] text-[#4B5563] italic w-full">
                  Add Measurement Point for later use
                </p>
                <div className="text-[20px] font-bold text-[#EAAA08] shrink-0 pl-2">
                  x{3 - (data?.data?.data?.length || 0)}
                </div>
              </div>
            </button>
          </SizingTemplateDialog>
        )}
        {data?.data?.data?.map?.((template) => (
          <SizingTemplateCard template={template} key={template?.id} />
        ))}
        {session?.user?.profileRole === "BUYER" && (data?.data?.data?.length || 0) >= 3 && (
          <BuyExtraTemplateCard onClick={() => router.push("/sizing-templates/buy")} />
        )}
      </div>

      {session?.user?.profileRole === "BUYER" && (
        <div className="flex items-center justify-center w-full gap-3 mt-auto  text-[#4B5563]">
          <div className="flex items-center justify-center bg-[#FEF7C3] text-[#CA8504] rounded-full p-1.5 shrink-0">
            <AlertCircle className="size-4" strokeWidth={2.5} />
          </div>
          <p className="text-[15px]">
            Umoja linn offers 3 complimentary sizing templates at no cost, {data?.data?.data?.length || 0} of your 3 free templates are in use.
          </p>
        </div>
      )}
    </div>
  );
};

export default SizingTemplatesPage;
