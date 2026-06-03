"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { CustomTagField } from "@/components/custom/tag/Select";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES } from "@/constant";
import { useFileSizeError } from "@/hooks/useFilePicker";
import { useGetClothingTypes } from "@/tanstack/hooks/useProject";
import { useCreateSharedWork } from "@/tanstack/hooks/useSharedWork";
import { cn, fileToPreviewUrl, jsonToFormData } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useId, useMemo, useState } from "react";
import ProjectEditFooter from "@/section/form/project/edit/ProjectEditFooter";

type SharedWorkImageEntry = {
  id: string | number;
  description: string;
  fileName: string;
  isCoverImage: boolean;
  image: string | File;
};

const ShareYourWorkForm = () => {
  const id = useId();
  const router = useRouter();

  const { mutate: createSharedWork, isPending: isSubmitting } = useCreateSharedWork();
  const { data: clothingTypesData } = useGetClothingTypes();
  const { isFileSizeValid } = useFileSizeError(MAX_FILE_SIZE_FOR_FILE_UPLOAD_BYTES);
  const [ submitTries, setSubmitTries ] = useState(0)
  const [values, setValues] = useState<SharedWorkImageEntry[]>([]);
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>([]);

  const hasAtLeastOneImage = values.length > 0;
  const hasCoverImage = values.some((v) => v.isCoverImage);
  const allDescriptionsFilled = values.every((v) => v.description.trim().length > 0);
  const hasClothingType = selectedClothingTypes.length > 0;
  const isFormValid =
    hasAtLeastOneImage && hasCoverImage && allDescriptionsFilled && hasClothingType;
    const hasTriedToSubmmit = submitTries > 0;

  

  const preview = useMemo(() => {
    return values.map((val) => ({
      ...val,
      src: fileToPreviewUrl(val.image),
    }));
  }, [values]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (isFileSizeValid(file)) {
        setValues((prev) => [
          ...prev,
          {
            id: prev.length,
            description: "",
            fileName: file.name,
            isCoverImage: !prev.length,
            image: file,
          },
        ]);
      }
    },
    [isFileSizeValid],
  );

  const handleDescriptionChange =
    (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      setValues((prev) =>
        prev.map((val, i) =>
          i === index ? { ...val, description: e.target.value } : val,
        ),
      );
    };

  const handleDelete =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setValues((prev) => prev.filter((_, i) => i !== index));
    };

  const handleCoverImageToggle =
    (index: number) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setValues((prev) =>
        prev.map((val, i) =>
          i === index
            ? { ...val, isCoverImage: true }
            : { ...val, isCoverImage: false },
        ),
      );
    };

  const handleSubmit = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setSubmitTries(prev => prev + 1);

      const formData = jsonToFormData({
        clothingTypes: selectedClothingTypes,
        images: values.map(({ image }) => image),
        imagesMeta: values.map(({ description, fileName, isCoverImage }) => ({
          description,
          fileName,
          isCoverImage,
        })),
      });

      createSharedWork(formData, {
        onSuccess() {
          router.push("/dashboard");
        },
      });
    },
    [values, selectedClothingTypes, createSharedWork, router],
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-bold mb-1">Share your work</h1>
      </div>

      <FormItemWrapper
      title="Build your portfolio"
      description=" Upload styling images of previous jobs"
      // title="Your Work"
      // description="Upload styling images of previous jobs."
      >
        <div className="flex flex-col gap-8 mb-8">
          {preview.map((value, index) => (
            <div key={value.id} className="flex flex-col gap-4 ">
              <div className="grid w-full gap-1.5 ">
                <Textarea
                  value={value.description}
                  onChange={handleDescriptionChange(index)}
                  maxLength={250}
                  placeholder="Image Descriptions"
                  rows={3}
                />
                {value.description.trim().length === 0 && hasTriedToSubmmit ? (
                  <p className="text-sm text-red-500">Description is required.</p>
                ) : (
                  <p className="text-sm text-foreground-body">
                    {value.description.length}/250 characters
                  </p>
                )}
              </div>

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
                      <Label htmlFor={`cover-radio-${index}-${id}`}>
                        Use as cover image
                      </Label>
                      <RadioGroupItem
                        value=""
                        checked={value.isCoverImage}
                        onClick={handleCoverImageToggle(index)}
                        id={`cover-radio-${index}-${id}`}
                      />
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          ))}

          <div className={cn(values.length >= 8 && "hidden")}>
            <FileUploadPicker
              className="w-full"
              accept="image/*"
              onSelect={(file) => {
                if (file) handleFileSelect(file as File);
              }}
            />
          </div>

          {!hasAtLeastOneImage && hasTriedToSubmmit && (
            <p className="text-sm text-red-500">Upload at least one image.</p>
          )}
          {hasAtLeastOneImage && !hasCoverImage && hasTriedToSubmmit && (
            <p className="text-sm text-red-500">Select a cover image.</p>
          )}
        </div>
      </FormItemWrapper>

      <FormItemWrapper
        // title="Clothing type"
        // description="Select the clothing types featured in your work."
      >
        <CustomTagField
          hint={`${selectedClothingTypes.length}/8 tags`}
          options={
            clothingTypesData?.data?.data?.map((type) => ({
              value: type.id,
              label: type.name,
            })) ?? []
          }
          value={selectedClothingTypes}
          onChange={setSelectedClothingTypes}
        />
        {!hasClothingType && hasTriedToSubmmit && (
          <p className="text-sm text-red-500 mt-2">
            Select at least one clothing type.
          </p>
        )}
      </FormItemWrapper>

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
    </>
  );
};

export default ShareYourWorkForm;
