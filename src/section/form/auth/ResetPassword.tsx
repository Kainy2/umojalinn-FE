"use client";
import { Form, FormField } from "@/components/ui/form";
import { resetPasswordFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordSchemaProps } from "@/types/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormTextField } from "@/components/custom/input/TextField";
import { resetPassword } from "@/actions/auth";
import useHandleError from "@/hooks/useHandleError";

const ResetPasswordForm = (props: { token: string }) => {
  const router = useRouter();
  const { handleError } = useHandleError("Forgot Password");

  const [loading, setLoading] = useState(false);

  const form = useForm<ResetPasswordSchemaProps>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (values: ResetPasswordSchemaProps) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      setLoading(true);
      try {
        await resetPassword({ ...values, token: props.token });
        router.push("/reset-password/success");
      } catch (error: unknown) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    },
    [handleError, props.token, router]
  );

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormTextField
              {...field}
              label="Password"
              type="password"
              placeholder="•••••••••"
              hint="Must be at least 8 characters."
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormTextField
              {...field}
              label="Confirm Password"
              type="password"
              placeholder="•••••••••"
            />
          )}
        />

        <Button loading={loading} fullWidth type="submit">
          Reset password
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
