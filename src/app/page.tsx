"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth();
  let url;

  switch (session?.user?.profileRole) {
    case "BUYER":
      url = "/projects";
      break;
    case "DESIGNER":
      url = "/dashboard";
      break;
    default:
      url = "/login";
      break;
  }

  redirect(url);
};

export default HomePage;
