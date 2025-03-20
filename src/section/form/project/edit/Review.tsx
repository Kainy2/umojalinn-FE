"use client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { uuidToBase62Safe } from "@/lib/uuid";
import ProjectReviewView from "@/section/dashboard/project/Review";
import ProjectEditFooter from "@/section/form/project/edit/Footer";
import {
  useGetProjectById,
  usePostProjectLive,
} from "@/tanstack/hooks/useProject";
import { useRouter } from "next/navigation";
import React from "react";
import { ProjectFormProps } from "./Description";

const ReviewForm = (props: ProjectFormProps) => {
  const { data, isPending: projectLoading } = useGetProjectById(props?.id);
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: goLive, isPending } = usePostProjectLive({
    onSuccess: () => {
      router.push(`/projects/ads/${uuidToBase62Safe(props?.id)}`);
      toast({
        title: "Project Live!",
        description: "This project has been pushed live successfully",
      });
    },
  });

  if (projectLoading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <Skeleton className="h-6 mb-2 max-w-32" />
          <Skeleton className="h-4 max-w-48" />
        </div>
        <Separator className="bg-gray-200" />
        <ProjectReviewView loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-md font-semibold text-foreground mb-1">
          Confirm details
        </h3>
        <p className="text-foreground-body text-sm">
          Please check and confirm that the information you added about this
          project is correct
        </p>
      </div>
      <Separator className="bg-gray-200" />
      <ProjectReviewView project={data?.data?.data} />
      <ProjectEditFooter
        handleSave={async () => goLive(props?.id)}
        loading={isPending}
        handleDraft={() => router?.push("/projects")}
        saveText="Post"
      />
    </div>
  );
};

export default ReviewForm;
