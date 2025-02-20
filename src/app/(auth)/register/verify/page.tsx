"use client";
import { requestEmailVerification } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import useHandleError from "@/hooks/useHandleError";
import useStorage from "@/hooks/useStorage";
import { Mail } from "lucide-react";
import React, { MouseEventHandler, useMemo } from "react";

const RegistrationVerifyPage = () => {
  const { getItem, loaded } = useStorage();
  const { toast } = useToast();
  const { handleError } = useHandleError("Verify registration");

  const email = useMemo(() => {
    return loaded
      ? (getItem("AUTH_REGISTER_EMAIL")?.email as null | string)
      : null;
  }, [getItem, loaded]);

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
      <span className="icon-wrapper primary mb-4">
        <Mail />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">
        Check your email{" "}
      </h1>

      <p className="mb-6">
        We sent a verification link to{" "}
        {email ? (
          <span className="font-semibold">{email}</span>
        ) : (
          <span>your email address.</span>
        )}
      </p>

      {!!email && (
        <p>
          Didn&apos;t receive the email?{" "}
          <button className="font-semibold text-primary" onClick={handleClick}>
            Click to resend
          </button>
        </p>
      )}
    </form>
  );
};

export default RegistrationVerifyPage;
