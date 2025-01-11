"use client";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useHandleError from "@/hooks/useHandleError";
import useStorage from "@/hooks/useStorage";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

const ForgotPasswordSuccess = () => {
  const router = useRouter();
  const { getItem, loaded } = useStorage();
  const { handleError } = useHandleError("Forgot Password");

  const { toast } = useToast();

  const email = useMemo(
    () => (loaded ? getItem("AUTH_FORGOT_PASSWORD_EMAIL")?.email : ""),
    [getItem, loaded]
  );

  const handleClick = async () => {
    try {
      await forgotPassword(email || "");
      toast({
        description: `A forgot password email has been resent to ${email}`,
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="text-center flex flex-col gap-2 items-center container max-w-[700px] text-md">
      <span className="icon-wrapper primary mb-2">
        <Mail />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">
        Check your email
      </h1>
      <p className="mb-6 text-foreground-body">
        We don fulfil our promise, we don send you the reset link
      </p>
      {!!email && (
        <div className="text-sm text-foreground-body">
          <span>Didn&apos;t receive the email? </span>{" "}
          <button className="text-primary font-semibold" onClick={handleClick}>
            Click to resend
          </button>
        </div>
      )}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft /> Back to log in
      </Button>
    </div>
  );
};

export default ForgotPasswordSuccess;
