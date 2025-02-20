"use server";
import { createProject, getAllBuyerProjects } from "@/actions/project";
import { handleAPIError } from "@/lib/axios";
import { uuidToBase62Safe } from "@/lib/uuid";
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

    if (tag?.inviterTag) {
      const projectRes = await getAllBuyerProjects(undefined, {
        isServerAction: true,
      });
      url = `${
        projectRes?.data?.data?.length === 1 ? "/onboard" : ""
      }/project/${uuidToBase62Safe(res?.data?.data?.id)}`;
    } else {
      url = `/project/${uuidToBase62Safe(res?.data?.data?.id)}`;
    }
  } catch (error) {
    handleAPIError(error);
  } finally {
    redirect(url);
  }
};

export default CreateProjectPage;
