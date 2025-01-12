"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import CustomSelect, {
  FormCustomSelectField,
} from "@/components/custom/Select";
import { FormTextField } from "@/components/custom/input/TextField";
import { Form, FormField } from "@/components/ui/form";
import { requirementsAndBugetSchema } from "@/lib/schema";
import { jsonToFormData } from "@/lib/utils";
import {
  useGetProjectById,
  useUpdateProjectById,
} from "@/tanstack/hooks/useProject";
import { ProjectFormRequirementsAndBugetProps } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Euro, Lock, Unlock } from "lucide-react";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import ProjectEditFooter from "./Footer";
import NairaSign from "@/icons/NairaSign";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { ProjectFormProps } from "./Description";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";

const EXPERIENCE_ENUMS = [
  "1 - 2 years",
  "3 - 5 years",
  "6 - 8 years",
  "9+ years",
  "All",
] as const;

const RequirementsBudgetForm = (props: ProjectFormProps) => {
  const { data, isPending: loadingProject } = useGetProjectById(props.id);
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectById(
    props.id
  );

  const router = useRouter();

  const form = useForm<ProjectFormRequirementsAndBugetProps>({
    resolver: zodResolver(requirementsAndBugetSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (data?.data?.data?.budget) {
      form.setValue("budget", data?.data?.data?.budget);
    }
    if (data?.data?.data?.currency) {
      form.setValue("currency", data?.data?.data?.currency);
    }
    if (data?.data?.data?.negotiable) {
      form.setValue("negotiable", data?.data?.data?.negotiable);
    }
    // if (data?.data?.data?.specialist) {
    //   form.setValue("specialist", data?.data?.data?.specialist);
    // }
    //   if (data?.data?.data?.experienceLevel) {
    //     form.setValue("experienceLevel", data?.data?.data?.experienceLevel);
    //   }
  }, [data?.data?.data, form]);

  const onSubmit = useCallback(
    (mode: "SAVE" | "DRAFT") =>
      (values: ProjectFormRequirementsAndBugetProps) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const val = jsonToFormData({
          ...values,
        });
        updateProject(val, {
          onSuccess() {
            router.push(
              mode === "DRAFT"
                ? "/projects"
                : `${
                    !!props.isOnboarding ? "/onboard" : ""
                  }/project/${uuidToBase62Safe(props.id)}/review`
            );
          },
        });
      },
    [props.id, props.isOnboarding, router, updateProject]
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
              title="Specialist"
              description="Add specialist tag to help with your search for a designer"
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
                    tabs={EXPERIENCE_ENUMS.map((exp) => ({
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
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                >
                  {field.value ? (
                    <Unlock className="h-5 w-5 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-primary" />
                  )}
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
                    type="number"
                    startAdornment={
                      <span className="text-gray-500 [&>svg]:size-5">
                        {currencyField?.value === "EURO" ? (
                          <Euro />
                        ) : currencyField?.value === "NAIRA" ? (
                          <NairaSign />
                        ) : (
                          <DollarSign />
                        )}
                      </span>
                    }
                    endAdornment={
                      <CustomSelect
                        {...currencyField}
                        options={[
                          { value: "EURO", children: "EUR" },
                          { value: "NAIRA", children: "NGN" },
                        ]}
                        onValueChange={currencyField.onChange}
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
        <ProjectEditFooter
          handleSave={form.handleSubmit(onSubmit("SAVE"))}
          handleDraft={form.handleSubmit(onSubmit("DRAFT"))}
          loading={isUpdating}
        />
      </div>
    </Form>
  );
};

export default RequirementsBudgetForm;
