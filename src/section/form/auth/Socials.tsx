"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SOCIAL_ICON_SIZE = 20;

type SocialsFormProps = {
  mode?: "login" | "register";
  inviterTag?: string;
};

const socialButtonTemplate = [
  {
    platform: "Google",
    icon: "/img/svg/google.svg",
    id: "google",
  },
  // {
  //   platform: "Facebook",
  //   icon: "/img/svg/fb.svg",
  // },
  // {
  //   platform: "Apple",
  //   icon: "/img/svg/apple.svg",
  // },
];

const SocialsForm = (props: SocialsFormProps) => {
  const { mode = "login", inviterTag } = props;
  const isLogin = mode === "login";
  return (
    <>
      <div className="flex gap-2 items-center my-2">
        <hr className="flex-1" />
        <span className="text-sm">OR</span>
        <hr className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        {socialButtonTemplate.map((btn) => (
          <Button
            key={btn.platform}
            variant="outline"
            fullWidth
            type="button"
            onClick={() => {
              if (btn?.id) {
                signIn(btn?.id);
              }
            }}
          >
            <Image
              src={btn.icon}
              alt=""
              height={SOCIAL_ICON_SIZE}
              width={SOCIAL_ICON_SIZE}
            />{" "}
            {isLogin ? "Sign in" : "Sign up"} with {btn.platform}
          </Button>
        ))}
        <p className="text-sm text-center mt-4">
          {isLogin ? "Are you new here?" : "Already have an account?"}{" "}
          <Link
            className="text-primary font-bold"
            href={`/${isLogin ? "register" : "login"}${
              inviterTag ? `?inviterTag=${inviterTag}` : ""
            }`}
          >
            {isLogin ? "Register" : "Login"}
          </Link>
        </p>
      </div>
    </>
  );
};

export default SocialsForm;
