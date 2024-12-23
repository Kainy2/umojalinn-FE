"use server";
import { createPrivateProject } from "@/actions/project";
import { handleAPIError } from "@/lib/axios";
import { PageProps } from "@/types/util";
import { redirect } from "next/navigation";

const CreateProjectPage = async (
  props: PageProps<unknown, { inviterTag?: string }>
) => {
  try {
    const tag = await props.searchParams;
    const res = await createPrivateProject(
      { tag: tag?.inviterTag },
      { isServerAction: true }
    );
    redirect(`/project/${res?.data?.data?.id}`);
  } catch (error) {
    handleAPIError(error);
    redirect("/unauthorized");
  }
};

export default CreateProjectPage;
