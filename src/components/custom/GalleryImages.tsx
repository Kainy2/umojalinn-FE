import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

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
    <div
      style={{ width, height }}
      className={cn("relative", wrapperClassName)}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <Image
        alt={title || ""}
        src={src || fallback || "/img/svg/null.svg"}
        className="shrink-0 object-cover absolute"
        fill
      />
      <p
        className={cn(
          "absolute bottom-0 px-4 py-2 max-h-full overflow-scroll text-foreground cursor-pointer w-full",
          titleClassName,
          !expanded && "truncate"
        )}
      >
        {title}
      </p>
    </div>
  );
};

export default GalleryImages;
