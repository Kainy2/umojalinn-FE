"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import { FormCustomSelectField } from "@/components/custom/Select";
import { FormTextField } from "@/components/custom/input/TextField";
import { Form, FormField } from "@/components/ui/form";
import { requirementsAndBugetSchema } from "@/lib/schema";
import { jsonToFormData, numberToCommaString, removeNonDigits } from "@/lib/utils";
import {
  useGetProjectById,
  useUpdateProjectById,
} from "@/tanstack/hooks/useProject";
import { ProjectFormRequirementsAndBugetProps } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Euro, Lock, Unlock } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import ProjectEditFooter from "./ProjectEditFooter";
// import ProjectEditFooter from "./Footer";
import NairaSign from "@/icons/NairaSign";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { ProjectFormProps } from "./Description";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
import CustomReactSelect from "@/components/custom/ReactSelect";
import { useCreateProjectContext } from "@/hooks/create-project/useCreateProjectContext";

export const EXPERIENCE_ENUMS = [
  "1 - 2 years",
  "3 - 5 years",
  "6 - 8 years",
  "9+ years",
] as const;



const RequirementsBudgetForm = (props: ProjectFormProps) => {
  const { data, isPending: loadingProject } = useGetProjectById(props?.id);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectById(
    props?.id
  );

  const router = useRouter();
  const { projectFormDetails, setProjectFormDetails } = useCreateProjectContext()
  const isAds = data?.data.data.status === 'ADS'

  const form = useForm<ProjectFormRequirementsAndBugetProps>({
    resolver: zodResolver(requirementsAndBugetSchema),
    defaultValues: {},
  });

  console.log({ projectFormDetails });

  useEffect(() => {
    if (isAds && (
      projectFormDetails.budget
      || projectFormDetails.currency
      || projectFormDetails.negotiable
    )) {
      form.reset(projectFormDetails)
      return
    }


    if (data?.data?.data?.budget) {
      form.setValue("budget", data?.data?.data?.budget);
    }
    if (data?.data?.data?.currency) {
      form.setValue("currency", data?.data?.data?.currency);
    }
    if (data?.data?.data?.negotiable) {
      form.setValue("negotiable", data?.data?.data?.negotiable);
    }
    if (data?.data?.data?.projectType === "PRIVATE") {
      form.setValue("negotiable", true);
    }
    // if (data?.data?.data?.specialist) {
    //   form.setValue("specialist", data?.data?.data?.specialist);
    // }
    //   if (data?.data?.data?.experienceLevel) {
    //     form.setValue("experienceLevel", data?.data?.data?.experienceLevel);
    //   }
  }, [data?.data?.data, form]);

  const onSubmit = useCallback(
    (mode: "SAVE" | "DRAFT",) =>
      (values: ProjectFormRequirementsAndBugetProps) => {
        if (isAds) {
          setProjectFormDetails(prev => ({ ...prev, ...values }))
          router.push(`/project/${uuidToBase62Safe(props?.id)}/review`)
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const val = jsonToFormData({
          ...values,
        });
        updateProject(val, {
          onSuccess() {
            router.push(
              mode === "DRAFT"
                ? "/projects/drafts"
                : `${!!props.isOnboarding ? "/onboard" : ""
                }/project/${uuidToBase62Safe(props?.id)}/review`
            );
          },
        });
      },
    [props?.id, props.isOnboarding, router, updateProject, setProjectFormDetails, isAds]
  );

  if (loadingProject) {
    return (
      <FormItemWrapper loading>
        <div className="flex gap-4 flex-col lg:flex-row justify-stretch">
          <Skeleton className="h-12 w-full" />
        </div>
      </FormItemWrapper>
    );
  }

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6">
        {data?.data?.data?.projectType === "PUBLIC" && (
          <>
            <FormItemWrapper
              title="Specialty"
              description="Add specialty tag to help with your search for a designer"
            >
              <FormField
                control={form.control}
                name="specialist"
                render={({ field }) => (
                  <FormCustomSelectField
                    {...field}
                    onValueChange={field.onChange}
                    options={[]}
                  />
                )}
              />
            </FormItemWrapper>
            <FormItemWrapper
              title="Experience level"
              description="Select the level of experience for your designer"
            >
              <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <TabButtonSelect
                    active={field.value || null}
                    onChange={field.onChange}
                    tabs={[...EXPERIENCE_ENUMS, "All"].map((exp) => ({
                      value: exp,
                      title: exp,
                    }))}
                  />
                )}
              />
            </FormItemWrapper>
          </>
        )}
        <FormItemWrapper
          title="Budget"
          description="Control your budget"
          endAdornment={
            <FormField
              control={form.control}
              name="negotiable"
              render={({ field }) => (
                <button
                  disabled={data?.data?.data?.projectType === "PRIVATE"}
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className="[&>svg]:size-5 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {field.value ? <Unlock /> : <Lock />}
                </button>
              )}
            />
          }
        >
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormField
                control={form.control}
                name="currency"
                render={({ field: currencyField }) => (
                  <FormTextField
                    {...field}
                    placeholder="0"
                    type="text"
                    value={numberToCommaString(field.value || "")}
                    onChange={(e) => {
                      if (e.target.value.length > 20) return
                      e.target.value = removeNonDigits(e.target.value)
                      field.onChange(e)
                    }}
                    startAdornment={
                      <span className="text-gray-500 [&>svg]:size-5">
                        {currencyField?.value === "EURO" ? (
                          <Euro />
                        ) : currencyField?.value === "NAIRA" ? (
                          <NairaSign />
                        ) : null}
                      </span>
                    }
                    endAdornment={
                      <CustomReactSelect
                        {...currencyField}
                        value={[
                          { value: "EURO", label: "EUR" },
                          { value: "NAIRA", label: "NGN" },
                          { value: "USD", label: "USD" },
                          { value: "GBP", label: "GBP" },
                          { value: "CAD", label: "CAD" }
                        ]?.find(({ value }) => value === currencyField?.value)}
                        options={[
                          { value: "EURO", label: "EUR" },
                          { value: "NAIRA", label: "NGN" },
                          { value: "USD", label: "USD" },
                          { value: "GBP", label: "GBP" },
                          { value: "CAD", label: "CAD" }
                        ]}
                        onChange={(newValue: unknown) => {
                          const typedValue = newValue as {
                            value: "EURO" | "NAIRA" | "USD" | "GBP" | "CAD";
                            label: string;
                          };
                          currencyField.onChange(typedValue?.value);
                        }}
                        adornment
                        placeholder="Currency"
                      />
                    }
                  />
                )}
              />
            )}
          />
        </FormItemWrapper>
        {/* <ProjectEditFooter
          handleSave={form.handleSubmit(onSubmit("SAVE"))}
          handleDraft={form.handleSubmit(onSubmit("DRAFT"))}
          loading={isUpdating}
        /> */}

        <ProjectEditFooter
          leftButtonProps={{
            onClick: (e) => {
              if (isAds) form.handleSubmit(onSubmit("SAVE"))(e);
              else form.handleSubmit(onSubmit("DRAFT"))(e);
              router.back();
            }
          }}
          rightSecondaryButtonProps={{
            text: isAds ? "Cancel" : "Save & Exit",
            disabled: isUpdating,
            onClick: (e) => {
              if (isAds) router.push(`/projects/ads/${uuidToBase62Safe(props?.id)}`);
              else form.handleSubmit(onSubmit("DRAFT"))(e);
            },
          }}
          rightPrimaryButtonProps={{
            text: isAds ? "Next" : undefined,
            disabled: isUpdating,
            onClick: form.handleSubmit(onSubmit("SAVE")),
          }}
        />
      </div>
    </Form>
  );
};

export default RequirementsBudgetForm;
