import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type GalleryImagesProps = {
  height?: number;
  width?: number;
  wrapperClassName?: string;
  titleClassName?: string;
  imgClassName?: string;
  src?: string;
  fallback?: string;
  title?: string;
};

const GalleryImages = (props: GalleryImagesProps) => {
  const {
    height,
    width,
    wrapperClassName,
    src,
    fallback,
    title,
    titleClassName,
  } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          style={{ width, height }}
          className={cn("relative", wrapperClassName)}
        >
          <Image
            alt={title || ""}
            src={src || fallback || "/img/svg/null.svg"}
            className="shrink-0 object-cover absolute"
            fill
          />
          <p
            className={cn(
              "absolute bottom-0 px-4 py-2 max-h-full overflow-scroll text-foreground w-full backdrop-blur-md bg-white/30 border-t-1 border-white/50 truncate",
              titleClassName,
            )}
          >
            {title}
          </p>
        </button>
      </DialogTrigger>
      <DialogContent className="h-full w-full max-w-[80vw] max-h-[80vh] p-0 border-0 bg-black/50 [&>button>svg]:text-white overflow-hidden">
        <div className="relative">
          <DialogTitle className="hidden">{title || "Image"}</DialogTitle>
          <Image
            src={src || fallback || "/img/svg/null.svg"}
            className="shrink-0 object-contain absolute"
            fill
            alt={title || ""}
          />
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className={cn(
              "absolute bottom-0 px-4 py-2 max-h-full overflow-scroll text-foreground w-full backdrop-blur-md bg-white/30 border-t-1 border-white/50",
              titleClassName,
              !expanded && "truncate",
            )}
          >
            {title}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryImages;
