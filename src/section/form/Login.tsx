"use client";
import { Form } from "@/components/ui/form";
import { loginFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchemaProps } from "@/types/form";
import { loginFormTemplate } from "@/lib/formTemplate";
import SocialsForm from "./Socials";
import { Button } from "@/components/ui/button";
import NestedFormItem from "@/components/custom/NestedFormItem";

function onSubmit(values: LoginSchemaProps) {
  // Do something with the form values.
  // ✅ This will be type-safe and validated.
  console.log(values);
}

const LoginForm = () => {
  const form = useForm<LoginSchemaProps>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
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
        className="flex flex-col gap-4 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {loginFormTemplate.map((formItem, index) => {
          return (
            <NestedFormItem
              key={index}
              {...{ formItem, form, handleToggle, visible }}
            />
          );
        })}
        <Button fullWidth type="submit">
          Login
        </Button>
        <SocialsForm mode="login" />
      </form>
    </Form>
  );
};

export default LoginForm;
