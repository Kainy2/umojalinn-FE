import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React from "react";

const ReviewPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-md font-semibold text-foreground mb-1">
          Confirm details
        </h3>
        <p className="text-foreground-body text-sm">
          Please check and confirm that the information you added about this
          project are correct
        </p>
      </div>
      <Separator className="bg-slate-200" />
      <div className="p-4 bg-slate-100 mb-4">
        <h3 className="text-md font-semibold text-foreground-body mb-1">
          {/* TODO: Fix title here */}
          MY Agbada
        </h3>
        <p className="text-muted-foreground text-sm mb-8">
          {/* TODO: Fix description here */}
          A-line dress with a sweetheart neckline and cap sleeves. The dress
          should be made from a light blue chiffon fabric, with a satin lining
          for a comfortable fit. I would like the bodice to be fitted and
          embroidered with delicate floral lace, and the skirt to be flowing and
          slightly gathered at the waist
        </p>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Project due:{" "}
            <span className="font-semibold">
              {/* TODO: Fix due date here */}
              Jan 6, 2024
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Project budget:{" "}
            <span className="font-semibold">
              {/* TODO: Fix due date here */}
              $100,000
            </span>
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-foreground mb-1">
          Project Gallery
        </h3>
        <div></div>
      </div>
      <div>
        <button className="text-md font-semibold text-foreground mb-3 w-full flex flex-row justify-between gap-4">
          <span>Delivery Details</span>{" "}
          <ChevronDown className="text-primary h-6 w-6" />
        </button>
        <Separator className="bg-slate-200 mb-4" />
        <div className="flex flex-col gap-8 px-2">
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Country</p>
            <Badge variant="outline" className="rounded-sm font-normal">
              Nigeria
            </Badge>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">City</p>
            <Badge variant="outline" className="rounded-sm font-normal">
              Port Harcourt City
            </Badge>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">
              Province / State / Zip code
            </p>
            <div className="flex gap-4">
              <Badge variant="outline" className="rounded-sm font-normal">
                River State
              </Badge>
              <Badge variant="outline" className="rounded-sm font-normal">
                50012
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Address</p>
            <Badge
              variant="outline"
              className="rounded-sm font-normal max-w-48"
            >
              10 Location Junction, Mgbuoba, Port Harcourt
            </Badge>
          </div>
        </div>
      </div>
      <div>
        <button className="text-md font-semibold text-foreground mb-3 w-full flex flex-row justify-between gap-4">
          <span>Other Details</span>{" "}
          <ChevronDown className="text-primary h-6 w-6" />
        </button>
        <Separator className="bg-slate-200 mb-4" />
        <div className="flex flex-col gap-8 px-2">
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Clothing type</p>
            <div className="flex gap-4">
              <Badge variant="outline" className="rounded-sm font-normal">
                Shirt
              </Badge>
              <Badge variant="outline" className="rounded-sm font-normal">
                Trouser
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Specialist</p>
            <div className="flex gap-4">
              <Badge variant="outline" className="rounded-sm font-normal">
                Suis
              </Badge>
              <Badge variant="outline" className="rounded-sm font-normal">
                Bouba
              </Badge>
              <Badge variant="outline" className="rounded-sm font-normal">
                Kinte
              </Badge>
              <Badge variant="outline" className="rounded-sm font-normal">
                Agbada
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Experience Level</p>
            <Badge variant="outline" className="rounded-sm font-normal">
              2 - 3 years
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <h3 className="text-md font-semibold text-foreground mb-3 w-full flex flex-row justify-between gap-4">
          Designer
        </h3>
        <p className="p-1 pr-3 text-sm flex items-center gap-2 rounded-full shrink-0 font-semibold bg-slate-100 text-foreground-body">
          <span className="shrink-0 relative">
            <Image
              alt=""
              src="/img/webp/user.webp"
              height={25}
              width={25}
              className="rounded-full shrink-0 relative"
            />
          </span>
          <span className="whitespace-nowrap">James Earl</span>
        </p>
      </div>
    </div>
  );
};

export default ReviewPage;
