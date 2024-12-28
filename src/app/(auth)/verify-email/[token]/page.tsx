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
  const email = searchParams?.email;
  let url;
  try {
    await verifyEmail(params?.token);
    url = `/verify-email/success${
      searchParams?.inviterTag ? `?inviterTag=${searchParams?.inviterTag}` : ""
    }`;
  } catch (error) {
    console.error(error);
  }

  url && redirect(url);
  return <VerifyErrorResendForm email={email && decodeURIComponent(email)} />;
};

export default ConfirmEmailPage;
