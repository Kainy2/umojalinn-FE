"use client";
import { Badge } from "@/components/ui/badge";
import { UmojaLinnPreviousHire } from "@/types/user";
import { uuidToBase62Safe } from "@/lib/uuid";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type HireCardProps = {
  hire: UmojaLinnPreviousHire;
};

const HireCard = ({ hire }: HireCardProps) => {
  const fullName = `${hire.user.firstName} ${hire.user.lastName}`;
  const location = [hire.user.address?.state, hire.user.address?.country]
    .filter(Boolean)
    .join(", ");

  const portfolioImages = hire.portfolioCoverImages ?? [];

  return (
    <Link
      href={`/designers/${uuidToBase62Safe(hire.userId)}`}
      className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      {/* Profile photo */}
      <div className="shrink-0">
        <Image
          src={hire.user.profilePhotoUri || "/img/webp/user.webp"}
          alt={fullName}
          width={56}
          height={56}
          className="rounded-full object-cover w-14 h-14"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate">{fullName}</h3>
          {location && (
            <span className="text-xs text-foreground-body whitespace-nowrap">
              {location}
            </span>
          )}
        </div>

        {/* Availability */}
        <div className="mb-2">
          {hire.isAvailable ? (
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
              Available
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
              Unavailable
            </Badge>
          )}
        </div>

        {/* Clothing types */}
        {hire.clothingTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {hire.clothingTypes.map((type) => (
              <Badge key={type.id} variant="outline" className="text-xs">
                {type.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-foreground-body">
          <span>0 Jobs</span>
          <span>•</span>
          <span>N/A Success rate</span>
          <span>•</span>
          <span>0 Reviews</span>
        </div>
      </div>

      {/* Portfolio thumbnails */}
      <div className="hidden md:grid grid-cols-2 gap-1 shrink-0 w-28">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square relative rounded overflow-hidden bg-gray-100 flex items-center justify-center"
          >
            {portfolioImages[i] ? (
              <Image
                src={portfolioImages[i]}
                alt=""
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5 text-gray-300" />
            )}
          </div>
        ))}
      </div>
    </Link>
  );
};

export default HireCard;
