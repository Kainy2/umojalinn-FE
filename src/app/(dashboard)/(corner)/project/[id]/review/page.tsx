"use client";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateProjectContext } from "@/hooks/create-project/useCreateProjectContext";
import { useToast } from "@/hooks/use-toast";
import { jsonToFormData } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
import ProjectReviewView from "@/section/dashboard/project/Review";
import ProjectEditFooter from "@/section/form/project/edit/ProjectEditFooter";
// import ProjectEditFooter from "@/section/form/project/edit/Footer";
import {
  useGetProjectById,
  usePostProjectLive,
  useUpdateProjectById,
} from "@/tanstack/hooks/useProject";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ReviewPage = () => {
  const params = useParams<{ id: string }>();
  const { data, isPending: projectLoading } = useGetProjectById(params?.id);
  const { toast } = useToast();
  const router = useRouter();
  const { projectFormDetails, setProjectFormDetails } = useCreateProjectContext()
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectById(params?.id);
  const { mutate: goLive, isPending } = usePostProjectLive({
    onSuccess: () => {
      router.push(`/projects/ads/${uuidToBase62Safe(params?.id)}`);
      toast({
        title: "Project Live!",
        description: "The project has been sent to your designer for review.",
      });
    },
  });

  const isAds = data?.data.data.status === 'ADS'

  const onAdsSubmit = () => {
		// const { firstName, lastName, designerId, ...values } = projectFormDetails;
    const values = projectFormDetails

    const oldIdList = values.gallery
      ?.map((val) => val?.id)
      .filter((val) => typeof val === "string");
    const toAdd = values.gallery?.filter((val) => typeof val?.image !== "string");

		const val = jsonToFormData({
      // Description Details
      gender: values?.gender,
      address: values?.address,
      title: values?.title,
      about: values?.about,
      additionalNotes: values?.additionalNotes,
      dueDate: values?.dueDate,
      country: values?.country,
      city: values?.city,
      state: values?.state,
      zipCode: values?.zipCode,
      clothingTypes: values?.clothingTypes,
      submit: values?.submit,
      
      // Gallery Details
      imagesMeta: toAdd?.map(({ title, fileName, isCoverImage }) => ({
				title,
				fileName,
				isCoverImage,
			})),
			"gallery-images": toAdd?.map(({ image }) => image),
			imagesToRemove: data?.data?.data?.Gallery?.filter(
				(gallery) => !oldIdList?.includes(gallery?.id)
			)?.map(({ id }) => id),

      // Requirement and Budget Details
      currency: values?.currency,
      specialist: values?.specialist,
      experienceLevel: values?.experienceLevel,
      budget:  values?.budget,
      negotiable: values?.negotiable,

		});

		updateProject(val, {
			onSuccess: () => {
        setProjectFormDetails({})
        toast({
          title: "Live Project Updated!",
          description: "The project has been updated and sent to your designer for review.",
        });
				router.push(`/projects/ads/${uuidToBase62Safe(params?.id)}`);
			},
		});
  };


  const dataToBePassed = isAds
		? {

    }
		: data?.data?.data;

  console.log({dataToBePassed});

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
      <ProjectReviewView 
        project={data?.data?.data}  
        projectFormDetails={projectFormDetails} 
        isAds={isAds} 
      />
      {/* <ProjectEditFooter
        handleSave={async () => goLive(params?.id)}
        loading={isPending}
        hideDraft
        saveText="Post"
      /> */}

      <ProjectEditFooter
        rightSecondaryButtonProps={!isAds ? undefined :{
            text: "Cancel", 
            disabled: isUpdating,
            onClick: () => {
              router.push(`/projects/ads/${uuidToBase62Safe(params?.id)}`);
            },
          }}
        rightPrimaryButtonProps={{
          text: isAds ? "Update" : "Post",
          disabled: isPending || isUpdating,
          onClick: () => isAds ? onAdsSubmit() : goLive(params?.id),
        }}
      />

    </div>
  );
};

export default ReviewPage;
