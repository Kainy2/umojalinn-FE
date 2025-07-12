import ForgotPasswordForm from "@/section/form/auth/ForgotPassword";
import { KeyRound } from "lucide-react";
import React from "react";

const ForgotPasswordPage = () => {
  return (
    <div className="max-w-[700px] container">
      <div className="text-center flex flex-col gap-2 items-center text-md">
        <span className="icon-wrapper primary mb-2">
          <KeyRound />
        </span>
        <h1 className="text-lg font-bold text-foreground mb-2">
          Forgot password?
        </h1>
        <p className="mb-6 text-foreground-body">
          No stress, we dey your back like shirt.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
