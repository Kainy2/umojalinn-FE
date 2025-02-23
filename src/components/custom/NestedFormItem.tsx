import { FormTextField } from "@/components/custom/input/TextField";
import { FormField } from "@/components/ui/form";
import {
  LoginFormItemProps,
  RegistrationFormItemProps,
} from "@/lib/formTemplate";
import { isPasswordField } from "@/lib/utils";
import { PasswordFieldKeys } from "@/types/form";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

type NestedFormItemProps = {
  form:
    | UseFormReturn<
        {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
          confirmPassword: string;
        },
        unknown,
        undefined
      >
    | UseFormReturn<
        {
          email: string;
          password: string;
        },
        unknown,
        undefined
      >;
  visible: {
    password: boolean;
    confirmPassword: boolean;
  };
  formItem:
    | RegistrationFormItemProps
    | Array<RegistrationFormItemProps>
    | LoginFormItemProps
    | Array<LoginFormItemProps>;
  handleToggle: (name: "password" | "confirmPassword") => void;
};

const NestedFormItem = (props: NestedFormItemProps) => {
  const { formItem, visible, form, handleToggle } = props;
  if (Array.isArray(formItem)) {
    return (
      <div className="flex gap-4 flex-col lg:flex-row">
        {formItem.map((subFormItem, index) => (
          <NestedFormItem
            {...{ formItem: subFormItem, form, visible, handleToggle }}
            key={index}
          />
        ))}
      </div>
    );
  }

  return (
    <FormField
      // @ts-expect-error Control type should be generic
      control={form.control}
      // @ts-expect-error Name type should be generic
      name={formItem.name}
      key={formItem.name}
      render={({ field }) => (
        <FormTextField
          {...formItem}
          {...field}
          type={
            isPasswordField(formItem.name)
              ? visible[formItem.name as PasswordFieldKeys]
                ? "text"
                : "password"
              : undefined
          }
          containerClassName="flex-1"
          endAdornment={
            isPasswordField(formItem.name) && (
              <button
                type="button"
                className="rounded-full"
                onClick={() => handleToggle(formItem.name as PasswordFieldKeys)}
              >
                {visible[formItem.name as PasswordFieldKeys] ? (
                  <EyeOff />
                ) : (
                  <Eye />
                )}
              </button>
            )
          }
        />
      )}
    />
  );
};

export default NestedFormItem;
