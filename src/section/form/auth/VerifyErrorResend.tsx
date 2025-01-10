"use client";
import { requestEmailVerification } from "@/actions/auth";
import { SUPPORT_EMAIL } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import useHandleError from "@/hooks/useHandleError";
import { Mail } from "lucide-react";
import React, { MouseEventHandler } from "react";

const VerifyErrorResendForm = (props: { email?: string }) => {
  const { toast } = useToast();
  const { handleError } = useHandleError("Verify registration");

  const { email } = props;

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    try {
      await requestEmailVerification(email || "");
      toast({
        title: "Request successful",
        description: `We sent a verification link to ${email}`,
      });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <form className="text-center flex flex-col items-center container max-w-[700px] text-md">
      <span className="icon-wrapper error mb-4">
        <Mail />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">
        Verification Error{" "}
      </h1>

      <p className="mb-6">
        We encountered an error trying to verify{" "}
        {email ? (
          <span className="font-semibold">{email}</span>
        ) : (
          <span>your email address.</span>
        )}
      </p>

      {!!email ? (
        <p>
          Want to try again?{" "}
          <button className="font-semibold text-primary" onClick={handleClick}>
            Click to resend
          </button>
        </p>
      ) : (
        <p>
          Please contact support at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </p>
      )}
    </form>
  );
};

export default VerifyErrorResendForm;
