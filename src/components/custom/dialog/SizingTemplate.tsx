"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import TextField from "../input/TextField";
import TabButtonSelect from "../tab/ButtonSelect";
import CustomTab from "../tab";
import {
  ALL_SIZING_TEMPLATES,
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
  useRequestChangeSizingTemplate,
  useUpdateSizingTemplate,
} from "@/tanstack/hooks/useSizingTemplates";
import { getSizingTemplateUpdateProps } from "@/lib/project";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useSession } from "next-auth/react";
import VerifyDialog from "./Verify";
import TextAreaField from "../input/TextAreaField";
import RequestSizingTemplateViewCard from "../card/RequestSIzingTemplateView";

const SizingTemplateDialog = (
  props: DialogProps & {
    id?: string;
    handleSuccess?: (template?: UmojaLinnSizingTemplate) => void;
    type?: "CREATE" | "DRAFT-EDIT" | "DESIGNER-VIEW" | "BUYER-VIEW";
  },
) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<
    | keyof (UmojaLinnFemaleSizingTemplateProps &
        UmojaLinnMaleSizingTemplateProps)
    | null
  >(null);
  const [value, setValue] = useState<
    Partial<
      UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
    >
  >({});
  const [gender, setGender] =
    useState<UmojaLinnSizingTemplate["gender"]>("MALE");
  const [unit, setUnit] = useState<UmojaLinnSizingTemplate["unit"]>("CM");
  const [name, setName] = useState<string>("");
  const [recommendationMode, setRecommendationMode] = useState(false);
  const [openRequestChangesDialog, setOpenRequestChangesDialog] =
    useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { isPending: loadingMe } = useGetMe();
  const { data: session } = useSession();
  const { data: sizingTemplateData, isPending: isLoadingSizingTemplate } =
    useGetSizingTemplateById(props?.id);
    const {
      mutate: requestChangeOnSizingTemplate,
      isPending: isRequestingChangeOnSizingTemplate,
    } = useRequestChangeSizingTemplate(props?.id, {
      onSuccess() {
        setReviewsEdit({});
        setRecommendationMode(false);
      },
    });
    
  const TEMPLATE =
    gender === "FEMALE" ? FEMALE_SIZING_TEMPLATE : MALE_SIZING_TEMPLATE;
  const type =
		props.type || session?.user.profileRole === "BUYER"
			? sizingTemplateData?.data.data.status !== "IN_USE"
				? "DRAFT-EDIT"
				: "BUYER-VIEW"
			: "DESIGNER-VIEW";
  const noOfInputs = TEMPLATE?.length;


  // Function to handle the Enter key press
  const handleKeyPress = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      // Move focus to the next input, if any
      const nextIndex = index + 1;
      if (nextIndex < noOfInputs) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const [reviewsEdit, setReviewsEdit] = useState<
    Partial<
      Record<
        keyof (UmojaLinnFemaleSizingTemplateProps &
          UmojaLinnMaleSizingTemplateProps),
        string
      >
    >
  >({});

  const handleChangeValuesByUnit = (
    prevUnit: UmojaLinnSizingTemplate["unit"],
    finalUnit: UmojaLinnSizingTemplate["unit"],
  ) => {
    if (prevUnit !== finalUnit) {
      const conversionFactor = prevUnit === "CM" ? 0.393701 : 2.54;
      setValue((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          const typedKey = key as keyof Partial<
            UmojaLinnFemaleSizingTemplateProps &
              UmojaLinnMaleSizingTemplateProps
          >;
          const currentValue = prev[typedKey] || 0;
          const convertedValue = currentValue * conversionFactor;
          // Convert each value
          acc[typedKey] = Number.isInteger(convertedValue)
            ? convertedValue
            : parseFloat(convertedValue.toFixed(2));
          return acc;
        }, {} as Partial<UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps>),
      );
    }
  };

  const handleReviewsEditChange = useCallback(
    (
        props:
          | keyof (UmojaLinnFemaleSizingTemplateProps &
              UmojaLinnMaleSizingTemplateProps)
          | null,
      ) =>
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props)
          setReviewsEdit((prev) => ({ ...prev, [props]: e?.target?.value }));
      },
    [],
  );

  const [hasLiveProject, isDraft] = useMemo(() => {
    return [
      !!sizingTemplateData?.data?.data?.projects?.some(
        (project) => project?.status === "LIVE",
      ),
      sizingTemplateData?.data?.data?.status === "DRAFT",
    ];
  }, [sizingTemplateData?.data?.data]);

  const highlightedSizingName = useMemo(
    () =>
      (highlighted &&
        ALL_SIZING_TEMPLATES?.find?.((value) => highlighted === value?.prop)
          ?.name) ||
      "",
    [highlighted],
  );

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
    useUpdateSizingTemplate(props?.id, {
      onSuccess(data) {
        handleSuccess(data?.data?.data);
      },
    });



  const handleChange =
    (
      prop: keyof Partial<
        UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
      >,
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
      sizingTemplateProps,
    );
  };

  const loading = props?.id
    ? isUpdatingSizingTemplate || isRequestingChangeOnSizingTemplate
    : isCreatingSizingTemplate;

  const isDesigner = session?.user?.profileRole === "DESIGNER";

  // LOADING THE SIZING TEMPLATE DATA
  if (
    props?.id &&
    (isLoadingSizingTemplate || loadingMe || !sizingTemplateData?.data?.data)
  ) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          {props.children}
        </DialogTrigger>
        <DialogContent className="flex p-2 md:p-6 [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[70vw]">
          <DialogTitle className="text-lg font-semibold mb-4 hidden">
            Measurement
          </DialogTitle>
          <Skeleton className="h-[50vh]" />
        </DialogContent>
      </Dialog>
    );
  }

  // THE EDITABLE SCREEN THAT A BUYER SEES
  // TO EITHER CREATE A NEW TEMPLATE OR
  // EDIT AN OLD ONE WHEN A LIVE PROJECT IS NOT ATTACHED
  if (
    // !props?.id ||
    // (
    //   !hasLiveProject &&
    //   sizingTemplateData?.data?.data?.buyerId ===
    //     meData?.data?.data?.buyerProfile?.id)

    ["CREATE", "DRAFT-EDIT", "BUYER-VIEW"].includes(type)
  ) {
    return (
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogTrigger asChild onClick={() => setOpen(true)}>
          {props.children}
        </DialogTrigger>
        <DialogContent className="flex p-2 md:p-6 [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[70vw]">
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
                onChange={(value) => {
                  setUnit((prevUnit) => {
                    const finalUnit = value as UmojaLinnSizingTemplate["unit"];
                    handleChangeValuesByUnit(prevUnit, finalUnit);
                    return finalUnit;
                  });
                }}
                tabs={[
                  { title: "CM", value: "CM" },
                  { title: "INCH", value: "INCH" },
                ]}
              />
            </div>
            <div className="flex justify-between font-semibold p-2 text-muted-foreground text-sm">
              <p>Measurement Point</p>
              <p>Measurement</p>
            </div>
            <div className="max-h-[50vh] overflow-scroll">
              {TEMPLATE.map((template, index) => {
                const isNotCreateOrDraft = !(props.type === "CREATE" || props.type === "DRAFT-EDIT");
                const reviewValue =(recommendationMode
                  ? reviewsEdit?.[template.prop]
                  : undefined) ||
                  sizingTemplateData?.data?.data?.metadata?.reviews?.[template.prop];
              
                return (
                  <SizingTemplateInputField
                    disabled={isNotCreateOrDraft && !reviewValue}
                    onValueChange={handleChange(template.prop)}
                    value={value?.[template.prop] ?? 0}
                    unit={unit}
                    key={template.prop}
                    label={template.name}
                    onFocus={() => setPreviewImage(template.img)}
                    highlighted={highlighted === template.prop}
                    // hasLiveProject={hasLiveProject}
                    hasLiveProject={false}
                    metadata={{
                      review: reviewValue,
                      img: template?.img,
                    }}
                    onClick={() => {
                      setPreviewImage(template.img);
                      setHighlighted(template.prop);
                    } }
                    onKeyDown={(e) => handleKeyPress(index, e)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    } }
                     />
                );
              })}
            </div>
            <div className="flex justify-center gap-2 lg:hidden">
              <Button
                variant="outline"
                onClick={() => handleSubmit()}
                disabled={loading}
              >
                Save
              </Button>
              {(isDraft || !props.id) && (
                <Button onClick={() => handleSubmit(true)} disabled={loading}>
                  Submit
                </Button>
              )}
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2 relative">
            <h3 className="text-lg font-semibold mb-4" title="Client Preview">Preview</h3>
            <div className="h-full flex-1 relative ">
              {previewImage && (
                <Image
                  src={previewImage}
                  fill
                  alt=""
                  className="absolute object-contain h-full w-full"
                />
              )}
              {highlighted &&
                sizingTemplateData?.data?.data?.metadata?.reviews?.[
                  highlighted
                ] && (
                  <RequestSizingTemplateViewCard
                    title={highlightedSizingName}
                    review={
                      sizingTemplateData?.data?.data?.metadata?.reviews?.[
                        highlighted
                      ]
                    }
                    className="absolute top-16 w-full"
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
              {(isDraft || !props.id) && (
                <Button onClick={() => handleSubmit(true)} disabled={loading}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // THE UNEDITABLE SCREEN THAT EVERYONE, INCLUDING THE DESIGNER SEES AND CAN DROP REVIEWS
  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {props.children}
      </DialogTrigger>
      <DialogContent className="flex p-2 md:p-6 [&>div]:flex-1 [&>div]:shrink-0 [&>div]:p-3 min-w-[70vw]">
        <div className="">
          {recommendationMode && (
            <div className="text-sm text-foreground-body bg-primary-50 border-b-1 border-gray-200 mb-4 p-2 md:p-4">
              <p className="font-bold">Recommendation mode</p>
              <p>
                Please choose the measurement point for which you would like to
                make recommended changes
              </p>
            </div>
          )}
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
          <div className="flex justify-between font-semibold p-2 text-muted-foreground text-sm">
            <p>Measurement Point</p>
            <p>Measurement</p>
          </div>
          <div className="max-h-[50vh] overflow-scroll">
            {TEMPLATE.map((template) => (
              <SizingTemplateInputField
                disabled
                onValueChange={handleChange(template.prop)}
                value={value?.[template.prop] || 0}
                unit={unit}
                key={template.prop}
                label={template.name}
                highlighted={highlighted === template.prop}
                hasLiveProject={hasLiveProject}
                metadata={{
                  review:
                    (recommendationMode
                      ? reviewsEdit?.[template.prop]
                      : undefined) ||
                    sizingTemplateData?.data?.data?.metadata?.reviews?.[
                      template.prop
                    ],
                  img: template?.img,
                }}
                onClick={() => {
                  setPreviewImage(template.img);
                  setHighlighted(template.prop);
                }}
              />
            ))}
            <VerifyDialog
              title="Request changes"
              description={highlightedSizingName}
              open={openRequestChangesDialog}
              onOpenChange={setOpenRequestChangesDialog}
              additionalComponent={
                <TextAreaField
                  label="Your recommended changes"
                  value={highlighted ? reviewsEdit?.[highlighted] : ""}
                  onChange={handleReviewsEditChange(highlighted)}
                  maxLength={100}
                />
              }
              fullWidthActions
              hideCancel
              confirmText="Submit changes"
            />
          </div>
          {isDesigner && recommendationMode && !hasLiveProject && (
            <div className="flex justify-center gap-2 lg:hidden">
              <Button
                variant="outline"
                onClick={() => setOpenRequestChangesDialog(true)}
                disabled={loading || !highlighted}
              >
                Recommend Changes
              </Button>
              <Button
                onClick={() => requestChangeOnSizingTemplate(reviewsEdit)}
                disabled={loading}
              >
                Submit
              </Button>
            </div>
          )}
          {isDesigner && !recommendationMode && !hasLiveProject && (
            <div className="flex justify-center gap-2 lg:hidden">
              <Button
                disabled={loading}
                onClick={() => setRecommendationMode(true)}
              >
                Submit request
              </Button>
            </div>
          )}
        </div>
        <div className="hidden lg:flex flex-col gap-2 relative">
          <h3 className="text-lg font-semibold mb-4" title="Designer Preview">Preview</h3>
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
          {!hasLiveProject &&
            highlighted &&
            (reviewsEdit?.[highlighted] ||
              sizingTemplateData?.data?.data?.metadata?.reviews?.[
                highlighted
              ]) && (
              <RequestSizingTemplateViewCard
                title={highlightedSizingName}
                review={
                  reviewsEdit?.[highlighted] ||
                  sizingTemplateData?.data?.data?.metadata?.reviews?.[
                    highlighted
                  ] ||
                  ""
                }
                className="absolute top-16 w-full"
              />
            )}
          {isDesigner &&
            highlighted &&
            recommendationMode &&
            !hasLiveProject && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpenRequestChangesDialog(true)}
                  disabled={loading}
                >
                  Recommend Changes
                </Button>
                <Button
                  onClick={() => requestChangeOnSizingTemplate(reviewsEdit)}
                  disabled={loading}
                >
                  Submit
                </Button>
              </div>
            )}
          {isDesigner && !recommendationMode && !hasLiveProject && (
            <div className="flex justify-end gap-2">
              <Button
                disabled={loading}
                onClick={() => setRecommendationMode(true)}
              >
                Recommendation mode
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizingTemplateDialog;
