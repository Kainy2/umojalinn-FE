"use client";
import CustomCard from "@/components/custom/card";
import CustomCardHolder from "@/components/custom/card/Holder";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetAllBuyerProject } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

const AdsProjectCardList = () => {
  const params = useParams<{ id: string }>();
  const { data, isPending } = useGetAllBuyerProject({
    projectStatus: "ADS",
  });

  return (
    <CustomCardHolder type="PROJECT" loading={isPending}>
      {data?.data?.data?.map((project) => (
        <CustomCard
          key={project?.id}
          preTitle={
            uuidToBase62Safe(params?.id) === uuidToBase62Safe(project?.id)
          }
          img={
            project?.Gallery?.find((gallery) => gallery.isCoverImage)?.imageUrl
          }
          title={project.title || "No title"}
          type="PROJECT"
          href={
            uuidToBase62Safe(params?.id) === uuidToBase62Safe(project?.id)
              ? "/projects/ads"
              : `/projects/ads/${uuidToBase62Safe(project?.id)}`
          }
        />
      ))}
    </CustomCardHolder>
  );
};

export default AdsProjectCardList;
