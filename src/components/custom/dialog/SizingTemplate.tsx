"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import TextField from "../input/TextField";
import TabButtonSelect from "../tab/ButtonSelect";
import CustomTab from "../tab";
import {
  FEMALE_SIZING_TEMPLATE,
  MALE_SIZING_TEMPLATE,
} from "@/constant/sizingTemplate";
import SizingTemplateInputField from "../input/SizingTemplateField";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojaLinnSizingTemplate,
} from "@/types/project";
import { parseStringToNumber } from "@/lib/utils";
import {
  useCreateSizingTemplate,
  useGetSizingTemplateById,
  useUpdateSizingTemplate,
} from "@/tanstack/hooks/useSizingTemplates";
import { getSizingTemplateUpdateProps } from "@/lib/project";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/tanstack/hooks/useUser";

const SizingTemplateDialog = (
  props: DialogProps & {
    id?: string;
    handleSuccess?: (template?: UmojaLinnSizingTemplate) => void;
  }
) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<
    Partial<
      UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
    >
  >({});
  const [gender, setGender] =
    useState<UmojaLinnSizingTemplate["gender"]>("MALE");
  const [unit, setUnit] = useState<UmojaLinnSizingTemplate["unit"]>("CM");
  const [name, setName] = useState<string>("");

  const { data: sizingTemplateData, isPending: isLoadingSizingTemplate } =
    useGetSizingTemplateById(props.id);

  const { data: meData, isPending: loadingMe } = useGetMe();

  useEffect(() => {
    if (sizingTemplateData?.data?.data) {
      const {
        gender,
        name,
        unit,
        id,
        createdAt,
        buyerId,
        buyer,
        updatedAt,
        status,
        projects,
        ...templateDetails
      } = sizingTemplateData?.data?.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = {
        id,
        createdAt,
        buyerId,
        buyer,
        updatedAt,
        status,
        projects,
      };
      setValue(templateDetails);
      setName(name);
      setGender(gender);
      setUnit(unit);
    }
  }, [sizingTemplateData?.data?.data]);

  const handleSuccess = (template: UmojaLinnSizingTemplate) => {
    setOpen(false);
    props.onOpenChange?.(false);
    props?.handleSuccess?.(template);
  };

  const { mutate: createSizingTemplate, isPending: isCreatingSizingTemplate } =
    useCreateSizingTemplate({
      onSuccess(data) {
        handleSuccess(data?.data?.data);
      },
    });

  const { mutate: updateSizingTemplate, isPending: isUpdatingSizingTemplate } =
    useUpdateSizingTemplate(props.id, {
      onSuccess(data) {
        handleSuccess(data?.data?.data);
      },
    });

  const handleChange =
    (
      prop: keyof Partial<
        UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
      >
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue((prev) => ({
        ...prev,
        [prop]: parseStringToNumber(e.target.value)?.value || 0,
      }));
    };

  const handleSubmit = (shouldGoLive?: true) => {
    const sizingTemplateProps: Partial<
      UmojaLinnSizingTemplate & {
        shouldGoLive?: true;
      }
    > = {
      ...getSizingTemplateUpdateProps(gender, value),
      gender,
      name,
      unit,
      shouldGoLive,
    };

    (props?.id ? updateSizingTemplate : createSizingTemplate)(
      sizingTemplateProps
    );
  };

  const loading = props.id
    ? isUpdatingSizingTemplate
    : isCreatingSizingTemplate;

  if (
    props.id &&
    (isLoadingSizingTemplate || loadingMe || !sizingTemplateData?.data?.data)
  ) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          {props.children}
        </DialogTrigger>
        <DialogContent className="flex [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[70vw]">
          <DialogTitle className="text-lg font-semibold mb-4 hidden">
            Measurement
          </DialogTitle>
          <Skeleton className="h-[50vh]" />
        </DialogContent>
      </Dialog>
    );
  }

  if (
    !props.id ||
    (sizingTemplateData?.data?.data?.status !== "IN_USE" &&
      sizingTemplateData?.data?.data?.buyerId ===
        meData?.data?.data?.buyerProfile?.id)
  ) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          {props.children}
        </DialogTrigger>
        <DialogContent className="flex [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[70vw]">
          <div className="">
            <DialogTitle className="text-lg font-semibold mb-4">
              Measurement
            </DialogTitle>
            <div className="flex gap-4 items-center mb-4">
              <TextField
                placeholder="Template name"
                className="flex-1 w-full"
                maxLength={30}
                onChange={(e) => setName(e?.target?.value)}
                value={name}
              />
              <TabButtonSelect
                active={gender}
                onChange={(value) =>
                  setGender(value as UmojaLinnSizingTemplate["gender"])
                }
                tabs={[
                  {
                    title: "Male",
                    value: "MALE",
                  },
                  {
                    title: "Female",
                    value: "FEMALE",
                  },
                ]}
              />
            </div>
            <div className="flex gap-4 mb-4">
              <CustomTab
                className="flex-1"
                type="NAVIGATOR"
                active="Full-body"
                tabs={[{ title: "Full-body" }]}
              />
              <TabButtonSelect
                active={unit}
                onChange={(value) =>
                  setUnit(value as UmojaLinnSizingTemplate["unit"])
                }
                tabs={[
                  { title: "CM", value: "CM" },
                  { title: "INCH", value: "INCH" },
                ]}
              />
            </div>
            <div className="flex justify-between font-semibold p-2 text-muted-foreground">
              <p>Measurement Point</p>
              <p>Measurement</p>
            </div>
            <div className="max-h-[50vh] overflow-scroll">
              {(gender === "MALE"
                ? MALE_SIZING_TEMPLATE
                : FEMALE_SIZING_TEMPLATE
              ).map((template) => (
                <SizingTemplateInputField
                  onValueChange={handleChange(template.prop)}
                  value={value?.[template.prop] || 0}
                  unit={unit}
                  key={template.prop}
                  label={template.name}
                  onFocus={() => setPreviewImage(template.img)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-2 lg:hidden">
              <Button
                variant="outline"
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                Save
              </Button>
              <Button onClick={() => handleSubmit(true)} disabled={loading}>
                Submit
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2 ">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="h-full flex-1 relative ">
              {previewImage && (
                <Image
                  src={previewImage}
                  fill
                  alt=""
                  className="absolute object-contain h-full w-full"
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                Save
              </Button>
              <Button onClick={() => handleSubmit(true)} disabled={loading}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {props.children}
      </DialogTrigger>
      <DialogContent className="flex [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[45vw]">
        <div className="">
          <div className="flex gap-4 items-center mb-4 justify-between">
            <DialogTitle className="text-lg font-semibold mb-4">
              {name}
            </DialogTitle>
            <TabButtonSelect
              active={gender}
              disabled
              tabs={[
                {
                  title: "Male",
                  value: "MALE",
                },
                {
                  title: "Female",
                  value: "FEMALE",
                },
              ]}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <CustomTab
              className="flex-1"
              type="NAVIGATOR"
              active="Full-body"
              tabs={[{ title: "Full-body" }]}
            />
            <TabButtonSelect
              active={unit}
              disabled
              tabs={[
                { title: "CM", value: "CM" },
                { title: "INCH", value: "INCH" },
              ]}
            />
          </div>
          <div className="flex justify-between font-semibold p-2 text-muted-foreground">
            <p>Measurement Point</p>
            <p>Measurement</p>
          </div>
          <div className="max-h-[50vh] overflow-scroll">
            {(gender === "MALE"
              ? MALE_SIZING_TEMPLATE
              : FEMALE_SIZING_TEMPLATE
            ).map((template) => (
              <SizingTemplateInputField
                disabled
                onValueChange={handleChange(template.prop)}
                value={value?.[template.prop] || 0}
                unit={unit}
                key={template.prop}
                label={template.name}
                onFocus={() => setPreviewImage(template.img)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizingTemplateDialog;
