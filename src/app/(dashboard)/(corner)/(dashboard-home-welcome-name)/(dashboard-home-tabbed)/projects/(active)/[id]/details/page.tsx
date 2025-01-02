"use client";
import ProjectReviewView from "@/section/dashboard/project/Review";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import { useParams } from "next/navigation";
import React from "react";

const ActiveProjectDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetProjectById(params.id);
  return (
    <div className="flex flex-col gap-8">
      <ProjectReviewView project={data?.data?.data} />
    </div>
  );
};

export default ActiveProjectDetailsPage;
