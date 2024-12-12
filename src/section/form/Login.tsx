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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginForm = (props: { redirectHref: string | string[] | undefined }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

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

  const onSubmit = useCallback(
    async (values: LoginSchemaProps) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      setLoading(true);

      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (res?.ok) {
        setLoading(false);
        const redirectURL =
          typeof props.redirectHref === "string" ? props.redirectHref : "/";
        router.push(redirectURL);
      } else if (
        res?.error?.includes("400") ||
        res?.error?.includes("401") ||
        res?.error?.includes("404")
      ) {
        form.setError("email", {
          type: "400",
          message: "Email or password is invalid",
        });
      } else {
        form.setError("email", {
          type: "400",
          message: "Please check internet connection",
        });
      }
      setLoading(false);
    },
    [form, props.redirectHref, router]
  );

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
        <Button loading={loading} fullWidth type="submit">
          Login
        </Button>
        <SocialsForm mode="login" />
      </form>
    </Form>
  );
};

export default LoginForm;
