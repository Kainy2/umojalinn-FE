"use client";
import CustomDatePicker from "@/components/custom/DatePicker";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import CustomSelect from "@/components/custom/Select";
import { TagInput } from "@/components/custom/TagInput";
import TextField from "@/components/custom/TextField";
import { Textarea } from "@/components/ui/textarea";
import { Info, UserPlus } from "lucide-react";
import React from "react";
import { countries } from "country-list-json";
import { Switch } from "@/components/ui/switch";

const ProjectDescriptionPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <FormItemWrapper title="Name" description="Buyer's Name">
        <div className="flex gap-4 flex-col lg:flex-row">
          <TextField placeholder="First Name" disabled />
          <TextField placeholder="Last Name" disabled />
        </div>
      </FormItemWrapper>
      <FormItemWrapper
        title="Designer"
        description="You are currently creating your project with this designer"
      >
        <TextField
          disabled
          startAdornment={<UserPlus className="text-slate-400 h-5 w-5" />}
        />
      </FormItemWrapper>
      <FormItemWrapper title="Title" description="Project name">
        <TextField
          maxLength={15}
          hint="8/15 characters"
          divider
          endAdornment={
            <CustomSelect
              placeholder="Gender"
              adornment
              options={[
                { value: "MALE", children: "Male" },
                { value: "FEMALE", children: "Female" },
              ]}
            />
          }
        />
      </FormItemWrapper>
      <FormItemWrapper
        title="About Project"
        description="Tell the designer what you want and how you want it done"
      >
        <Textarea />
      </FormItemWrapper>
      <FormItemWrapper
        title="Select Categories"
        description="Choose clothing type"
      >
        <TagInput value={[]} onChange={() => {}} />
      </FormItemWrapper>
      <FormItemWrapper
        title="Project due date"
        description="Choose project end date"
      >
        <CustomDatePicker />
      </FormItemWrapper>
      <FormItemWrapper
        title="Delivery Details"
        description="Provide the necessary information to make your delivery fast and efficient"
      >
        <div className="flex flex-col gap-4">
          <CustomSelect
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
          <TextField placeholder="City" />
          <div className="flex flex-col lg:flex-row gap-4">
            <TextField placeholder="Province / State" />
            <TextField placeholder="Zip code" />
          </div>
          <TextField placeholder="Address" />
        </div>
      </FormItemWrapper>
      <FormItemWrapper
        title="Aditional note"
        description="Include confidential notes intended for designers only."
      >
        <Textarea />
      </FormItemWrapper>
      <FormItemWrapper
        title="Sizing Template"
        description="Include confidential notes intended for designers only."
      >
        <div className="flex flex-col gap-4">
          <Switch />
          <div className="flex gap-2 items-center bg-slate-200 p-2">
            <Info className="text-primary h-6 w-6" />
            <span className="text-sm">
              Include Sizing template in your Project description or at project
              start
            </span>
          </div>
          <CustomSelect placeholder="Select sizing templates" />
        </div>
      </FormItemWrapper>
    </div>
  );
};

export default ProjectDescriptionPage;
