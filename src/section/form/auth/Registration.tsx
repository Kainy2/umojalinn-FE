"use client";
import { Form } from "@/components/ui/form";
import { registrationFormSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { RegistrationSchemaProps } from "@/types/form";
import {
  RegistrationFormItemProps,
  registrationFormTemplate,
} from "@/lib/formTemplate";
import SocialsForm from "./Socials";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NestedFormItem from "@/components/custom/NestedFormItem";
import { createAccount } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import useStorage from "@/hooks/useStorage";
import CustomCheckbox from "@/components/custom/Checkbox";
import Link from "next/link";
import useHandleError from "@/hooks/useHandleError";

const RegistrationForm = (props: { inviterTag?: string }) => {
  const router = useRouter();
  const { setItem } = useStorage();
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();
  const { handleError } = useHandleError("Registration");
  const form = useForm<RegistrationSchemaProps>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const [visible, setVisible] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleToggle = useCallback((name: keyof typeof visible) => {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  async function onSubmit(values: RegistrationSchemaProps) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    try {
      await createAccount({ ...values, inviterTag: props.inviterTag });
      setItem("AUTH_REGISTER_EMAIL", { email: values?.email });
      setLoading(false);
      router.push("/register/verify");
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {registrationFormTemplate.map((formItem, index) => {
          const typedFormItem = formItem as RegistrationFormItemProps;
          return (
            <NestedFormItem
              key={index}
              {...{ formItem: typedFormItem, form, handleToggle, visible }}
            />
          );
        })}
        <div className="my-4">
          <CustomCheckbox
            checked={agree}
            onCheckedChange={() => setAgree((agree) => !agree)}
            label={{
              children: (
                <>
                  You agree to our{" "}
                  <Link href="/privacy-policy" className="underline">
                    privacy policy
                  </Link>
                </>
              ),
            }}
          />
        </div>
        <Button loading={loading} disabled={!agree} fullWidth type="submit">
          Get Started
        </Button>
        <SocialsForm mode="register" inviterTag={props.inviterTag} />
      </form>
    </Form>
  );
};

export default RegistrationForm;
