"use client";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UmojaLinnSharedWork } from "@/types/project";
import { formatDate } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import Slider from "react-slick";

const sliderSettings = {
  dots: true,
  dotsClass: "slick-dots -translate-y-[9vh] md:-translate-y-[8vh]",
  draggable: true,
  infinite: true,
  swipeToSlide: true,
  swipe: true,
};

type PortfolioItemProps = {
  work: UmojaLinnSharedWork;
};

const PortfolioItem = ({ work }: PortfolioItemProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const coverImage =
    work.images.find((img) => img.isCoverImage) ?? work.images[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col gap-3 cursor-pointer">
          <div className="aspect-[3/4] md:aspect-auto md:h-56 relative">
            <Image
              alt={coverImage?.description || ""}
              src={coverImage?.imageUrl || "/img/svg/null.svg"}
              fill
              className="object-cover absolute top-0"
              onClick={() => setActiveImage(0)}
            />
          </div>
          <div>
            <p className="text-sm text-foreground-body mb-1">
              {formatDate(work.createdAt, "MMM d, yyyy")}
            </p>
            {work?.description && (
              <p className="text-foreground-body text-sm line-clamp-3">
                {work.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {work.clothingTypes.map((type) => (
              <Badge key={type.id} variant="outline" className="bg-primary text-white">
                {type.name}
              </Badge>
            ))}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="h-full w-full max-w-[80vw] max-h-[65vh] md:max-h-[80vh] p-0 border-0 bg-black/70 [&>button>svg]:text-white overflow-hidden">
        <DialogTitle className="hidden">Portfolio</DialogTitle>
        <div className="max-w-[80vw] md:max-h-[80vh] md:mt-10 p-auto scrollbar-hide md:px-10 flex flex-col justify-center">
          <Slider {...sliderSettings} initialSlide={activeImage}>
            {work.images.map((img, i) => (
              <div key={i} className="relative h-[65vh] md:h-[76vh]">
                <div className="relative h-[50vh] md:h-[68vh] translate-y-[6vh] md:translate-y-0">
                  <Image
                    src={img.imageUrl || "/img/svg/null.svg"}
                    fill
                    className="object-contain"
                    alt={img.description || `Image ${i + 1}`}
                  />
                </div>
                {img.description && (
                  <div className="absolute bottom-0 w-full text-center backdrop-blur-lg px-4 py-2 bg-white/50">
                    <p>{img.description}</p>
                  </div>
                )}
              </div>
            ))}
          </Slider>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioItem;
