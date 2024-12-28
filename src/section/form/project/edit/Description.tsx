"use client";
import { FormCustomDatePickerField } from "@/components/custom/DatePicker";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import TextField, { FormTextField } from "@/components/custom/TextField";
import { Textarea } from "@/components/ui/textarea";
import { Info, UserPlus } from "lucide-react";
import React, { useEffect, useCallback } from "react";
import { countries } from "country-list-json";
import { Switch } from "@/components/ui/switch";
import {
  useGetClothingTypes,
  useGetProjectById,
  useUpdateProjectById,
} from "@/tanstack/hooks/useProject";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormDetailsSchema } from "@/lib/schema";
import { ProjectFormDetailsProps } from "@/types/form";
import { useForm } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import { addYears } from "date-fns";

import { FormCustomTagSelectField } from "@/components/custom/TagSelect";
import { jsonToFormData } from "@/lib/utils";
import CustomSelect from "@/components/custom/Select";
import ProjectEditFooter from "./Footer";

type ProjectDescriptionFormProps = {
  id: string;
};

const ProjectDescriptionForm = (props: ProjectDescriptionFormProps) => {
  const { data } = useGetProjectById(props.id);
  const { data: clothingTypes } = useGetClothingTypes();
  const {
    mutateAsync,
    isPending: isUpdating,
    isSuccess,
  } = useUpdateProjectById(props.id);

  const form = useForm<ProjectFormDetailsProps>({
    resolver: zodResolver(projectFormDetailsSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (data?.data?.data?.buyer?.user) {
      form.setValue("firstName", data?.data?.data?.buyer?.user?.firstName);
      form.setValue("lastName", data?.data?.data?.buyer?.user?.lastName);
    }
    if (data?.data?.data?.designerId) {
      form.setValue("designerId", data?.data?.data?.designerId);
    }
    if (data?.data?.data?.title) {
      form.setValue("title", data?.data?.data?.title);
    }
    if (data?.data?.data?.gender) {
      form.setValue("gender", data?.data?.data?.gender);
    }
    if (data?.data?.data?.about) {
      form.setValue("about", data?.data?.data?.about);
    }
    if (data?.data?.data?.deliveryAddress?.city) {
      form.setValue("city", data?.data?.data?.deliveryAddress?.city);
    }
    if (data?.data?.data?.deliveryAddress?.country) {
      form.setValue("country", data?.data?.data?.deliveryAddress?.country);
    }
    if (data?.data?.data?.deliveryAddress?.address) {
      form.setValue("address", data?.data?.data?.deliveryAddress?.address);
    }
    if (data?.data?.data?.deliveryAddress?.state) {
      form.setValue("state", data?.data?.data?.deliveryAddress?.state);
    }
    if (data?.data?.data?.deliveryAddress?.zipCode) {
      form.setValue("zipCode", data?.data?.data?.deliveryAddress?.zipCode);
    }
    if (data?.data?.data?.clothingTypes?.length) {
      form.setValue(
        "clothingTypes",
        data?.data?.data?.clothingTypes?.map?.((type) => type.id)
      );
    }
  }, [data?.data?.data, form]);

  const onSubmit = useCallback(
    async (values: ProjectFormDetailsProps) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { firstName, lastName, designerId, ...otherValues } = values;
      const val = jsonToFormData({
        ...otherValues,
      });
      await mutateAsync(val);
    },
    [mutateAsync]
  );

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
            value={data?.data?.data?.designer?.user?.email || ""}
            startAdornment={<UserPlus className="text-slate-400 h-5 w-5" />}
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
                maxLength={15}
                hint={`${field.value?.length || 0}/15 characters`}
                divider
                endAdornment={
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        placeholder="Gender"
                        onValueChange={(value) => field.onChange(value)}
                        adornment
                        options={[
                          { value: "MALE", children: "Male" },
                          { value: "FEMALE", children: "Female" },
                        ]}
                      />
                    )}
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
                    value: type.id,
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
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  placeholder="Country"
                  options={countries.map((country) => {
                    return {
                      type: "option",
                      value: country?.name,
                      children: (
                        <span className="flex gap-2 items-center">
                          <span className="text-md rounded-full object-cover overflow-hidden">
                            {country?.flag}
                          </span>
                          <span>{country?.name}</span>
                        </span>
                      ),
                    };
                  })}
                />
              )}
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
          title="Aditional note"
          description="Include confidential notes intended for designers only."
        >
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => <Textarea {...field} />}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="Sizing Template"
          description="Choose appropriate sizing templates."
        >
          <div className="flex flex-col gap-4">
            <Switch />
            <div className="flex gap-2 items-center bg-slate-200 p-2">
              <Info className="text-primary h-6 w-6" />
              <span className="text-sm">
                Include Sizing template in your Project description or at
                project start
              </span>
            </div>
            <CustomSelect placeholder="Select sizing templates" />
          </div>
        </FormItemWrapper>

        <ProjectEditFooter
          handleSave={async (e) => {
            await form.handleSubmit(onSubmit)(e);
            return isSuccess;
          }}
          loading={isUpdating}
          nextUrl={`/project/${props.id}/gallery`}
        />
      </form>
    </Form>
  );
};

export default ProjectDescriptionForm;
