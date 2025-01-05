"use client";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import ProjectReviewView from "@/section/dashboard/project/Review";
import ProjectEditFooter from "@/section/form/project/edit/Footer";
import {
  useGetProjectById,
  usePostProjectLive,
} from "@/tanstack/hooks/useProject";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ReviewPage = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetProjectById(params.id);
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: goLive, isPending } = usePostProjectLive({
    onSuccess: () => {
      router.push(`/projects/${params.id}`);
      toast({
        title: "Project Live!",
        description: "This project has been pushed live successfully",
      });
    },
  });
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
      <Separator className="bg-gray-200" />
      <ProjectReviewView project={data?.data?.data} />
      <ProjectEditFooter
        handleSave={async () => goLive(params.id)}
        loading={isPending}
        hideDraft
      />
    </div>
  );
};

export default ReviewPage;
