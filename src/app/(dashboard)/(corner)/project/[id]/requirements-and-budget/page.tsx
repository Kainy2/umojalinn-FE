"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import CustomSelect from "@/components/custom/Select";
import TextField from "@/components/custom/TextField";
import { cn } from "@/lib/utils";
import { DollarSign, Lock } from "lucide-react";
import React, { useState } from "react";

const EXPERIENCE_ENUMS = [
  "1 - 2 years",
  "3 - 5 years",
  "6 - 8 years",
  "9+ years",
  "All",
] as const;

const RequirementsBudgetPage = () => {
  const [exp, setExp] = useState<(typeof EXPERIENCE_ENUMS)[number]>(
    EXPERIENCE_ENUMS[0]
  );
  return (
    <div className="flex flex-col gap-6">
      <FormItemWrapper
        title="Specialist"
        description="Add specialist tag to help with your search for a designer"
      >
        <CustomSelect options={[]} />
      </FormItemWrapper>
      <FormItemWrapper
        title="Experience level"
        description="Select the level of experience for your designer"
      >
        <div className="p-1 flex flex-wrap justify-between gap-1 bg-slate-100">
          {EXPERIENCE_ENUMS.map((experience) => (
            <button
              key={experience}
              className={cn(
                "py-1.5 px-4 text-sm font-semibold text-slate-500",
                exp === experience &&
                  "bg-white border-primary border text-primary"
              )}
              onClick={() => setExp(experience)}
            >
              {experience}
            </button>
          ))}
        </div>
      </FormItemWrapper>
      <FormItemWrapper
        title="Specialist"
        description="Add specialist tag to help with your search for a designer"
        endAdornment={
          <button>
            <Lock className="h-5 w-5 text-primary" />
          </button>
        }
      >
        <TextField
          placeholder="0"
          startAdornment={<DollarSign className="text-slate-500 h-5 w-5" />}
          endAdornment={<CustomSelect adornment placeholder="Currency" />}
        />
      </FormItemWrapper>
    </div>
  );
};

export default RequirementsBudgetPage;
