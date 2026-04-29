"use client";
import { use } from "react";
import SizingTemplatePage from "@/components/sizing-template/SizingTemplatePage";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SizingTemplateViewPage = (props: PageProps) => {
  const params = use(props.params);
  const searchParams = use(props.searchParams);

  return (
    <SizingTemplatePage
      id={params.id}
      disableSaving={searchParams.disableSaving === "true"}
    />
  );
};

export default SizingTemplateViewPage;
