import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import React from "react";

const ConfirmEmailPage = () => {
  return (
    <div className="text-center flex flex-col items-center container max-w-[550px] text-md">
      <span className="icon-wrapper mb-4">
        <Mail />
      </span>
      <h1 className="text-lg font-bold text-foreground mb-2">
        Confirm e-mail Address
      </h1>
      <p className="mb-6">
        Please confirm that{" "}
        <span className="font-semibold">samuelalex@gmail.com</span> is your
        email address.
      </p>
      <Button fullWidth>Confirm</Button>
    </div>
  );
};

export default ConfirmEmailPage;
