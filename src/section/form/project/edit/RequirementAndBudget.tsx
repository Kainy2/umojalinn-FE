"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import CustomSelect, {
  FormCustomSelectField,
} from "@/components/custom/Select";
import { FormTextField } from "@/components/custom/TextField";
import { Form, FormField } from "@/components/ui/form";
import { requirementsAndBugetSchema } from "@/lib/schema";
import { cn, jsonToFormData } from "@/lib/utils";
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

const EXPERIENCE_ENUMS = [
  "1 - 2 years",
  "3 - 5 years",
  "6 - 8 years",
  "9+ years",
  "All",
] as const;

const RequirementsBudgetForm = (props: { id: string }) => {
  const { data } = useGetProjectById(props.id);
  const {
    mutateAsync,
    isPending: isUpdating,
    isSuccess,
  } = useUpdateProjectById(props.id);

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
    async (values: ProjectFormRequirementsAndBugetProps) => {
      const val = jsonToFormData({
        ...values,
      });
      const res = await mutateAsync(val);
      console.log(res, "<<< RESPONSE");
    },
    [mutateAsync]
  );

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
                  <div className="p-1 flex flex-wrap justify-between gap-1 bg-gray-100">
                    {EXPERIENCE_ENUMS.map((experience) => (
                      <button
                        key={experience}
                        className={cn(
                          "py-1.5 px-4 text-sm font-semibold text-gray-500",
                          field.value === experience &&
                            "bg-white border-primary border text-primary"
                        )}
                        onClick={() => field.onChange(experience)}
                      >
                        {experience}
                      </button>
                    ))}
                  </div>
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
          handleSave={async (e) => {
            await form.handleSubmit(onSubmit)(e);
            return isSuccess;
          }}
          loading={isUpdating}
          nextUrl={`/project/${props.id}/review`}
        />
      </div>
    </Form>
  );
};

export default RequirementsBudgetForm;
