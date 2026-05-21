"use client";
import { FormCustomDatePickerField } from "@/components/custom/picker/Date";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import TextField, { FormTextField } from "@/components/custom/input/TextField";
import { Textarea } from "@/components/ui/textarea";
import { Info, UserPlus } from "lucide-react";
import React, { useEffect, useCallback, useMemo, useState } from "react";
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
import { Form, FormErrorMessage, FormField } from "@/components/ui/form";
import { addYears } from "date-fns";

import { FormCustomTagSelectField } from "@/components/custom/tag/Select";
import { jsonToFormData } from "@/lib/utils";
import CustomSelect from "@/components/custom/Select";
import ProjectEditFooter from "./ProjectEditFooter";
// import ProjectEditFooter from "./Footer";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetAllSizingTemplates } from "@/tanstack/hooks/useSizingTemplates";
import CustomSelectCountry from "@/components/custom/SelectCountry";
import CustomReactSelect from "@/components/custom/ReactSelect";
import { useCreateProjectContext } from "@/hooks/create-project/useCreateProjectContext";
import { filterTemplatesForProject } from "@/lib/sizing-template-utils";

export type ProjectFormProps = {
  id: string;
  isOnboarding?: boolean;
};

const ProjectDescriptionForm = (props: ProjectFormProps) => {
  const { data, isLoading: loadingProject } = useGetProjectById(props?.id);
  const { data: clothingTypes } = useGetClothingTypes();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProjectById(
    props?.id
  );
  const [useSizingTemplate, setUseSizingTemplate] = useState(false);

  const router = useRouter();
  const { projectFormDetails, setProjectFormDetails } = useCreateProjectContext()

  const isAds = data?.data?.data.status === 'ADS'

  const form = useForm<ProjectFormDetailsProps>({
    resolver: zodResolver(projectFormDetailsSchema),
    defaultValues: {},
    mode: "onBlur",
  });

  const { data: sizingTemplateData, isPending: loadingSizingTemplate } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: "LIVE",
    });

  const projectGender = form.watch("gender") || data?.data?.data?.gender;
  const matchingSizingTemplates = useMemo(
    () =>
      filterTemplatesForProject(
        sizingTemplateData?.data?.data ?? [],
        projectGender as "MALE" | "FEMALE" | null | undefined,
      ),
    [sizingTemplateData?.data?.data, projectGender],
  );

  useEffect(() => {
    if (isAds && projectFormDetails.firstName) {
      form.reset(projectFormDetails)
      return
    }

    if (data?.data?.data) {
      Object.entries(data.data.data).forEach(([key, value]) => {
        if (
          value !== null &&
          typeof value !== "object" &&
          projectFormDetailsKeys?.includes(key as keyof ProjectFormDetailsProps)
        ) {
          if (key === "sizingTemplateId" && !!value) setUseSizingTemplate(true);
          form.setValue(
            key as keyof ProjectFormDetailsProps,
            typeof value === "boolean" ? value : value.toString()
          );
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
  }, [data?.data?.data, form, isAds, projectFormDetails]);


  const onSubmit = useCallback(
    (mode: "SAVE" | "DRAFT") => (values: ProjectFormDetailsProps) => {

      if (isAds) {
        setProjectFormDetails(prev => ({ ...prev, ...values }))
        router.push(`/project/${uuidToBase62Safe(props?.id)}/gallery`);
        return
      }

      const { firstName, lastName, designerId, ...otherValues } = values;
      void firstName; void lastName; void designerId;

      const val = jsonToFormData(otherValues);


      updateProject(val, {
        onSuccess() {
          router.push(
            mode === "DRAFT"
              ? "/projects/drafts"
              : `${!!props.isOnboarding ? "/onboard" : ""
              }/project/${uuidToBase62Safe(props?.id)}/gallery`
          );
        },
      });
    },
    [props?.id, props.isOnboarding, router, updateProject, setProjectFormDetails, isAds]
  );

  useEffect(() => {
    if (form.watch("sizingTemplateId")) setUseSizingTemplate(true);
    else setUseSizingTemplate(false);
  }, [form.watch("sizingTemplateId")]);


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
              render={({ field, fieldState }) => (
                <FormTextField
                  containerClassName="w-full"
                  {...field}
                  error={fieldState.error}
                  placeholder="First Name"
                  disabled
                />
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field, fieldState }) => (
                <FormTextField
                  containerClassName="w-full"
                  {...field}
                  error={fieldState.error}
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
            render={({ field, fieldState, formState }) => (
              <FormTextField
                containerClassName="w-full"
                {...field}
                error={fieldState.error || formState.errors.gender}
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
          description="Tell the designer what you want and how you want it done. You can attach your inspo photos on the next page!"
        >
          <FormField
            control={form.control}
            name="about"
            render={({ field, fieldState }) => <Textarea {...field} error={fieldState.error} />}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="Select Categories"
          description="Choose clothing type"
        >
          <FormField
            control={form.control}
            name="clothingTypes"
            render={({ field, fieldState }) => (
              <>
                <FormCustomTagSelectField
                  error={fieldState.error}
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
                {fieldState.error && <FormErrorMessage message={fieldState.error?.message} />}
              </>

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
            render={({ field, fieldState }) => (
              <>
                <FormCustomDatePickerField
                  {...field}
                  error={fieldState.error}
                  type="default"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(val: Date) => field.onChange(val)}
                  calendar={{
                    fromYear: new Date().getFullYear(),
                    toYear: addYears(new Date(), 2).getFullYear(),
                  }}
                />
                {fieldState.error && <FormErrorMessage message={fieldState.error?.message} />}
              </>
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
              render={({ field, fieldState }) => {
                return (
                  <>
                    <CustomSelectCountry
                      {...field}
                      error={fieldState.error}
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
                    {fieldState.error && <FormErrorMessage message={fieldState.error?.message} />}
                  </>
                );
              }}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <>
                  <TextField {...field} error={fieldState.error} placeholder="City" />
                  {fieldState.error && <FormErrorMessage message={fieldState.error?.message} />}
                </>
              )}
            />
            <div className="flex flex-col lg:flex-row gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <TextField {...field} error={fieldState.error} placeholder="Province / State" />
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field, fieldState }) => (
                  <TextField {...field} error={fieldState.error} placeholder="Zip code" />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <>
                  <TextField {...field} error={fieldState.error} placeholder="Address" />
                  {fieldState.error && <FormErrorMessage message={fieldState.error?.message} />}
                </>
              )}
            />
          </div>
        </FormItemWrapper>
        <FormItemWrapper
          title="Additional notes"
          description="Include confidential notes intended for designers only."
        >
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field, fieldState }) =>
              <Textarea {...field} error={fieldState.error} />
            }
          />
        </FormItemWrapper>

        {!props.isOnboarding && (
          <FormItemWrapper
            title="Sizing Template"
            description="Choose available sizing template."
          >
            <FormField
              control={form.control}
              name="sizingTemplateId"
              render={({ field, fieldState }) => (
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
                            !matchingSizingTemplates.length ?
                              "You have no sizing templates available, you can add sizing template later from the Sizing templates tab" :
                              "Include Sizing template in your Project description or at project start"
                          }
                        </span>
                      </div>
                      {
                        matchingSizingTemplates.length ?
                          (<CustomSelect
                            key={String(matchingSizingTemplates.length)}
                            {...field}
                            error={fieldState.error}
                            disabled={loadingSizingTemplate}
                            onValueChange={field.onChange}
                            options={matchingSizingTemplates.map(
                              (template) => ({
                                children: template?.name,
                                value: template?.id,
                              })
                            )}
                            placeholder="Select sizing templates"
                          />) : (<></>)
                      }
                    </>
                  )}
                </div>
              )}
            />
          </FormItemWrapper>
        )}

        <FormItemWrapper
          title="Will you be providing your own material?"
          description="Toggle yes if you are providing your own material"
        >
          <FormField
            control={form.control}
            name="willProvideMaterials"
            render={({ field: { onChange, value } }) => (
              <Switch
                key={String(value)}
                onCheckedChange={onChange}
                checked={value}
                showHelpText
                checkedHelpText="Yes"
                uncheckedHelpText="No"
              />
            )}
          />
        </FormItemWrapper>

        <ProjectEditFooter
          leftButtonProps={{ hidden: true }}
          // leftButtonProps={{ hidden: !props.isOnboarding }}
          rightSecondaryButtonProps={{
            text: isAds ? "Cancel" : "Save & Exit",
            disabled: isUpdating,
            onClick: (e) => {
              if (isAds) router.push(`/projects/ads/${uuidToBase62Safe(props?.id)}`);
              else { form.handleSubmit(onSubmit("DRAFT"))(e) };
            },
          }}
          rightPrimaryButtonProps={{
            text: isAds ? "Next" : undefined,
            disabled: isUpdating,
            onClick: form.handleSubmit(onSubmit("SAVE")),
          }}
        />
      </form>
    </Form>
  );
};

export default ProjectDescriptionForm;
