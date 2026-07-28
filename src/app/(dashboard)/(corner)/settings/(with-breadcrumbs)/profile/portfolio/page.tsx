"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBuyerProject, useGetDesignerProfile } from "@/tanstack/hooks/useProject";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PortfolioItem from "@/section/dashboard/profile/PortfolioItem";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const SettingsProfilePortfolioPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const isDesigner = session?.user?.profileRole === "DESIGNER";

  // Buyer branch — unchanged
  const { data: buyerPortfolioData, isPending: isGettingBuyerPortfolio } =
    useGetAllBuyerProject(
      { projectStatus: "COMPLETED" },
      { enabled: !isDesigner },
    );

  // Designer branch — fetch profile which includes designerSharedWork
  const { data: meData, isPending: isGettingMe } = useGetMe({ enabled: isDesigner });
  const designerProfileId = meData?.data?.data?.designerProfile?.userId
    ? uuidToBase62Safe(meData.data.data.designerProfile.userId)
    : undefined;
  const { data: designerProfileData, isPending: isGettingDesignerProfile } =
    useGetDesignerProfile(designerProfileId);
  const sharedWork = designerProfileData?.data?.data?.designerSharedWork ?? [];

  // Loading states
  const loading = isDesigner
    ? isGettingMe || isGettingDesignerProfile
    : isGettingBuyerPortfolio;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {new Array(4).fill("").map((_, i) => (
          <Skeleton className="h-56" key={i} />
        ))}
      </div>
    );
  }

  // Designer portfolio — shared work
  if (isDesigner) {
    if (!sharedWork.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 h-72 text-muted-foreground">
          <p>No work published yet.</p>
          <Button asChild variant="default">
            <Link href="/share-your-work">Share your work</Link>
          </Button>
        </div>
      );
    }

    return (
      <section className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sharedWork.map((work) => (
            <PortfolioItem key={work.id} work={work} />
          ))}
        </div>

        <Separator className="bg-border/50" />
        <div className="text-right">
          <Button
            onClick={() => router.push("/settings/profile/portfolio")}
          >
            <Plus className="h-4 w-4" />
            Share your Work
          </Button>
        </div>
      </section>
    );
  }

  // Buyer portfolio — completed projects
  if (!buyerPortfolioData?.data?.data?.length) {
    return (
      <div className="flex items-center justify-center h-72 text-muted-foreground">
        <p>No portfolio projects</p>
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {buyerPortfolioData?.data?.data?.map((portfolio) => (
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

      <Separator className="bg-border/50" />
      <div>
        <Button
          onClick={() => router.push("/settings/profile/portfolio")}
        >
          Share your Work
        </Button>
      </div>
    </section>

  );
};

export default SettingsProfilePortfolioPage;
