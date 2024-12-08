import { Mail } from "lucide-react";
import React from "react";

const RegistrationVerifyPage = () => {
  return (
    <div className="text-center flex flex-col items-center container max-w-[550px] text-md">
      <span className="icon-wrapper mb-4">
        <Mail />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">
        Check your email{" "}
      </h1>
      <p className="mb-6">
        We sent a verification link to{" "}
        <span className="font-semibold">samuelalex@gmail.com</span>
      </p>
      <p>
        Didn&apos;t receive the email?{" "}
        <button className="font-semibold text-primary">Click to resend</button>
      </p>
    </div>
  );
};

export default RegistrationVerifyPage;
