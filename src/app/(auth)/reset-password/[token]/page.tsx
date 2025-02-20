import ResetPasswordForm from "@/section/form/auth/ResetPassword";
import { PageProps } from "@/types/util";
import { KeyRound } from "lucide-react";
import React from "react";

const ResetPasswordPage = async (props: PageProps<{ token: string }>) => {
  const { token } = await props.params;

  return (
    <div className="max-w-[550px] container">
      <div className="text-center flex flex-col gap-2 items-center text-md">
        <span className="icon-wrapper primary mb-2">
          <KeyRound />
        </span>
        <h1 className="text-lg font-bold text-foreground mb-2">
          Set new password
        </h1>
        <p className="mb-6 text-foreground-body">
          Your new password must be different to previously used passwords.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
