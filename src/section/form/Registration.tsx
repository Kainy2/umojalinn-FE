"use client";
import { FormTextField } from "@/components/custom/TextField";
import { Form, FormField } from "@/components/ui/form";
import { registrationFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordFieldKeys, RegistrationSchemaProps } from "@/types/form";
import { isPasswordField } from "@/lib/utils";
import { registrationFormTemplate } from "@/lib/formTemplate";
import SocialsForm from "./Socials";
import { Button } from "@/components/ui/button";

function onSubmit(values: RegistrationSchemaProps) {
  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  console.log(values);
}

const RegistrationForm = () => {
  const form = useForm<RegistrationSchemaProps>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [visible, setVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleToggle = useCallback((name: keyof typeof visible) => {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {registrationFormTemplate.map((formItem) => {
          return (
            <FormField
              control={form.control}
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
                  endAdornment={
                    isPasswordField(formItem.name) && (
                      <button
                        type="button"
                        className="icon-button"
                        onClick={() =>
                          handleToggle(formItem.name as PasswordFieldKeys)
                        }
                      >
                        {visible[formItem.name as PasswordFieldKeys] ? (
                          <EyeClosed />
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
        })}
        <Button fullWidth type="submit">
          Get Started
        </Button>
        <SocialsForm mode="register" />
      </form>
    </Form>
  );
};

export default RegistrationForm;
