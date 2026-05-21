"use client";
import React, { useState } from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ReviewRatingStars } from "@/components/custom/dialog/Review";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { UmojaLinnCurrency } from "@/types/project";

type ClothingType = { id: string; name: string };

type DesignerSharedWorkImage = {
  imageUrl: string;
  description: string;
  isCoverImage: boolean;
};

type DesignerSharedWork = {
  id: string;
  images: DesignerSharedWorkImage[];
  createdAt: string;
  clothingTypes: ClothingType[];
};

type DesignerProfileData = {
  id: string;
  brandName: string | null;
  isAvailable: boolean;
  about: string | null;
  user: {
    firstName: string;
    lastName: string;
    profilePhotoUri: string | null;
    address: { country?: string; city?: string; state?: string } | null;
  };
  clothingTypes: ClothingType[];
  designerSharedWork: DesignerSharedWork[];
  // display extras (not from API, hardcoded for dummy)
  totalEarnings: string;
  totalJobs: number;
  successRate: string;
  yearsOfExperience: number;
  reviewCount: number;
  rating: number;
  specialties: string[];
};

type WorkHistoryItem = {
  id: string;
  projectTitle: string;
  message: string;
  createdAt: string;
  rating: number;
  budget: number;
  currency: string;
};

const DUMMY_DESIGNER: DesignerProfileData = {
  id: "5ffac6a8-9eae-421a-aef3-f6ddf1ac8c54",
  brandName: "sample brand name",
  isAvailable: true,
  about:
    "I am a passionate fashion designer with 12 years of experience in the industry. My design aesthetic is a blend of classic elegance and contemporary flair, with an emphasis on creating pieces that are both beautiful and functional. I specialize in bespoke garments tailored to each client's unique vision and measurements.",
  user: {
    firstName: "Gabriel",
    lastName: "Designer",
    profilePhotoUri: null,
    address: { city: "Lagos", state: "Port Harcourt", country: "Nigeria" },
  },
  clothingTypes: [],
  designerSharedWork: [
    {
      id: "b4aca164-3179-4828-b557-049839ef23c2",
      images: [
        {
          imageUrl:
            "https://res.cloudinary.com/dvfvlxvjo/image/upload/v1779052572/local/shared-work/5ffac6a8-9eae-421a-aef3-f6ddf1ac8c54/forlee.jpg",
          description: "lorem aiujsdab sayshdgbah lorem aiujsdab sayshdgb",
          isCoverImage: true,
        },
        {
          imageUrl:
            "https://res.cloudinary.com/dvfvlxvjo/image/upload/v1779053089/local/shared-work/5ffac6a8-9eae-421a-aef3-f6ddf1ac8c54/first.png",
          description: "lorem aiujsdab sayshdgb",
          isCoverImage: false,
        },
      ],
      createdAt: "2026-05-17T21:24:49.606Z",
      clothingTypes: [
        { id: "d9860489-c512-44ee-8f25-3888941ccb01", name: "Dresses" },
        { id: "d6d7c617-da3a-4f89-b1a6-5378d51100f7", name: "Two - piece" },
      ],
    },
    {
      id: "c1234567-aaaa-bbbb-cccc-dddddddddddd",
      images: [
        {
          imageUrl:
            "https://res.cloudinary.com/dvfvlxvjo/image/upload/v1779052572/local/shared-work/5ffac6a8-9eae-421a-aef3-f6ddf1ac8c54/forlee.jpg",
          description:
            "A stunning bespoke Agbada set crafted with premium fabric",
          isCoverImage: true,
        },
      ],
      createdAt: "2026-04-10T10:00:00.000Z",
      clothingTypes: [
        { id: "agbada-id", name: "Agbada" },
        { id: "suits-id", name: "Suits" },
      ],
    },
  ],
  totalEarnings: "$5,000",
  totalJobs: 16,
  successRate: "100%",
  yearsOfExperience: 12,
  reviewCount: 16,
  rating: 3,
  specialties: ["Buuba", "Agbada", "Suits"],
};

const DUMMY_WORK_HISTORY: WorkHistoryItem[] = [
  {
    id: "wh-1",
    projectTitle: "Custom Agbada Set",
    message:
      "I had the pleasure of working with Gabriel on a recent project and I must say I was thoroughly impressed with their creativity, attention to detail, and overall professionalism.",
    createdAt: "2025-11-10T00:00:00.000Z",
    rating: 5,
    budget: 450,
    currency: "GBP",
  },
  {
    id: "wh-2",
    projectTitle: "Bespoke Wedding Suit",
    message:
      "I had the pleasure of working with Gabriel on a recent project and I must say I was thoroughly impressed with their creativity, attention to detail, and overall professionalism.",
    createdAt: "2025-08-22T00:00:00.000Z",
    rating: 4,
    budget: 800,
    currency: "USD",
  },
];

const ABOUT_TRUNCATE_LENGTH = 200;

const DesignerProfilePage = () => {
  const designer = DUMMY_DESIGNER;
  const [activeTab, setActiveTab] = useState<"work-history" | "portfolio">(
    "work-history",
  );
  const [aboutExpanded, setAboutExpanded] = useState(false);

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

  const stats = [
    { label: "Location", value: location },
    { label: "Total Earnings", value: designer.totalEarnings },
    { label: "Total Jobs", value: `${designer.totalJobs} Jobs` },
    { label: "Success rate", value: designer.successRate },
    { label: "Years of Experience", value: designer.yearsOfExperience },
    { label: "Reviews", value: designer.reviewCount },
  ];

  return (
    <div className="flex flex-col gap-6 ">
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
      <div className="-mt-16 px-4 flex gap-3 items-center justify-between">
        <div className="flex gap-6 items-end ">
          <div className="">
            <Image
              src={designer.user.profilePhotoUri || "/img/webp/user.webp"}
              alt={fullName}
              width={160}
              height={160}
              className="rounded-full border-4 border-background w-40 h-40 object-cover bg-background"
            />
            {/* <Badge className="mt-1 bg-success/10 text-success border-success/30 hover:bg-success/10">
                Available
              </Badge> */}
            {designer.isAvailable && (
              <div className="mt-1 w-full py-1 bg-success text-white text-center">
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
            <p className="text-sm text-foreground-body">$60K</p>
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
        <ReviewRatingStars rating={designer.rating} disabled small />
      </div>

      {/* Specialties */}
      {designer.specialties.length > 0 && (
        <div>
          <p className="text-sm text-foreground-body mb-2">Specialty</p>
          <div className="flex flex-wrap gap-2">
            {designer.specialties.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
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

      {/* Tab content */}
      {activeTab === "work-history" && (
        <div className="flex flex-col gap-8">
          {DUMMY_WORK_HISTORY.length === 0 ? (
            <div className="flex items-center justify-center h-72 text-muted-foreground">
              <p>No work history to show</p>
            </div>
          ) : (
            DUMMY_WORK_HISTORY.map((item) => (
              <div
                key={item.id}
                className="border border-input p-4 text-foreground-body"
              >
                <h3 className="text-subtitle-2 text-foreground font-semibold mb-2.5">
                  {item.projectTitle}
                </h3>
                <p className="mb-2">&quot;{item.message}&quot;</p>
                <p className="text-sm mb-2">
                  {formatDate(item.createdAt, "MMM d, yyyy")} - Present
                </p>
                <ReviewRatingStars small rating={item.rating} disabled />
                <Separator className="bg-border/50 mb-2 mt-8" />
                <div className="flex justify-between text-sm gap-8">
                  <p className="font-semibold">
                    {getCurrencySymbol(item.currency as UmojaLinnCurrency)}
                    {formatCurrencyValue(item.budget)}
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
