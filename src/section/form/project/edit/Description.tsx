"use client";
import { FormCustomDatePickerField } from "@/components/custom/picker/Date";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import TextField, { FormTextField } from "@/components/custom/input/TextField";
import { Textarea } from "@/components/ui/textarea";
import { Info, UserPlus } from "lucide-react";
import React, { useEffect, useCallback, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  useGetClothingTypes,
  useGetProjectById,
  useUpdateProjectById,
} from "@/tanstack/hooks/useProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormDetailsKeys, projectFormDetailsSchema } from "@/lib/schema";
import { ProjectFormDetailsProps } from "@/types/form";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { addYears } from "date-fns";

import { FormCustomTagSelectField } from "@/components/custom/tag/Select";
import { jsonToFormData } from "@/lib/utils";
import CustomSelect from "@/components/custom/Select";
import ProjectEditFooter from "./Footer";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import CustomSelectCountry from "@/components/custom/SelectCountry";
import CustomReactSelect from "@/components/custom/ReactSelect";

export type ProjectFormProps = {
  id: string;
  isOnboarding?: boolean;
};

const ProjectDescriptionForm = (props: ProjectFormProps) => {
  const { data, isPending: loadingProject } = useGetProjectById(props?.id);
  const { data: clothingTypes } = useGetClothingTypes();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectById(
    props?.id
  );

  const [useSizingTemplate, setUseSizingTemplate] = useState(false);

  const router = useRouter();

  const form = useForm<ProjectFormDetailsProps>({
    resolver: zodResolver(projectFormDetailsSchema),
    defaultValues: {},
  });

  const { data: sizingTemplateData, isPending: loadingSizingTemplate } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: "LIVE",
    });

  useEffect(() => {
    if (data?.data?.data) {
      Object.entries(data.data.data).forEach(([key, value]) => {
        if (
          value !== null &&
          typeof value !== "object" &&
          projectFormDetailsKeys?.includes(key as keyof ProjectFormDetailsProps)
        ) {
          if (key === "sizingTemplateId" && !!value) setUseSizingTemplate(true);
          form.setValue(key as keyof ProjectFormDetailsProps, value.toString());
        }
        if (key === "deliveryAddress" && !!value && typeof value === "object") {
          Object.entries(value).forEach(([key, value]) => {
            if (value !== null && typeof value !== "object") {
              form.setValue(
                key as keyof ProjectFormDetailsProps,
                value.toString()
              );
            }
          });
        }
      });
    }

    if (data?.data?.data?.clothingTypes?.length) {
      form.setValue(
        "clothingTypes",
        data?.data?.data?.clothingTypes?.map?.((type) => type?.id)
      );
    }

    if (data?.data?.data?.buyer?.user) {
      form.setValue("firstName", data?.data?.data?.buyer?.user?.firstName);
      form.setValue("lastName", data?.data?.data?.buyer?.user?.lastName);
    }
  }, [data?.data?.data, form]);

  const onSubmit = useCallback(
    (mode: "SAVE" | "DRAFT") => (values: ProjectFormDetailsProps) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { firstName, lastName, designerId, ...otherValues } = values;
      const val = jsonToFormData({
        ...otherValues,
      });
      updateProject(val, {
        onSuccess() {
          router.push(
            mode === "DRAFT"
              ? "/projects"
              : `${!!props.isOnboarding ? "/onboard" : ""
              }/project/${uuidToBase62Safe(props?.id)}/gallery`
          );
        },
      });
    },
    [props?.id, props.isOnboarding, router, updateProject]
  );

  if (loadingProject) {
    return (
      <div className="flex flex-col gap-6">
        <FormItemWrapper loading>
          <div className="flex gap-4 flex-col lg:flex-row justify-stretch">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </FormItemWrapper>
        <FormItemWrapper loading>
          <Skeleton className="h-12 w-full" />
        </FormItemWrapper>
        <FormItemWrapper loading>
          <Skeleton className="h-12 w-full" />
        </FormItemWrapper>
        <FormItemWrapper loading>
          <Skeleton className="h-20 w-full" />
        </FormItemWrapper>
        <FormItemWrapper loading>
          <Skeleton className="h-20 w-full" />
        </FormItemWrapper>
        <FormItemWrapper loading>
          <Skeleton className="h-12 w-full" />
        </FormItemWrapper>
        <FormItemWrapper loading>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </FormItemWrapper>
        <FormItemWrapper loading>
          <Skeleton className="h-20 w-full" />
        </FormItemWrapper>
        <FormItemWrapper loading>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </FormItemWrapper>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <FormItemWrapper title="Name" description="Buyer's Name">
          <div className="flex gap-4 flex-col lg:flex-row justify-stretch">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormTextField
                  containerClassName="w-full"
                  {...field}
                  placeholder="First Name"
                  disabled
                />
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormTextField
                  containerClassName="w-full"
                  {...field}
                  placeholder="Last Name"
                  disabled
                />
              )}
            />
          </div>
        </FormItemWrapper>
        <FormItemWrapper
          title="Designer"
          description="You are currently creating your project with this designer"
        >
          <FormTextField
            disabled
            value={`${data?.data?.data?.designer?.user?.firstName || ""} ${data?.data?.data?.designer?.user?.lastName || ""
              }`}
            startAdornment={<UserPlus className="text-gray-400 h-5 w-5" />}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Title" description="Project name">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormTextField
                containerClassName="w-full"
                {...field}
                maxLength={30}
                hint={`${field.value?.length || 0}/30 characters`}
                divider
                endAdornment={
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => {
                      const options = [
                        { value: "MALE", label: "Male" },
                        { value: "FEMALE", label: "Female" },
                      ];
                      return (
                        <CustomReactSelect
                          {...field}
                          value={options?.find(
                            (opt) => opt?.value === field?.value
                          )}
                          placeholder="Gender"
                          onChange={(newValue: unknown) => {
                            const typedValue = newValue as {
                              value: string;
                              label: string;
                            };
                            field.onChange(typedValue?.value);
                          }}
                          adornment
                          options={options}
                        />
                      );
                    }}
                  />
                }
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="About Project"
          description="Tell the designer what you want and how you want it done"
        >
          <FormField
            control={form.control}
            name="about"
            render={({ field }) => <Textarea {...field} />}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="Select Categories"
          description="Choose clothing type"
        >
          <FormField
            control={form.control}
            name="clothingTypes"
            render={({ field }) => (
              <FormCustomTagSelectField
                hint={`${field.value?.length || 0}/8 tags`}
                options={
                  clothingTypes?.data?.data?.map?.((type) => ({
                    value: type?.id,
                    label: type.name,
                  })) || []
                }
                value={field.value || []}
                onChange={(val: string[]) => field.onChange(val)}
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="Project due date"
          description="Choose project end date"
        >
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormCustomDatePickerField
                {...field}
                type="default"
                value={field.value ? new Date(field.value) : undefined}
                onChange={(val: Date) => field.onChange(val)}
                calendar={{
                  fromYear: new Date().getFullYear(),
                  toYear: addYears(new Date(), 2).getFullYear(),
                }}
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="Delivery Details"
          description="Provide the necessary information to make your delivery fast and efficient"
        >
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => {
                return (
                  <CustomSelectCountry
                    {...field}
                    value={field.value}
                    onChange={(newValue: unknown) => {
                      const typedValue = newValue as {
                        value: string;
                        label: string;
                      };
                      field.onChange(typedValue?.value);
                    }}
                    placeholder="Country"
                  />
                );
              }}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <TextField {...field} placeholder="City" />
              )}
            />
            <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <TextField {...field} placeholder="Province / State" />
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <TextField {...field} placeholder="Zip code" />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <TextField {...field} placeholder="Address" />
              )}
            />
          </div>
        </FormItemWrapper>
        <FormItemWrapper
          title="Aditional notes"
          description="Include confidential notes intended for designers only."
        >
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => <Textarea {...field} />}
          />
        </FormItemWrapper>
        {!props.isOnboarding && (
          <FormItemWrapper
            title="Sizing Template"
            description="Choose appropriate sizing templates."
          >
            <FormField
              control={form.control}
              name="sizingTemplateId"
              render={({ field }) => (
                <div className="flex flex-col gap-4">
                  <Switch
                    onCheckedChange={setUseSizingTemplate}
                    checked={useSizingTemplate}
                  />
                  {useSizingTemplate && (
                    <>
                      <div className="flex gap-2 items-center bg-gray-200 p-2">
                        <Info className="text-primary h-6 w-6" />
                        <span className="text-sm">
                          {
                            !sizingTemplateData?.data?.data?.length ?
                              "You have no sizing templates available, you can add sizing template later from the Sizing templates tab" :
                              "Include Sizing template in your Project description or at project start"
                          }
                        </span>
                      </div>
                      <CustomSelect
                        {...field}
                        disabled={loadingSizingTemplate}
                        onValueChange={field.onChange}
                        options={sizingTemplateData?.data?.data?.map(
                          (template) => ({
                            children: template?.name,
                            value: template?.id,
                          })
                        )}
                        placeholder="Select sizing templates"
                      />
                    </>
                  )}
                </div>
              )}
            />
          </FormItemWrapper>
        )}

        <ProjectEditFooter
          handleSave={form.handleSubmit(onSubmit("SAVE"))}
          handleDraft={form.handleSubmit(onSubmit("DRAFT"))}
          loading={isUpdating}
          hideBack={props.isOnboarding}
        />
      </form>
    </Form>
  );
};

export default ProjectDescriptionForm;
