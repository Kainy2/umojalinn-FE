"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AverageRatingStars } from "@/components/custom/dialog/Review";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
// import { formatCurrencyValue } from "@/lib/number";
import { capitalizeFirstLetter, getCurrencySymbol } from "@/lib/string";
import { UmojaLinnCurrency, UmojaLinnProject } from "@/types/project";
import { UmojaLinnDesignerProfile } from "@/types/user";
import PortfolioItem from "./PortfolioItem";
import WorkHistoryItem from "./WorkHistoryItem";
import { useSession } from "next-auth/react";

const ABOUT_TRUNCATE_LENGTH = 200;

const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  ONE_TO_TWO_YEARS: "1 - 2 Years",
  THREE_TO_FIVE_YEARS: "3 - 5 Years",
  SIX_TO_EIGHT_YEARS: "6 - 8 Years",
  NINE_PLUS_YEARS: "9+ Years",
};

type DesignerProfileViewProps = {
  designer: UmojaLinnDesignerProfile;
};

const DesignerProfileView = ({ designer }: DesignerProfileViewProps) => {
  const [activeTab, setActiveTab] = useState<"work-history" | "portfolio">(
    "work-history",
  );
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const session = useSession();

  const isDesigner = session.data?.user?.profileRole === "DESIGNER";

  const fullName = `${designer.user.firstName} ${designer.user.lastName}`;
  const location =
    [designer.user.address?.state, designer.user.address?.country]
      .filter(Boolean)
      .map(val => val ? capitalizeFirstLetter(val): '')
      .join(", ") + "." || "N/A";

  const aboutText = designer.about || "No bio provided yet.";
  const shouldTruncate = aboutText.length > ABOUT_TRUNCATE_LENGTH;
  const displayedAbout =
    shouldTruncate && !aboutExpanded
      ? aboutText.slice(0, ABOUT_TRUNCATE_LENGTH) + "..."
      : aboutText;

  const avgRating = designer.averageRating ?? 0;

  const currency: UmojaLinnCurrency =
    (designer.projects as UmojaLinnProject[])?.[0]?.currency ?? "NAIRA";

  const totalEarnings =
    designer?.projects?.reduce((total, project) => {
      const p = project as UmojaLinnProject;
      if (p.status !== "COMPLETED") return total;
      return total + Number(p.amountFunded ?? 0);
    }, 0) ?? 0;

  const allWorkHistory = [
    ...(designer.workHistory?.withBuyer ?? []),
    ...(designer.workHistory?.other ?? []),
  ];
  const reviewCount = allWorkHistory.reduce(
    (sum, entry) => sum + entry.reviews.length, 0
  );

  const stats = [
    { label: "Location", value: location },
    { label: "Total Earnings", value: (getCurrencySymbol(currency) ?? "") + totalEarnings },
    { label: "Total Jobs", value: designer.projects.length },
    { label: "Success rate", value: "N/A" },
    { label: "Years of Experience", value: EXPERIENCE_LEVEL_LABELS[designer.experienceLevel ?? ""] ?? designer.experienceLevel ?? "N/A" },
    { label: "Reviews", value: reviewCount },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="relative h-60 overflow-hidden rounded-sm">
        <Image
          src="/img/png/designer-cover-mobile.png"
          alt="Cover image"
          fill
          className="object-cover -z-10 md:hidden"
        />
        <Image
          src="/img/png/designer-cover.png"
          alt="Cover image"
          fill
          className="object-cover -z-10 hidden md:inline-block"
        />
      </div>

      {/* Avatar + identity */}
      <div className="-mt-16 px-4 flex md:flex-row flex-col gap-3 md:items-center items-start justify-between">
        <div className="flex md:flex-row flex-col gap-6 md:items-center items-start">
          <div className="">
            <Image
              src={designer.user.profilePhotoUri || "/img/webp/user.webp"}
              alt={fullName}
              width={160}
              height={160}
              className="rounded-full border-4 border-background min-w-40 min-h-40 object-cover bg-background"
            />
            {designer.isAvailable && (
              <div className="mt-1 w-full py-1 bg-success text-white text-center text-sm">
                Available
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-subtitle-1 font-bold text-foreground">
              {fullName}
            </h1>
            <p className="text-sm font-medium text-foreground-body">
              {designer.brandName || "Independent Designer"}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className={"flex gap-3 flex-wrap"}>
          {/* <Button disabled variant="outline" size="sm">
            <Heart className="h-4 w-4 text-primary" />
          </Button> */}
          <Button
            className={isDesigner ? "cursor-not-allowed" : ""}
            size="sm"
            asChild
          >
            {isDesigner ? (
              <p>Hire Me</p>
            ) : (
              <Link
                href={
                  designer.inviterTag
                    ? `/project/create?inviterTag=${designer.inviterTag}`
                    : ""
                }
              >
                Hire Me
              </Link>
            )}
          </Button>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Info Stats Section */}
      <div className="bg-gray-50 rounded py-5 px-6">
        {/* About */}
        <div>
          <h2 className="font-semibold text-foreground mb-2">About me</h2>
          <p className="text-foreground-body text-sm whitespace-pre-line">
            {displayedAbout}
          </p>
          {shouldTruncate && (
            <button
              className="text-primary text-sm font-medium mt-1"
              onClick={() => setAboutExpanded((v) => !v)}
            >
              {aboutExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-4 mt-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm text-foreground-body">{stat.label}</p>
              <p className="font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="mt-4">
          <p className="text-sm text-foreground-body">Ratings</p>
          {/* <ReviewRatingStars smallValue rating={avgRating} disabled small /> */}
          <AverageRatingStars smallValue rating={avgRating} disabled small />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mt-4">
          <div>
            {/* Specialty */}
            {designer.specialistType && (
              <div>
                <p className="text-sm text-foreground-body mb-2">Specialty</p>
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {designer.specialistType.name}
                    </Badge>
                </div>
              </div>
            )}
          </div>

          <div>
            {/* Clothing types */}
            {designer.clothingTypes.length > 0 && (
              <div>
                <p className="text-sm text-foreground-body mb-2">Clothing Types</p>
                <div className="flex flex-wrap gap-2">
                  {designer.clothingTypes.map((type) => (
                    <Badge key={type.id} variant="outline">
                      {type.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      <Separator className="bg-border/50" />

      {/* Tabs */}
      <TabButtonSelect
        type="DEFAULT"
        active={activeTab}
        onChange={(val) => setActiveTab(val as "work-history" | "portfolio")}
        tabs={[
          { title: "Work History", value: "work-history" },
          { title: "Portfolio", value: "portfolio" },
        ]}
      />

      {/* Work History tab */}
      {activeTab === "work-history" && (
        <div className="flex flex-col gap-8">
          {allWorkHistory.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-muted-foreground">
              <p>No work history to show</p>
            </div>
          ) : (
            <>
              {(designer.workHistory?.withBuyer?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-subtitle-2 font-semibold text-foreground">
                    Previous Project together
                  </h2>
                  {designer.workHistory!.withBuyer.map((entry) => (
                    <WorkHistoryItem key={entry.projectId} entry={entry} />
                  ))}
                </div>
              )}
              {(designer.workHistory?.other?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-subtitle-2 font-semibold text-foreground">
                    Work History
                  </h2>
                  {designer.workHistory!.other.map((entry) => (
                    <WorkHistoryItem key={entry.projectId} entry={entry} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Portfolio tab */}
      {activeTab === "portfolio" && (
        <div className="space-y-8">
          {designer.designerSharedWork.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-muted-foreground">
              <p>No portfolio to show</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-12">
              {designer.designerSharedWork.map((work) => (
                <div key={work.id} className="space-y-4">
                  <PortfolioItem work={work} />
                  <Separator className="bg-border/50" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignerProfileView;
