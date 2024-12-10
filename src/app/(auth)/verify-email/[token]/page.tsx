"use client";
import { verifyEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import useHandleError from "@/hooks/useHandleError";
import { Mail } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { MouseEventHandler, useState } from "react";

const ConfirmEmailPage = () => {
  const params = useParams<{ token: string }>();
  const { handleError } = useHandleError("Email verification");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await verifyEmail(params?.token);
      setLoading(false);
      router.replace("/verify-email/success");
    } catch (error) {
      handleError(error);
    }
    setLoading(false);
  };

  return (
    <div className="text-center flex flex-col items-center container max-w-[550px] text-md">
      <span className="icon-wrapper mb-4">
        <Mail />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">
        Confirm e-mail Address
      </h1>
      <p className="mb-6">
        {/* Please confirm that{" "}
        <span className="font-semibold">samuelalex@gmail.com</span> is your
        email address. */}
        Please confirm your email address.
      </p>
      <Button fullWidth onClick={handleClick} loading={loading}>
        Confirm
      </Button>
    </div>
  );
};

export default ConfirmEmailPage;
