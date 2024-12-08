import Image from "next/image";
import React from "react";
import LoginForm from "@/section/form/Login";

const LoginPage = () => {
  return (
    <div className="container max-w-screen-sm py-20">
      <div className="text-center mb-4 flex flex-col items-center">
        <Image
          className="mb-2"
          src="/img/png/umoja.png"
          alt="Umoja logo"
          height={80}
          width={80}
        />
        <h1 className="text-lg font-semibold text-foreground">Welcome Back</h1>
        <p className="font-normal">We&apos;re happy to have you back</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
