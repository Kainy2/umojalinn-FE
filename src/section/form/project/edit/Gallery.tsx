"use client";
import TextField from "@/components/custom/input/TextField";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn, fileToPreviewUrl, getProjectImageDetailUpdate, jsonToFormData } from "@/lib/utils";
import {
  useGetProjectById,
  useUpdateProjectById,
} from "@/tanstack/hooks/useProject";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useId, useMemo, useState } from "react";
import ProjectEditFooter from "./ProjectEditFooter";
// import ProjectEditFooter from "./Footer";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { ProjectFormProps } from "./Description";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { useFileSizeError } from "@/hooks/useFilePicker";
import { MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES } from "@/constant";
import { useCreateProjectContext } from "@/hooks/create-project/useCreateProjectContext";

const ProjectGalleryForm = (props: ProjectFormProps) => {
  const id = useId();
  const [submittingButtonType, setSubmittingButtonType] = useState<'DRAFT' | 'SAVE'>('SAVE')
  const { data, isPending: loadingProject } = useGetProjectById(props?.id);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectById(
    props?.id
  );
  const { toast } = useToast();
  const router = useRouter();
  const { projectFormDetails, setProjectFormDetails } = useCreateProjectContext()
  const isAds = data?.data.data.status === 'ADS'

  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);
  const [values, setValues] = useState<
    {
      id: string | number;
      title: string;
      fileName: string;
      isCoverImage: boolean;
      image: string | File;
    }[]
  >([]);

  useMemo(() => {
    if (isAds && !!projectFormDetails.gallery?.length){
      setValues(projectFormDetails.gallery)
      return 
    }

    if (data?.data?.data?.Gallery) {
      setValues(data?.data?.data?.Gallery.map((gallery) => ({
        id: gallery?.id,
        title: gallery.title,
        fileName: gallery.imageUrl,
        isCoverImage: gallery.isCoverImage,
        image: gallery.imageUrl,
      }) ) || []);
    }
  }, [data?.data?.data?.Gallery, projectFormDetails.gallery, isAds]);

  const preview = useMemo(() => {
    return values?.map((val) => ({
      id: val?.id,
      title: val.title,
      src: fileToPreviewUrl(val.image),
      isCoverImage: val.isCoverImage,
    }));
  }, [values]);

  const [entryTitle, setEntryTitle] = useState("");

  const handleFileSelect = useCallback(
    (file: File | null) => {
      const fileObject = file as File;

      if (fileObject.size < MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES) {
        setValues((prev) => [
          ...prev,
          {
            id: prev?.length,
            title: entryTitle,
            fileName: (file as File).name,
            isCoverImage: !prev?.length,
            image: file as File,
          },
        ]);
        setEntryTitle("");
      } else {
        toast({
          title: "File error",
          description: `Maximum file size is ${MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES/(1024 * 1024)}MB, this file is ${(
            fileObject.size /
            (1024 * 1024)
          ).toFixed(2)}MB. . You can compress the image using an image editor and try uploading again.`,
          variant: "destructive",
        });
      }
    },
    [entryTitle, toast]
  );

  const handleTitleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValues((prev) =>
        prev.map((val, i) =>
          i === index ? { ...val, title: e.target.value } : val
        )
      );
    };

  const handleDelete =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setValues((prev) => prev.filter((_, i) => i !== index));
    };

  const handleCoverImageToggle =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      
      setValues((prev) =>
        prev.map((val, i) =>
          i === index
            ? { ...val, isCoverImage: !val.isCoverImage }
            : { ...val, isCoverImage: false }
        )
      );
    };



  const handleSubmit = useCallback(
    (mode: "SAVE" | "DRAFT") =>
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSubmittingButtonType(mode)

        if (isAds){
          setProjectFormDetails( prev => ({...prev, gallery: values }))
          router.push(`/project/${uuidToBase62Safe(props?.id)}/requirements-and-budget`);
          return
        }

        // const oldIdList = values
        //   ?.map((val) => val?.id)
        //   .filter((val) => typeof val === "string");
        // const toAdd = values?.filter((val) => typeof val?.image !== "string");


        updateProject(
          jsonToFormData({
            ...getProjectImageDetailUpdate(values, data?.data?.data?.Gallery),

            // imagesMeta: toAdd?.map(({ title, fileName, isCoverImage }) => ({
            //   title,
            //   fileName,
            //   isCoverImage,
            // })),
            // "gallery-images": toAdd.map(({ image }) => image),
            // imagesToRemove: data?.data?.data?.Gallery?.filter(
            //   (gallery) => !oldIdList.includes(gallery?.id)
            // )?.map(({ id }) => id),
          }),
          {
            onSuccess() {
              router.push(
                mode === "DRAFT"
                  ? "/projects/drafts"
                  : `${
                      !!props.isOnboarding ? "/onboard" : ""
                    }/project/${uuidToBase62Safe(
                      props?.id
                    )}/requirements-and-budget`
              );
            },
          }
        );
      },
    [
      data?.data?.data?.Gallery,
      props?.id,
      props.isOnboarding,
      router,
      updateProject,
      values,
      isAds,
      setProjectFormDetails,

    ]
  );

  if (loadingProject) {
    return (
      <FormItemWrapper loading>
        <div className="flex gap-4 flex-col">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </FormItemWrapper>
    );
  }
console.log(preview, "preview");

  return (
    <>
      <FormItemWrapper
        title="Project Gallery"
        description="Upload styling inspiration to help designers."
      >
        <div className="flex flex-col gap-8 mb-8">
          {preview.map((value, index) => (
            <div key={value?.id} className="flex flex-col gap-4">
              <TextField
                value={value.title}
                onChange={handleTitleChange(index)}
                maxLength={500}
                hint={`${value?.title?.length || 0}/500 characters`}
              />
              <div>
                <div className="relative h-52 mb-4">
                  <Image
                    className="absolute object-cover object-top"
                    fill
                    src={value.src || "/img/svg/null.svg"}
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={handleDelete(index)}
                    className="absolute top-4 right-4 rounded-full p-2 bg-white"
                  >
                    <Trash2 className="text-primary h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center justify-end">
                  <RadioGroup>
                    <div className="flex flex-row items-center space-x-2">
                      <Label htmlFor={`radio-group-item-${index + 0}-${id}`}>
                        Use as cover image
                      </Label>
                      <RadioGroupItem
                        value=""
                        checked={value?.isCoverImage}
                        onClick={handleCoverImageToggle(index)}
                        id={`radio-group-item-${index + 0}-${id}`}
                      />
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          ))}
          
          <div
            className={cn(
              "flex flex-col gap-4",
              values?.length >= 8 && "hidden"
            )}
          >
            <TextField
              maxLength={500}
              value={entryTitle}
              onChange={(e) => setEntryTitle(e.target.value)}
              hint={`${entryTitle?.length || 0} / 500 characters`}
            />
            <FileUploadPicker
              accept="image/*"
              onSelect={(file) => {
                const typedFile = file as File;
                if (isFileSizeValid(typedFile)) {
                  handleFileSelect(typedFile);
                }
              }}
            />
          </div>
        </div>
      </FormItemWrapper>
      {/* <ProjectEditFooter
        handleSave={handleSubmit("SAVE")}
        handleDraft={handleSubmit("DRAFT")}
        loading={isUpdating}
      /> */}


      <ProjectEditFooter
        leftButtonProps={{ 
          onClick: (e) => {
            if (isAds) handleSubmit("SAVE")(e);
            else handleSubmit("DRAFT")(e);
            router.back()
          }
        }}
        rightSecondaryButtonProps={{
          text: isAds ? "Cancel" : "Save & Exit", 
          loading: isUpdating && submittingButtonType === "DRAFT",
          onClick: (e) => {
              if (isAds) router.push(`/projects/ads/${uuidToBase62Safe(props?.id)}`);
              else handleSubmit("DRAFT")(e);
          },
        }}
        rightPrimaryButtonProps={{
          text: isAds ? "Next" : undefined,
          loading: isUpdating && submittingButtonType === "SAVE",
          onClick: handleSubmit("SAVE"),
        }}
      />
    </>
  );
};

export default ProjectGalleryForm;
