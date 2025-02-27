"use client";
import GalleryImages from "@/components/custom/GalleryImages";
import LabelValue from "@/components/custom/LabelValue";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getCurrencySymbol } from "@/lib/string";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useCreateBid } from "@/tanstack/hooks/useBid";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { formatDate } from "date-fns";
import { CircleDollarSign, MoreVertical } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useGetProjectById(id);
  const project = data?.data?.data;
  const { toast } = useToast();
  const router = useRouter();

  const { data: session } = useSession();

  const { mutate: createBid, isPending: isCreatingBid } = useCreateBid({
    onSuccess(data) {
      router.push(`/bids/${uuidToBase62Safe(data?.data?.data?.id)}/edit`);
      toast({ description: "Please wait" });
    },
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-52" />
          <div className="flex px-12">
            <div className="relative w-40">
              <Skeleton className="size-40 absolute bottom-0" />
            </div>
            <div className="flex-1 p-6 pb-3">
              <Skeleton className="h-8 w-full max-w-44 mb-4" />
              <Skeleton className="h-4 w-full max-w-64" />
            </div>
            <div className="pt-6 flex flex-row items-center gap-2">
              <Skeleton className="size-10" />
              <Skeleton className="h-10 w-36 " />
            </div>
          </div>
        </div>
        <Skeleton className="h-14" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Image
          src={
            project?.Gallery?.find((gallery) => gallery?.isCoverImage)
              ?.imageUrl || "/img/svg/null.svg"
          }
          height={1000}
          width={1000}
          alt=""
          className="h-52 object-cover w-full"
        />
        <div className="flex px-12">
          <div className="relative w-40">
            <Image
              className="object-cover size-40 absolute bottom-0 bg-background"
              src={project?.Gallery?.[0]?.imageUrl || "/img/svg/null.svg"}
              width={400}
              height={400}
              alt=""
            />
          </div>
          <div className="flex-1 p-6 pb-3">
            <h1 className="text-subtitle-1 font-bold mb-2">
              {project?.title || "No title"}
            </h1>
            <div className="flex items-center gap-2 [&>svg]:size-6 [&>svg]:text-gray-300">
              <CircleDollarSign />
              <p>
                {getCurrencySymbol(project?.currency)}
                {project?.budget || 0}
              </p>
              {project?.negotiable && (
                <p className="bg-gray-100 p-2 py-1 text-foreground-body text-sm rounded-full flex items-center gap-1 before:content-[''] before:size-2 before:block before:bg-gray-500 before:rounded-full ">
                  Negotiable
                </p>
              )}
            </div>
          </div>
          <div className="pt-6 flex flex-row items-center gap-2">
            <Button variant="outline">
              <MoreVertical />
            </Button>
            {!project?.bids?.length &&
              session?.user?.profileRole === "DESIGNER" && (
                <Button
                  variant="default"
                  onClick={() => createBid(id)}
                  loading={isCreatingBid}
                >
                  Create Bid
                </Button>
              )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 flex items-center gap-2">
        <Image
          src={
            project?.designer?.user?.profilePhotoUri || "/img/webp/user.webp"
          }
          alt=""
          height={200}
          width={200}
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <div className="text-foreground-body">
          <h3 className="font-semibold mb-2 text-foreground">
            {`${project?.buyer?.user?.firstName || ""} ${
              project?.buyer?.user?.lastName || ""
            }`.trim() || "No buyer"}
          </h3>
          <p>{project?.buyer?.user?.address?.country}</p>
        </div>
      </div>
      <div className="description-section">
        <h3>About Job</h3>
        <p>{project?.about || "None"}</p>
      </div>
      <div className="bg-gray-50 p-8 gap-8 gap-y-12 grid grid-cols-3">
        <LabelValue
          label="Delivery Location"
          value={project?.deliveryAddress?.country || ""}
        />
        <LabelValue
          label="Project Due Date"
          value={
            project?.dueDate
              ? formatDate(new Date(project?.dueDate), "dd MMM, yyyy")
              : "None"
          }
        />
        <LabelValue label="Years of experience" value={"None"} />
        <LabelValue
          className="col-span-2"
          label="Categories"
          value={project?.clothingTypes?.map((type) => type.name) || "None"}
        />
      </div>
      <div className="description-section">
        <h3>Additional Notes</h3>
        <p>{project?.additionalNotes || "None"}</p>
      </div>
      <div>
        <h3 className="text-subtitle-2 font-bold mb-2">Styling inspiration</h3>
        <p className="text-sm text-foreground-body mb-8">Project images</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {project?.Gallery?.map((gallery) => (
            <GalleryImages
              title={gallery?.title}
              src={gallery?.imageUrl}
              height={500}
              width={500}
              wrapperClassName="aspect-square"
              key={gallery.id}
            />
          )) || (
            <Image
              alt=""
              src="/img/svg/null.svg"
              height={500}
              width={500}
              className="object-cover aspect-square"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPage;
