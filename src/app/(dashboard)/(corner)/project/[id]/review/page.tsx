"use client";
import Collapsible from "@/components/custom/Collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProjectEditFooter from "@/section/form/project/edit/Footer";
import {
  useGetProjectById,
  usePostProjectLive,
} from "@/tanstack/hooks/useProject";
import { formatDate } from "date-fns";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const ReviewPage = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetProjectById(params.id);
  const { mutateAsync, isPending } = usePostProjectLive();
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
          {data?.data?.data?.title || "No title"}
        </h3>
        <p className="text-muted-foreground text-sm mb-8">
          {data?.data?.data?.about || "No description"}
        </p>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Project due:{" "}
            <span className="font-semibold">
              {data?.data?.data?.dueDate
                ? formatDate(data?.data?.data?.dueDate, "MMM dd, yyyy")
                : "None"}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Project budget:{" "}
            <span className="font-semibold">
              {data?.data?.data?.currency === "EURO" && "€"}
              {data?.data?.data?.currency === "NAIRA" && "₦"}
              {data?.data?.data?.budget || "0"}
            </span>
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-foreground mb-2">
          Project Gallery
        </h3>
        <div className="flex flex-row gap-4">
          {data?.data?.data?.Gallery?.map?.((gallery) => (
            <Image
              key={gallery.id}
              alt=""
              src={gallery.imageUrl}
              className="shrink-0 aspect-video object-cover"
              width={310}
              height={170}
            />
          ))}
        </div>
      </div>
      <Collapsible title="Delivery Details">
        <div className="flex justify-between">
          <p className="text-sm text-foreground-body">Country</p>
          {data?.data?.data?.country && (
            <Badge variant="outline" className="rounded-sm font-normal">
              {data?.data?.data?.country}
            </Badge>
          )}
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-foreground-body">City</p>
          {data?.data?.data?.city && (
            <Badge variant="outline" className="rounded-sm font-normal">
              {data?.data?.data?.city}
            </Badge>
          )}
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-foreground-body">
            Province / State / Zip code
          </p>
          <div className="flex gap-4">
            {data?.data?.data?.state && (
              <Badge variant="outline" className="rounded-sm font-normal">
                {data?.data?.data?.state}
              </Badge>
            )}
            {data?.data?.data?.zipCode && (
              <Badge variant="outline" className="rounded-sm font-normal">
                {data?.data?.data?.zipCode}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-foreground-body">Address</p>
          {data?.data?.data?.address && (
            <Badge
              variant="outline"
              className="rounded-sm font-normal max-w-48"
            >
              {data?.data?.data?.address}
            </Badge>
          )}
        </div>
      </Collapsible>
      <Collapsible title="Other Details">
        <div className="flex justify-between">
          <p className="text-sm text-foreground-body">Clothing type</p>
          <div className="flex gap-4">
            {data?.data?.data?.clothingTypes?.map?.((type) => (
              <Badge
                key={type.id}
                variant="outline"
                className="rounded-sm font-normal"
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </div>
        {/* <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Specialist</p>
            <div className="flex gap-4">
              {data?.data?.data?.specialist && (
                <Badge variant="outline" className="rounded-sm font-normal">
                  {data?.data?.data?.specialist}
                </Badge>
              )}
            </div>
          </div> */}
        {/* <div className="flex justify-between">
            <p className="text-sm text-foreground-body">Experience Level</p>
            <Badge variant="outline" className="rounded-sm font-normal">
              2 - 3 years
            </Badge>
          </div> */}
      </Collapsible>
      <div className="flex justify-between">
        <h3 className="text-md font-semibold text-foreground mb-3 w-full flex flex-row justify-between gap-4">
          Designer
        </h3>
        <p className="p-1 pr-3 text-sm flex items-center gap-2 rounded-full shrink-0 font-semibold bg-slate-100 text-foreground-body">
          <span className="shrink-0 relative">
            <Image
              alt=""
              src={
                data?.data?.data?.designer?.user?.profilePhotoUri ||
                "/img/webp/user.webp"
              }
              height={25}
              width={25}
              className="rounded-full shrink-0 relative"
            />
          </span>
          <span className="whitespace-nowrap">
            {data?.data?.data?.designer?.user?.firstName}{" "}
            {data?.data?.data?.designer?.user?.lastName}
          </span>
        </p>
      </div>
      <ProjectEditFooter
        handleSave={async () => {
          return !!(await mutateAsync(params.id));
        }}
        nextUrl={`/project/view/${params.id}`}
        loading={isPending}
        hideDraft
      />
    </div>
  );
};

export default ReviewPage;
