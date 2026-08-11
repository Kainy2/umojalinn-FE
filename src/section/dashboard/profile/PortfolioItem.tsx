"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PopoverMenu from "@/components/custom/PopoverMenu";
import { useDeleteSharedWork } from "@/tanstack/hooks/useSharedWork";
import { UmojaLinnSharedWork } from "@/types/project";
import { formatDate } from "date-fns";
import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
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
  editable?: boolean;
};

const PortfolioItem = ({ work, editable }: PortfolioItemProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const coverImage = useMemo(() =>
    work.images.find((img) => img.isCoverImage) ?? work.images[0]
  , [work.images]);

  const { mutate: deleteWork, isPending: isDeleting } = useDeleteSharedWork({
    onSuccess: () => {
      setShowDeleteModal(false);
    },
  });

  return (
    <>
      <Dialog>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <DialogTrigger asChild>
              <div className="aspect-[3/4] md:aspect-auto md:h-56 relative cursor-pointer">
                <Image
                  alt={coverImage?.description || ""}
                  src={coverImage?.imageUrl || "/img/svg/null.svg"}
                  fill
                  className="object-cover absolute top-0"
                  onClick={() => setActiveImage(0)}
                />
              </div>
            </DialogTrigger>

            {editable && (
              <div className="absolute top-2 right-2 z-10">
                <PopoverMenu
                  menus={[
                    {
                      children: "Edit",
                      icon: <Pencil className="h-4 w-4" />,
                      href: `/share-your-work?edit=${work.id}`,
                    },
                    {
                      children: "Delete",
                      icon: <Trash2 className="h-4 w-4 text-destructive" />,
                      onClick: () => setShowDeleteModal(true),
                      className: "text-destructive",
                    },
                  ]}
                >
                  <button className="rounded-full p-1.5 bg-white/80 hover:bg-white shadow-sm">
                    <MoreVertical className="h-4 w-4 text-foreground-body" />
                  </button>
                </PopoverMenu>
              </div>
            )}
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

      {/* Delete confirmation modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Work</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this work? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteWork(work.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PortfolioItem;
