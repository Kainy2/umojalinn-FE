import Image from "next/image";
import React from "react";
import RegistrationForm from "@/section/form/Registration";

const RegistrationPage = () => {
  return (
    <div className="w-[90vw] md:w-[70vw] lg:w-[500px] py-12 ">
      <div className="text-center mb-4 flex flex-col items-center">
        <Image
          className="mb-2"
          src="/img/png/umoja.png"
          alt="Umoja logo"
          height={80}
          width={80}
        />
        <h1 className="text-lg font-semibold text-foreground">
          Create an account
        </h1>
        <p className="text-body font-normal">Sign up in less than 5 mins</p>
      </div>
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;
