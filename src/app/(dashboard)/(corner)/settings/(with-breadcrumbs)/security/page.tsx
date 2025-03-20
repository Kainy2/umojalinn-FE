"use client";
import FormItemWrapper from "@/components/custom/FormItemWrapper";
import { FormTextField } from "@/components/custom/input/TextField";
import { Button } from "@/components/ui/button";
import { FormField, Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { passwordUpdateSchema } from "@/lib/schema";
import { useUpdatePassword } from "@/tanstack/hooks/useUser";
import { PasswordUpdateProps } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const SettingsSecurityPage = () => {
  const form = useForm<PasswordUpdateProps>({
    resolver: zodResolver(passwordUpdateSchema),
  });

  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const { toast } = useToast();

  const onSubmit = (values: PasswordUpdateProps) => {
    updatePassword(values, {
      onSuccess() {
        toast({
          description: "Password Updated!",
        });
        Object.keys(values).map((key) =>
          form?.setValue(key as keyof PasswordUpdateProps, "")
        );
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-subtitle-2 font-semibold text-foreground mb-1">
          Password
        </h1>
        <p className="text-foreground-body">
          Please enter your current password to change it
        </p>
      </div>
      <Separator className="bg-border/50 " />
      <Form {...form}>
        <form
          className="flex flex-col gap-8 mt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormItemWrapper title="Current password">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormTextField {...field} type="password" />
              )}
            />
          </FormItemWrapper>
          <FormItemWrapper title="New password">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormTextField
                  {...field}
                  type="password"
                  hint="Password must be at least 8 characters"
                />
              )}
            />
          </FormItemWrapper>
          <FormItemWrapper title="Confirm password">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormTextField {...field} type="password" />
              )}
            />
          </FormItemWrapper>
          <div>
            <Separator className="bg-border/50 mb-4" />
            <div className="flex justify-end">
              <Button loading={isPending}>Update password</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SettingsSecurityPage;
