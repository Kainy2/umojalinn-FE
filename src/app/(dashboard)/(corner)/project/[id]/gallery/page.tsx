"use sever";
import ProjectGalleryForm from "@/section/form/project/edit/Gallery";
import { PageProps } from "@/types/util";
import React from "react";

const GalleryPage = async (props: PageProps<{ id: string }>) => {
  const params = await props.params;

  return <ProjectGalleryForm id={params?.id} />;
};

export default GalleryPage;
