"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { CustomTagField } from "@/components/custom/tag/Select";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES } from "@/constant";
import { useFileSizeError } from "@/hooks/useFilePicker";
import { useGetClothingTypes } from "@/tanstack/hooks/useProject";
import {
  useCreateSharedWork,
  useGetSharedWorkById,
  useUpdateSharedWork,
} from "@/tanstack/hooks/useSharedWork";
import { cn, fileToPreviewUrl } from "@/lib/utils";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useId, useState } from "react";
import ProjectEditFooter from "@/section/form/project/edit/ProjectEditFooter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TextField from "@/components/custom/input/TextField";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type SharedWorkImageEntry = {
  id: string | number;
  imageId?: string; // ID from the API for existing images
  fileName: string;
  isCoverImage: boolean;
  image: string | File; // string = existing imageUrl, File = newly added
};

type WorkEntry = {
  localId: number;
  images: SharedWorkImageEntry[];
  selectedClothingTypes: string[];
  description: string;
};

const isWorkValid = (work: WorkEntry) => {
  return (
    work.images.length > 0 &&
    work.images.some((img) => img.isCoverImage) &&
    work.selectedClothingTypes.length > 0
  );
};

const ShareYourWorkForm = () => {
  const formId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const { mutate: createSharedWork, isPending: isCreating } = useCreateSharedWork();
  const { mutate: updateSharedWork, isPending: isUpdating } = useUpdateSharedWork();
  const { data: editData, isPending: isLoadingEdit } = useGetSharedWorkById(editId ?? undefined);
  const { data: clothingTypesData } = useGetClothingTypes();
  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [works, setWorks] = useState<WorkEntry[]>([
    { localId: 0, images: [], selectedClothingTypes: [], description: "" },
  ]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [editPopulated, setEditPopulated] = useState(false);

  // Populate form data from edit response
  useEffect(() => {
    if (!isEditMode || !editData?.data?.data || editPopulated) return;

    const work = editData.data.data;
    setWorks([
      {
        localId: 0,
        images: work.images.map((img, i) => ({
          id: i,
          imageId: img.id,
          fileName: img.imageUrl.split("/").pop() || `image-${i}`,
          isCoverImage: img.isCoverImage,
          image: img.imageUrl, // existing image as string URL
        })),
        selectedClothingTypes: work.clothingTypes.map((t) => t.id),
        description: work.description || "",
      },
    ]);
    setRemovedImageIds([]);
    setEditPopulated(true);
  }, [isEditMode, editData, editPopulated]);

  const isSubmitting = isCreating || isUpdating;
  const isFormValid = works.every(isWorkValid);

  const handleAddWork = useCallback(() => {
    const newId = Date.now();
    setWorks((prev) => [
      ...prev,
      { localId: newId, images: [], selectedClothingTypes: [], description: "" },
    ]);
  }, []);

  const handleDeleteWork = useCallback((localId: number) => {
    setWorks((prev) => prev.filter((w) => w.localId !== localId));
  }, []);

  const handleFileSelect = useCallback(
    (workLocalId: number, file: File) => {
      if (isFileSizeValid(file)) {
        setWorks((prev) =>
          prev.map((work) => {
            if (work.localId !== workLocalId) return work;
            return {
              ...work,
              images: [
                ...work.images,
                {
                  id: work.images.length,
                  fileName: file.name,
                  isCoverImage: !work.images.length,
                  image: file,
                },
              ],
            };
          }),
        );
      } else {
        toast({
          title: "File error",
          description: `Maximum file size is ${MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES / (1024 * 1024)}MB, this file is ${(
            file.size / (1024 * 1024)
          ).toFixed(2)}MB. You can compress the image using an image editor and try uploading again.`,
          variant: "destructive",
        });
      }
    },
    [isFileSizeValid],
  );

  const handleDescriptionChange =
    (workLocalId: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setWorks((prev) =>
        prev.map((work) =>
          work.localId === workLocalId
            ? { ...work, description: e.target.value }
            : work,
        ),
      );
    };

  const handleDeleteImage =
    (workLocalId: number, imageIndex: number) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setWorks((prev) =>
        prev.map((work) => {
          if (work.localId !== workLocalId) return work;
          const deletedImage = work.images[imageIndex];
          // Track removed existing images for edit mode
          if (deletedImage?.imageId) {
            setRemovedImageIds((ids) => [...ids, deletedImage.imageId!]);
          }
          const filtered = work.images.filter((_, i) => i !== imageIndex);
          const hasCover = filtered.some((img) => img.isCoverImage);
          return {
            ...work,
            images:
              !hasCover && filtered.length > 0
                ? filtered.map((img, i) => ({ ...img, isCoverImage: i === 0 }))
                : filtered,
          };
        }),
      );
    };

  const handleCoverImageToggle =
    (workLocalId: number, imageIndex: number) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setWorks((prev) =>
        prev.map((work) => {
          if (work.localId !== workLocalId) return work;
          return {
            ...work,
            images: work.images.map((img, i) => ({
              ...img,
              isCoverImage: i === imageIndex,
            })),
          };
        }),
      );
    };

  const handleClothingTypeChange = useCallback(
    (workLocalId: number, value: string[]) => {
      setWorks((prev) =>
        prev.map((work) =>
          work.localId === workLocalId
            ? { ...work, selectedClothingTypes: value }
            : work,
        ),
      );
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (isEditMode && editId) {
        // Edit mode: PUT with individual form fields
        const work = works[0];
        const formData = new FormData();

        if (work.description) {
          formData.append("description", work.description);
        }

        work.selectedClothingTypes.forEach((id, i) => {
          formData.append(`clothingTypes[${i}]`, id);
        });

        removedImageIds.forEach((id, i) => {
          formData.append(`imageIdsToRemove[${i}]`, id);
        });

        // Only append new File images
        const newImages = work.images.filter(
          (img) => img.image instanceof File,
        );
        newImages.forEach(({ image }) => {
          formData.append("images", image as File);
        });

        // imagesMeta only for new images
        if (newImages.length > 0) {
          const imagesMeta = newImages.map(({ fileName, isCoverImage }) => ({
            fileName,
            isCoverImage,
          }));
          formData.append("imagesMeta", JSON.stringify(imagesMeta));
        }

        updateSharedWork(
          { id: editId, body: formData },
          {
            onSuccess() {
              setShowSuccessModal(true);
            },
          },
        );
      } else {
        // Create mode: POST with sharedWorks JSON
        const formData = new FormData();

        works.forEach((work) => {
          work.images.forEach(({ image }) => {
            formData.append("images", image as File);
          });
        });

        const sharedWorks = works.map((work) => ({
          clothingTypes: work.selectedClothingTypes,
          imagesMeta: work.images.map(({ fileName, isCoverImage }) => ({
            fileName,
            isCoverImage,
          })),
          ...(work.description ? { description: work.description } : undefined),
        }));
        formData.append("sharedWorks", JSON.stringify(sharedWorks));

        createSharedWork(formData, {
          onSuccess() {
            setShowSuccessModal(true);
          },
        });
      }
    },
    [works, createSharedWork, updateSharedWork, isEditMode, editId, removedImageIds],
  );

  const clothingTypeOptions =
    clothingTypesData?.data?.data?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  if (isEditMode && isLoadingEdit) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-bold mb-1">
          {isEditMode ? "Edit your work" : "Share your work"}
        </h1>
      </div>

      {works.map((work, workIndex) => {
        const preview = work.images.map((val) => ({
          ...val,
          src:
            typeof val.image === "string"
              ? val.image // existing imageUrl
              : fileToPreviewUrl(val.image),
        }));

        return (
          <div key={work.localId}>
            {works.length > 1 && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Work {workIndex + 1}</h2>
                <button
                  type="button"
                  onClick={() => handleDeleteWork(work.localId)}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <X className="h-4 w-4 text-foreground-body" />
                </button>
              </div>
            )}

            <FormItemWrapper
              title={workIndex === 0 ? "Build your portfolio" : undefined}
              description={workIndex === 0 ? "Upload styling images of previous jobs" : undefined}
            >
              <div className="flex flex-col gap-8 mb-8">
                {preview.map((value, imageIndex) => (
                  <div key={value.id} className="flex flex-col gap-4">
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
                          onClick={handleDeleteImage(work.localId, imageIndex)}
                          className="absolute top-4 right-4 rounded-full p-2 bg-white"
                        >
                          <Trash2 className="text-primary h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-end">
                        <RadioGroup>
                          <div className="flex flex-row items-center space-x-2">
                            <Label htmlFor={`cover-radio-${work.localId}-${imageIndex}-${formId}`}>
                              Use as cover image
                            </Label>
                            <RadioGroupItem
                              value=""
                              checked={value.isCoverImage}
                              onClick={handleCoverImageToggle(work.localId, imageIndex)}
                              id={`cover-radio-${work.localId}-${imageIndex}-${formId}`}
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
                    work.images.length >= 8 && "hidden",
                  )}
                >
                  <FileUploadPicker
                    className="w-full"
                    accept="image/*"
                    onSelect={(file) => {
                      if (file) handleFileSelect(work.localId, file as File);
                    }}
                  />
                </div>
              </div>
            </FormItemWrapper>

            <FormItemWrapper title="Description" description="Tell us about the work you’re about to share" className="mb-8">
              <TextField
                value={work.description}
                onChange={handleDescriptionChange(work.localId)}
                maxLength={500}
                hint={`${work.description.length}/500 characters`}
              />
            </FormItemWrapper>

            <FormItemWrapper>
              <CustomTagField
                hint={`${work.selectedClothingTypes.length}/8 tags`}
                options={clothingTypeOptions}
                value={work.selectedClothingTypes}
                onChange={(val) => handleClothingTypeChange(work.localId, val)}
              />
            </FormItemWrapper>
          </div>
        );
      })}

      {!isEditMode && (
        <div className="my-8">
          <Button
            type="button"
            variant="ghost"
            className="text-primary border border-dashed border-primary w-full"
            onClick={handleAddWork}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Work
          </Button>
        </div>
      )}

      <ProjectEditFooter
        leftButtonProps={{
          text: "Back",
          onClick: () => router.back(),
        }}
        rightPrimaryButtonProps={{
          text: isEditMode ? "Update" : "Publish",
          loading: isSubmitting,
          disabled: !isFormValid,
          onClick: handleSubmit,
        }}
      />

      {/* Success modal */}
      <Dialog open={showSuccessModal}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <button
            type="button"
            className="absolute z-10 right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => {
              setShowSuccessModal(false);
              router.push(isEditMode ? "/settings/profile/portfolio" : "/dashboard");
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <Image src="/gif/good-tick.gif" alt="Success" width={300} height={300} className="mx-auto" />

            <DialogTitle className="pb-8 text-[20px] md:text-lg text-center">
              {isEditMode ? "Your work has been updated" : "Your work has been published"}
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
            <Button
              fullWidth
              onClick={() => router.push("/settings/profile/portfolio")}
            >
              View portfolio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareYourWorkForm;
