"use client";
import { Form, FormField } from "@/components/ui/form";
import { forgotPasswordFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ForgotPasswordSchemaProps } from "@/types/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormTextField } from "@/components/custom/input/TextField";
import { ArrowLeft } from "lucide-react";
import useStorage from "@/hooks/useStorage";
import { forgotPassword } from "@/actions/auth";
import useHandleError from "@/hooks/useHandleError";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const { setItem } = useStorage();
  const { handleError } = useHandleError("Forgot Password");

  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordSchemaProps>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = useCallback(
    async (values: ForgotPasswordSchemaProps) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      setLoading(true);
      try {
        await forgotPassword(values?.email);
        setItem("AUTH_FORGOT_PASSWORD_EMAIL", { email: values.email });
        router.push("/forgot-password/requested");
      } catch (error: unknown) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleError, router, setItem]
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormTextField
              {...field}
              label="Email"
              placeholder="Enter your email"
            />
          )}
        />

        <Button loading={loading} fullWidth type="submit">
          Reset password
        </Button>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft /> Back to log in
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
