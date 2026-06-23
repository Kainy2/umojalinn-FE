"use client";
import ProjectReviewView from "@/section/dashboard/project/Review";
import ProjectDisputes from "@/section/dashboard/project/disputes";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

const ActiveProjectDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetProjectById(params?.id);

  if (data?.data?.data?.status && data?.data?.data?.status !==  "LIVE") return null

  return (
    <div className="flex flex-col gap-8">
      <ProjectReviewView project={data?.data?.data} />
      <ProjectDisputes
        projectId={params.id}
        currency={data?.data?.data?.currency}
      />
    </div>
  );
};

export default ActiveProjectDetailsPage;
