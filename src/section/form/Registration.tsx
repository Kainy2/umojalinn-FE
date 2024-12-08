"use client";
import { Form } from "@/components/ui/form";
import { registrationFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { RegistrationSchemaProps } from "@/types/form";
import { registrationFormTemplate } from "@/lib/formTemplate";
import SocialsForm from "./Socials";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NestedFormItem from "@/components/custom/NestedFormItem";

const RegistrationForm = () => {
  const router = useRouter();
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

  function onSubmit(values: RegistrationSchemaProps) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    router.push("/register/verify");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {registrationFormTemplate.map((formItem, index) => (
          <NestedFormItem
            key={index}
            {...{ formItem, form, handleToggle, visible }}
          />
        ))}
        <Button fullWidth type="submit">
          Get Started
        </Button>
        <SocialsForm mode="register" />
      </form>
    </Form>
  );
};

export default RegistrationForm;
