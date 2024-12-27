"use server";
import { verifyEmail } from "@/actions/auth";
import VerifyErrorResendForm from "@/section/form/VerifyErrorResend";
import { PageProps } from "@/types/util";
import { redirect } from "next/navigation";
import React from "react";

const ConfirmEmailPage = async (
  props: PageProps<{ token: string }, { email?: string; inviterTag?: string }>
) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  try {
    await verifyEmail(params?.token);
    return redirect(
      `/verify-email/success${
        searchParams?.inviterTag
          ? `?inviterTag=${searchParams?.inviterTag}`
          : ""
      }`
    );
  } catch (error) {
    console.error(error);
    const email = searchParams?.email;
    return <VerifyErrorResendForm email={email && decodeURIComponent(email)} />;
  }
};

export default ConfirmEmailPage;
