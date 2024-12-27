"use server";
import { createProject } from "@/actions/project";
import { handleAPIError } from "@/lib/axios";
import { PageProps } from "@/types/util";
import { redirect } from "next/navigation";

const CreateProjectPage = async (
  props: PageProps<unknown, { inviterTag?: string }>
) => {
  let url = "/unauthorized";
  try {
    const tag = await props.searchParams;
    const res = await createProject(
      {
        tag: tag?.inviterTag,
        projectType: tag?.inviterTag ? "PRIVATE" : "PUBLIC",
      },
      { isServerAction: true }
    );
    url = `/project/${res?.data?.data?.id}`;
    console.log(res, "RESULT >>> CREATE PROJECT", url);
  } catch (error) {
    handleAPIError(error);
  } finally {
    redirect(url);
  }
};

export default CreateProjectPage;
