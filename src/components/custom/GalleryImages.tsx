import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Slider from 'react-slick';

import { UmojaLinnTimestamp } from "@/types/util";

type GalleryImagesProps = {
  height?: number;
  width?: number;
  wrapperClassName?: string;
  titleClassName?: string;
  imgClassName?: string;
  src?: string;
  fallback?: string;
  title?: string;
  images?: ({
    id: string;
    projectId: string;
    imageUrl: string;
    title: string;
    isCoverImage: boolean;
} & UmojaLinnTimestamp)[]
};

  
//   adaptiveHeight: true,
//   swipeToSlide: true,
//   swipe: true,

  
//   nextArrow: <div> <ArrowRight className="w-6 h-6"/> </div>,
//   responsive: [
//     {
//       breakpoint: 700,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//       },
//     },
//     {
//       breakpoint: 1199,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//       },
//     },
//   ],
// };


  const settings = {
    dots: true,
    dotsClass: "slick-dots -translate-y-[9vh] md:-translate-y-[8vh]",
    // fade: true,
    draggable: true,
    infinite: true,
    // speed: 500,
    // slidesToShow: 1,
    // slidesToScroll: 1,
    swipeToSlide: true,
    swipe: true,
  };


const GalleryImages = (props: GalleryImagesProps) => {
  const {
    height,
    width,
    wrapperClassName,
    fallback,
    titleClassName,
    images,
  } = props;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-wrap gap-4">
          {images?.map((gallery, i) => ( 
            <button
              key={gallery.id+i}
              style={{ width, height }}
              className={cn("relative my-2", wrapperClassName)}
            >
              <Image
                alt={gallery.title || ""}
                src={gallery.imageUrl || fallback || "/img/svg/null.svg"}
                className="shrink-0 object-cover absolute"
                fill
              />
              <p
                className={cn(
                  "absolute bottom-0 px-4 py-2 max-h-full overflow-scroll text-foreground w-full backdrop-blur-md bg-white/30 border-t-1 border-white/50 truncate",
                  titleClassName,
                )}
              >
                {gallery.title}
              </p>
            </button>
          ))}
        </div>
      </DialogTrigger>

      <DialogContent className="h-full w-full max-w-[80vw] max-h-[65vh] md:max-h-[80vh] p-0 border-0 bg-black/70 [&>button>svg]:text-white overflow-hidden">
      <DialogTitle className="hidden">{ "Image"}</DialogTitle>

        <div className="
          max-w-[80vw] md:max-h-[80vh] md:mt-10 p-auto scrollbar-hide  md:px-10 flex flex-col justify-center 
          ">
            <Slider {...settings} className="h-full "> 
              {images?.map((gallery, i) => (
                <div key={gallery.id+i} className="relative h-[65vh] md:h-[76vh]">
                  <div className="relative h-[50vh] md:h-[68vh] translate-y-[6vh] md:translate-y-0">
                    <Image
                      src={
                        gallery.imageUrl ||
                        fallback ||
                        "/img/svg/null.svg"
                      }
                      className="object-cover"
                      fill
                      objectFit="cover"
                      alt={gallery.title || `Image ${gallery.id}`}
                    />
                  </div>
                  <div 
                  className={cn("absolute bottom-0 w-full text-center backdrop-blur-lg px-4 py-2 bg-white/50 border-t- 1 border-white/50 truncate",
                   titleClassName
                   )}>
                    <p> {gallery.title}</p>
                  </div>
                </div>
              ))}
            </Slider>           
          </div>
    </DialogContent>
                  {/* <p
                className={cn(
                  "absolute bottom-0 px-4 py-2 max-h-full overflow-scroll text-center text-foreground w-1/5 backdrop-blur-lg  bg-white/50 border-t-1 border-white/50 truncate",
                  titleClassName,
                )}
              >
                {gallery.title}
              </p> */}
    </Dialog>
  );
};

export default GalleryImages;
