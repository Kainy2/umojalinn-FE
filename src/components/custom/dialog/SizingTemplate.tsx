"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TextField from "../input/TextField";
import TabButtonSelect from "../tab/ButtonSelect";
import CustomTab from "../tab";
import SizingTemplateInputField from "../input/SizingTemplateField";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  UmojaLinnSizingTemplate,
} from "@/types/project";
import { Skeleton } from "@/components/ui/skeleton";
import VerifyDialog from "./Verify";
import TextAreaField from "../input/TextAreaField";
import RequestSizingTemplateViewCard from "../card/RequestSIzingTemplateView";
import { SizingTemplateDialogProps, useSizingTemplateDialog } from "@/hooks/use-sizing-template";



const SizingTemplateDialog = (
  props: SizingTemplateDialogProps,
) => {

const {
    loading,
    // isDesigner,
    highlightedSizingName,
    handleReviewsEditChange,
    handleChange,
    handleSubmit,
    sizingTemplateResult,
    reviewsEdit,
    isDraft,
    // hasLiveProject,
    TEMPLATE,
    open,
    setOpen,
    name,
    gender,
    unit,
    value,
    highlighted,
    setHighlighted,
    setGender,
    setName,
    setUnit,
    handleChangeValuesByUnit,
    recommendationMode,
    openRequestChangesDialog,
    setOpenRequestChangesDialog,
    setRecommendationMode,
    loadingMe,
    isLoadingSizingTemplate,
    requestChangeOnSizingTemplate,
    // type,
    handleKeyPress,
    previewImage,
    setPreviewImage,
    inputRefs,
    modalType
  } = useSizingTemplateDialog(props);
 
  // LOADING THE SIZING TEMPLATE DATA
  if (
    props?.id &&
    (isLoadingSizingTemplate || loadingMe || !sizingTemplateResult)
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
  // If modalType === "VIEW-ONLY" or modalType === "EDIT"

  // THE EDITABLE SCREEN THAT A BUYER SEES
  // TO EITHER CREATE A NEW TEMPLATE OR
  // EDIT AN OLD ONE WHEN A LIVE PROJECT IS NOT ATTACHED
  if (
    // former implementation
    // !props?.id ||
    // (
    //   !hasLiveProject &&
    //   sizingTemplateResult?.buyerId ===
    //     meData?.data?.data?.buyerProfile?.id)

    // modalType === "EDIT"
    ["VIEW-ONLY", "EDIT"].includes(modalType)
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
                const isNotEdit = modalType !== "EDIT"
                const reviewValue = (recommendationMode
                  ? reviewsEdit?.[template.prop]
                  : undefined) ??
                  sizingTemplateResult?.metadata?.reviews?.[template.prop];
              
                return (
                  <SizingTemplateInputField
                    disabled={isNotEdit && !reviewValue}
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
                sizingTemplateResult?.metadata?.reviews?.[
                  highlighted
                ] && (
                  <RequestSizingTemplateViewCard
                    title={highlightedSizingName}
                    review={
                      sizingTemplateResult?.metadata?.reviews?.[
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
  
  // If modalType === RECOMMEND
  // THE UNEDITABLE SCREEN THAT THE DESIGNER SEES AND CAN DROP REVIEWS
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
                // hasLiveProject={hasLiveProject}
                metadata={{
                  review:
                    (recommendationMode
                      ? reviewsEdit?.[template.prop]
                      : undefined) ||
                    sizingTemplateResult?.metadata?.reviews?.[
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
          { recommendationMode 
          // && isDesigner && !hasLiveProject 
          && (
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
           { recommendationMode 
          // && isDesigner && !hasLiveProject 
          && (
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
          {
            highlighted &&
            // !hasLiveProject &&
            (reviewsEdit?.[highlighted] ||
              sizingTemplateResult?.metadata?.reviews?.[
                highlighted
              ]) && (
              <RequestSizingTemplateViewCard
                title={highlightedSizingName}
                review={
                  reviewsEdit?.[highlighted] ||
                  sizingTemplateResult?.metadata?.reviews?.[
                    highlighted
                  ] ||
                  ""
                }
                className="absolute top-16 w-full"
              />
            )}
          {
            highlighted &&
            recommendationMode 
            // && !hasLiveProject
            && (
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
          {modalType==="RECOMMEND" && !recommendationMode && (
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


