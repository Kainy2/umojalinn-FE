"use client";
import React, { useState } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewRatingStars } from "@/components/custom/dialog/Review";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { useGetDesignerProfile } from "@/tanstack/hooks/useProject";
import { UmojaLinnCurrency } from "@/types/project";
import { useParams } from "next/navigation";

const ABOUT_TRUNCATE_LENGTH = 200;

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton className="h-32 rounded-sm" />
    <div className="flex gap-6 -mt-10 px-4 items-end">
      <Skeleton className="rounded-full w-40 h-40 shrink-0" />
      <div className="flex flex-col gap-2 flex-1 pb-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <Separator className="bg-border/50" />
    <div className="flex flex-col gap-2">
      {new Array(3).fill("").map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-4">
      {new Array(6).fill("").map((_, i) => (
        <Skeleton key={i} className="h-10" />
      ))}
    </div>
  </div>
);

const DesignerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetDesignerProfile(id);
  const designer = data?.data?.data;

  const [activeTab, setActiveTab] = useState<"work-history" | "portfolio">(
    "work-history",
  );
  const [aboutExpanded, setAboutExpanded] = useState(false);

  if (isPending) return <LoadingSkeleton />;

  if (!designer)
    return (
      <div className="flex items-center justify-center h-72 text-muted-foreground">
        <p>Public designers not available yet</p>
      </div>
    );

  const fullName = `${designer.user.firstName} ${designer.user.lastName}`;
  const location =
    [designer.user.address?.city, designer.user.address?.state]
      .filter(Boolean)
      .join(", ") || "N/A";

  const aboutText = designer.about || "No bio provided yet.";
  const shouldTruncate = aboutText.length > ABOUT_TRUNCATE_LENGTH;
  const displayedAbout =
    shouldTruncate && !aboutExpanded
      ? aboutText.slice(0, ABOUT_TRUNCATE_LENGTH) + "..."
      : aboutText;

  const avgRating =
    designer.reviews.length > 0
      ? Math.round(
          designer.reviews.reduce((sum, r) => sum + r.rating, 0) /
            designer.reviews.length,
        )
      : 0;

  const stats = [
    { label: "Location", value: location },
    { label: "Total Earnings", value: "N/A" },
    { label: "Total Jobs", value: "N/A" },
    { label: "Success rate", value: "N/A" },
    { label: "Years of Experience", value: designer.experienceLevel || "N/A" },
    { label: "Reviews", value: designer.reviews.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Banner */}
      <div className="relative h-32 overflow-hidden rounded-sm">
        <Image
          src="/img/png/corner-pattern.png"
          alt=""
          fill
          className="object-cover object-right-top"
        />
      </div>

      {/* Avatar + identity */}
      <div className="-mt-16 px-4 flex md:flex-row flex-col gap-3 items-center justify-between">
        <div className="flex gap-6 items-end">
          <div>
            <Image
              src={designer.user.profilePhotoUri || "/img/webp/user.webp"}
              alt={fullName}
              width={160}
              height={160}
              className="rounded-full border-4 border-background w-40 h-40 object-cover bg-background"
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
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 text-primary" />
          </Button>
          <Button variant="outline" size="sm">
            Book Consultation
          </Button>
          <Button size="sm">Hire Me</Button>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* About */}
      <div>
        <h2 className="font-semibold text-foreground mb-2">About me</h2>
        <p className="text-foreground-body text-sm">{displayedAbout}</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-sm text-foreground-body">{stat.label}</p>
            <p className="font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm text-foreground-body">Ratings</p>
        <ReviewRatingStars rating={avgRating} disabled small />
      </div>

      {/* Specialties */}
      {designer.clothingTypes.length > 0 && (
        <div>
          <p className="text-sm text-foreground-body mb-2">Specialty</p>
          <div className="flex flex-wrap gap-2">
            {designer.clothingTypes.map((type) => (
              <Badge key={type.id} variant="outline">
                {type.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

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
          {designer.reviews.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-muted-foreground">
              <p>No work history to show</p>
            </div>
          ) : (
            designer.reviews.map((review) => (
              <div
                key={review.id}
                className="border border-input p-4 text-foreground-body"
              >
                <h3 className="text-subtitle-2 text-foreground font-semibold mb-2.5">
                  {review.project?.title || "Project"}
                </h3>
                <p className="mb-2">&quot;{review.message}&quot;</p>
                <p className="text-sm mb-2">
                  {formatDate(review.createdAt, "MMM d, yyyy")} - Present
                </p>
                <ReviewRatingStars small rating={review.rating} disabled />
                <Separator className="bg-border/50 mb-2 mt-8" />
                <div className="flex justify-between text-sm gap-8">
                  <p className="font-semibold">
                    {getCurrencySymbol(
                      review.project?.currency as UmojaLinnCurrency,
                    )}
                    {formatCurrencyValue(
                      review.project?.approvedBudget ?? 0,
                    )}
                  </p>
                  <span className="font-bold text-primary cursor-pointer">
                    View details
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Portfolio tab */}
      {activeTab === "portfolio" && (
        <div>
          {designer.designerSharedWork.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-muted-foreground">
              <p>No portfolio to show</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {designer.designerSharedWork.map((work) => {
                const coverImage =
                  work.images.find((img) => img.isCoverImage) || work.images[0];
                return (
                  <div key={work.id} className="flex flex-col gap-3">
                    <div className="aspect-[3/4] md:aspect-auto md:h-56 relative">
                      <Image
                        alt={coverImage?.description || ""}
                        src={coverImage?.imageUrl || "/img/svg/null.svg"}
                        fill
                        className="object-cover absolute top-0"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-foreground-body mb-1">
                        {formatDate(work.createdAt, "MMM d, yyyy")}
                      </p>
                      <p className="text-foreground-body text-sm line-clamp-3">
                        {coverImage?.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {work.clothingTypes.map((type) => (
                        <Badge key={type.id}>{type.name}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesignerProfilePage;
