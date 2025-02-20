import React from "react";
import ProjectDescriptionForm from "@/section/form/project/edit/Description";
import { PageProps } from "@/types/util";

const ProjectDescriptionPage = async (props: PageProps<{ id: string }>) => {
  const params = await props.params;

  return <ProjectDescriptionForm id={params?.id} isOnboarding />;
};

export default ProjectDescriptionPage;
