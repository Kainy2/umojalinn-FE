"use client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetAllBuyerProject,
  useGetAllDesignerProject,
} from "@/tanstack/hooks/useProject";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const SettingsProfilePortfolioPage = () => {
  const { data: session } = useSession();
  const { data: buyerPorfolioData, isPending: isGettingBuyerPortfolio } =
    useGetAllBuyerProject(
      { projectStatus: "COMPLETED" },
      {
        enabled: session?.user?.profileRole === "BUYER",
      }
    );
  const { data: designerPorfolioData, isPending: isGettingDesignerPorfolio } =
    useGetAllDesignerProject(
      {
        projectStatus: "COMPLETED",
      },
      {
        enabled: session?.user?.profileRole === "DESIGNER",
      }
    );

  const loading =
    session?.user?.profileRole === "BUYER"
      ? isGettingBuyerPortfolio
      : isGettingDesignerPorfolio;

  const portfolioData =
    session?.user?.profileRole === "BUYER"
      ? buyerPorfolioData
      : designerPorfolioData;

  if (loading)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {new Array(6).fill("").map((_, i) => (
          <Skeleton className="h-56" key={_ + i} />
        ))}
      </div>
    );

  if (!portfolioData?.data?.data?.length)
    return (
      <div className="flex items-center justify-center h-72 text-muted-foreground">
        <p>No portfio projects</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {portfolioData?.data?.data?.map((portfolio) => (
        <div key={portfolio?.id} className="flex flex-col gap-4">
          <div className="aspect-[3/4] md:aspect-auto md:h-56 relative">
            <Image
              alt={portfolio?.title || ""}
              src={portfolio?.Gallery?.[0]?.imageUrl || "/img/svg/null.svg"}
              fill
              className="object-cover absolute top-0"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-foreground">
              {portfolio?.title}
            </h3>
            <p className="text-foreground-body line-clamp-3">
              {portfolio?.about}
            </p>
          </div>
          <div className="flex flex-wrap">
            {portfolio?.clothingTypes?.map((type) => (
              <Badge key={type?.id}>{type?.name}</Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SettingsProfilePortfolioPage;
