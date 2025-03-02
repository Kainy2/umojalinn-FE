"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import { FormTextAreaField } from "@/components/custom/input/TextAreaField";
import { FormTextField } from "@/components/custom/input/TextField";
import { FormCustomDatePickerField } from "@/components/custom/picker/Date";
import CustomPhonePicker from "@/components/custom/picker/Phone";
import { FormCustomSelectField } from "@/components/custom/Select";
import CustomSelectCountry from "@/components/custom/SelectCountry";
import TabButtonSelect from "@/components/custom/tab/ButtonSelect";
// import { FormCustomTagSelectField } from "@/components/custom/tag/Select";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import useClipboard from "@/hooks/useClipboard";
import { updateProfileKeys, updateProfileSchema } from "@/lib/schema";
import { jsonToFormData } from "@/lib/utils";
import {
  EXPERIENCE_ENUMS,
  EXPERIENCE_ENUMS_VALUES,
} from "@/section/form/project/edit/RequirementAndBudget";
// import { useGetClothingTypes } from "@/tanstack/hooks/useProject";
import { useGetMe, useUpdateUserDetails } from "@/tanstack/hooks/useUser";
import { UpdateProfileProps } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subYears } from "date-fns";
import { Copy, Mail, MailPlus } from "lucide-react";
import { useSession } from "next-auth/react";

import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SettingsProfilePage = () => {
  // const { data: clothingTypes } = useGetClothingTypes();
  const [editMode, setEditMode] = useState(false);

  const { data: meData, isPending: isGettingMyData } = useGetMe();

  const { mutate: updateMe, isPending: isUpdatingMe } = useUpdateUserDetails();

  const { data: session } = useSession();
  const { handleCopy } = useClipboard();

  const isDesigner = session?.user?.profileRole === "DESIGNER";

  const form = useForm<UpdateProfileProps>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      brandName: "",
      tag: "",
      dateOfBirth: null,
      email: "",
      alternativeEmail: null,
      // clothingType: [],
      phone: "",
      country: "",
      state: "",
      city: "",
      zip: "",
      address: "",
    },
  });

  useEffect(() => {
    if (meData?.data?.data) {
      Object.entries(meData.data.data).forEach(([key, value]) => {
        if (
          value !== null &&
          typeof value !== "object" &&
          updateProfileKeys?.includes(key as keyof UpdateProfileProps)
        ) {
          form.setValue(key as keyof UpdateProfileProps, value.toString());
        }
        if (
          ["designerProfile", "address"].includes(key) &&
          !!value &&
          typeof value !== "object"
        ) {
          Object.entries(value).forEach(([key, value]) => {
            if (
              value !== null &&
              typeof value !== "object" &&
              updateProfileKeys?.includes(key as keyof UpdateProfileProps)
            ) {
              form.setValue(key as keyof UpdateProfileProps, value.toString());
            }
          });
        }
      });
    }

    // if (meData?.data?.data?.clothingTypes?.length) {
    //   form.setValue(
    //     "clothingType",
    //     meData?.data?.data?.clothingTypes?.map?.((type) => type?.id)
    //   );
    // }
  }, [meData?.data?.data, form]);

  const disableForm = isUpdatingMe || !editMode;

  const onSubmit = useCallback(
    async (values: UpdateProfileProps) => {
      updateMe(jsonToFormData(values));
    },
    [updateMe]
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isDesigner && (
          <FormItemWrapper title="About me">
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormTextAreaField
                  placeholder="Bio"
                  maxLength={300}
                  hint="300 characters max"
                  disabled={disableForm}
                  {...field}
                  value={field?.value || ""}
                />
              )}
            />
          </FormItemWrapper>
        )}
        <FormItemWrapper title="Name">
          <div className="flex flex-col lg:flex-row gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormTextField
                  placeholder="First Name"
                  disabled={disableForm}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormTextField
                  placeholder="Last Name"
                  disabled={disableForm}
                  {...field}
                />
              )}
            />
          </div>
        </FormItemWrapper>
        <FormItemWrapper title="Brand" description="(Optional)">
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormTextField
                placeholder="Brand Name"
                disabled={disableForm}
                {...field}
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Tag">
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormTextField
                startAdornment={
                  <span className="text-foreground-body opacity-50">
                    app.umojalinn.com/
                  </span>
                }
                placeholder="alex"
                className="pl-40 "
                disabled={disableForm}
                endAdornment={
                  <button
                    type="button"
                    disabled={isGettingMyData || editMode}
                    onClick={() =>
                      meData?.data?.data?.tag &&
                      handleCopy(meData?.data?.data?.tag)
                    }
                    className="[&>svg]:size-5 text-foreground-body disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy />
                  </button>
                }
                {...field}
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Gender">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormCustomSelectField
                value={field?.value || null}
                onValueChange={(value) => field?.onChange(value)}
                disabled={disableForm}
                options={[
                  { value: "MALE", children: "Male" },
                  { value: "FEMALE", children: "Female" },
                ]}
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Date of birth">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormCustomDatePickerField
                {...field}
                type="default"
                value={field.value ? new Date(field.value) : undefined}
                onChange={(val: Date) => field.onChange(val)}
                disabled={disableForm}
                calendar={{
                  toYear: new Date().getFullYear(),
                  fromYear: subYears(new Date(), 100).getFullYear(),
                }}
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Email">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormTextField
                {...field}
                placeholder="you@example.com"
                disabled={disableForm}
                startAdornment={
                  <Mail className="size-5 text-foreground-body" />
                }
              />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper
          title="Alternative contact email"
          description="Enter an alternative email if you would like to be contacted via a different email."
        >
          <FormField
            control={form.control}
            name="alternativeEmail"
            render={({ field }) => (
              <FormTextField
                placeholder="youplus@example.com"
                disabled={disableForm}
                startAdornment={
                  <MailPlus className="size-5 text-foreground-body" />
                }
                {...field}
                value={field?.value || ""}
              />
            )}
          />
        </FormItemWrapper>
        {isDesigner && (
          <>
            <Separator className="bg-border/50" />
            {/* <FormItemWrapper title="Specialist">
          <FormField
            control={form.control}
            name="specialist"
            render={({ field }) => (
              <FormCustomSelectField
                value={field?.value}
                onValueChange={(value) => field?.onChange(value)}
                disabled={disableForm}
                options={[
                  { value: "MALE", children: "Men's wear" },
                  { value: "FEMALE", children: "Women's wear" },
                ]}
              />
            )}
          />
        </FormItemWrapper> */}
            {/* <FormItemWrapper title="Clothing Type">
          <FormField
            control={form.control}
            name="clothingType"
            render={({ field }) => (
              <FormCustomTagSelectField
                hint={`${field.value?.length || 0}/8 tags`}
                disabled={disableForm}
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
        </FormItemWrapper> */}
            <FormItemWrapper
              title="Experience level"
              description="Select your level of experience"
            >
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <TabButtonSelect
                    active={field?.value || null}
                    className="truncate [&>*]:truncate"
                    disabled={disableForm}
                    tabs={EXPERIENCE_ENUMS.map((exp, i) => ({
                      value: EXPERIENCE_ENUMS_VALUES?.[i],
                      title: exp,
                    }))}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
            </FormItemWrapper>
            <FormItemWrapper
              title="Language"
              description="Select your preferred language and level of proficiency"
            >
              <FormField
                control={form.control}
                name="language"
                disabled={disableForm}
                render={({ field }) => <FormTextField {...field} />}
              />
            </FormItemWrapper>
            <FormItemWrapper title="Phone number">
              <FormField
                control={form.control}
                name="phone"
                disabled={disableForm}
                render={({ field }) => <CustomPhonePicker {...field} />}
              />
            </FormItemWrapper>
          </>
        )}
        <Separator className="bg-border/50" />
        <FormItemWrapper title="Country">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => {
              return (
                <CustomSelectCountry
                  {...field}
                  value={field.value}
                  isDisabled={disableForm}
                  onChange={(newValue: unknown) => {
                    const typedValue = newValue as {
                      value: string;
                      label: string;
                    };
                    field.onChange(typedValue?.value);
                  }}
                  placeholder="Select Country"
                />
              );
            }}
          />
        </FormItemWrapper>
        <FormItemWrapper title="State/Province">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormTextField {...field} disabled={disableForm} />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="City">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormTextField {...field} disabled={disableForm} />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Zip/Postal code">
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormTextField {...field} disabled={disableForm} />
            )}
          />
        </FormItemWrapper>
        <FormItemWrapper title="Home address">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormTextField {...field} disabled={disableForm} />
            )}
          />
        </FormItemWrapper>
        <Separator className="bg-border/50 " />
        <div className="flex gap-4 justify-end">
          {!editMode ? (
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditMode(true)}
              disabled={isGettingMyData}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                type="button"
                disabled={disableForm}
                onClick={() => {
                  setEditMode(false);
                  form?.clearErrors();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={disableForm}>
                Save
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default SettingsProfilePage;
