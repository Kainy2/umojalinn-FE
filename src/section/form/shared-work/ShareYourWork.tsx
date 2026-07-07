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
import { useCreateSharedWork } from "@/tanstack/hooks/useSharedWork";
import { cn, fileToPreviewUrl } from "@/lib/utils";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useId, useState } from "react";
import ProjectEditFooter from "@/section/form/project/edit/ProjectEditFooter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RatingStar from "@/icons/RatingStar";
import TextField from "@/components/custom/input/TextField";
import { toast } from "@/hooks/use-toast";

type SharedWorkImageEntry = {
  id: string | number;
  description: string;
  fileName: string;
  isCoverImage: boolean;
  image: string | File;
};

type WorkEntry = {
  localId: number;
  images: SharedWorkImageEntry[];
  selectedClothingTypes: string[];
};

const isWorkValid = (work: WorkEntry) => {
  return (
    work.images.length > 0 &&
    work.images.some((img) => img.isCoverImage) &&
    // Make description optional
    // work.images.every((img) => img.description.trim().length > 0) &&
    work.selectedClothingTypes.length > 0
  );
};

const ShareYourWorkForm = () => {
  const id = useId();
  const router = useRouter();

  const { mutate: createSharedWork, isPending: isSubmitting } = useCreateSharedWork();
  const { data: clothingTypesData } = useGetClothingTypes();
  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [works, setWorks] = useState<WorkEntry[]>([
    { localId: 0, images: [], selectedClothingTypes: [] },
  ]);
  const [entryTitles, setEntryTitles] = useState<Record<number, string>>({ 0: "" });

  const isFormValid = works.every(isWorkValid);

  const handleAddWork = useCallback(() => {
    const newId = Date.now();
    setWorks((prev) => [
      ...prev,
      { localId: newId, images: [], selectedClothingTypes: [] },
    ]);
    setEntryTitles((prev) => ({ ...prev, [newId]: "" }));
  }, []);

  const handleDeleteWork = useCallback((localId: number) => {
    setWorks((prev) => prev.filter((w) => w.localId !== localId));
    setEntryTitles((prev) => {
      const next = { ...prev };
      delete next[localId];
      return next;
    });
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
                  description: entryTitles[workLocalId] ?? "",
                  fileName: file.name,
                  isCoverImage: !work.images.length,
                  image: file,
                },
              ],
            };
          }),
        );
        setEntryTitles((prev) => ({ ...prev, [workLocalId]: "" }));
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
    [isFileSizeValid, entryTitles],
  );

  const handleDescriptionChange =
    (workLocalId: number, imageIndex: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setWorks((prev) =>
        prev.map((work) => {
          if (work.localId !== workLocalId) return work;
          return {
            ...work,
            images: work.images.map((img, i) =>
              i === imageIndex ? { ...img, description: e.target.value } : img,
            ),
          };
        }),
      );
    };

  const handleDeleteImage =
    (workLocalId: number, imageIndex: number) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setWorks((prev) =>
        prev.map((work) => {
          if (work.localId !== workLocalId) return work;
          const filtered = work.images.filter((_, i) => i !== imageIndex);
          // If deleted image was cover and there are remaining images, assign cover to first
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

      const formData = new FormData();
      works.forEach((work, wi) => {
        work.images.forEach(({ image }) => {
          formData.append(`[${wi}][images]`, image as File);
        });
        work.images.forEach(({ description, fileName, isCoverImage }, mi) => {
          formData.append(`[${wi}][imagesMeta][${mi}][description]`, description);
          formData.append(`[${wi}][imagesMeta][${mi}][fileName]`, fileName);
          formData.append(`[${wi}][imagesMeta][${mi}][isCoverImage]`, String(isCoverImage));
        });
        work.selectedClothingTypes.forEach((typeId, ti) => {
          formData.append(`[${wi}][clothingTypes][${ti}]`, typeId);
        });
      });

      createSharedWork(formData, {
        onSuccess() {
          setShowSuccessModal(true);
        },
      });
    },
    [works, createSharedWork],
  );

  const clothingTypeOptions =
    clothingTypesData?.data?.data?.map((type) => ({
      value: type.id,
      label: type.name,
    })) ?? [];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-bold mb-1">Share your work</h1>
      </div>

      {works.map((work, workIndex) => {
        const preview = work.images.map((val) => ({
          ...val,
          src: fileToPreviewUrl(val.image),
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
                            <Label htmlFor={`cover-radio-${work.localId}-${imageIndex}-${id}`}>
                              Use as cover image
                            </Label>
                            <RadioGroupItem
                              value=""
                              checked={value.isCoverImage}
                              onClick={handleCoverImageToggle(work.localId, imageIndex)}
                              id={`cover-radio-${work.localId}-${imageIndex}-${id}`}
                            />
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid w-full gap-1.5">
                      <TextField
                        value={value.description}
                        onChange={handleDescriptionChange(work.localId, imageIndex)}
                        maxLength={500}
                        hint={`${value?.description?.length || 0}/500 characters`}
                      />
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
                  <TextField
                    maxLength={500}
                    value={entryTitles[work.localId] ?? ""}
                    onChange={(e) =>
                      setEntryTitles((prev) => ({
                        ...prev,
                        [work.localId]: e.target.value,
                      }))
                    }
                    hint={`${entryTitles[work.localId]?.length || 0} / 500 characters`}
                  />
                </div>
              </div>
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

      <ProjectEditFooter
        leftButtonProps={{
          text: "Back",
          onClick: () => router.back(),
        }}
        rightPrimaryButtonProps={{
          text: "Publish",
          loading: isSubmitting,
          disabled: !isFormValid,
          onClick: handleSubmit,
        }}
      />

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
              router.push("/dashboard");
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <RatingStar
              stroke="#FAC515"
              className="mx-auto my-16 md:my-20 size-6 text-primary-600"
            />
            <DialogTitle className="pb-8 text-[20px] md:text-lg text-center">
              Your work has been published
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
