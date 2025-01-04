"use client";
import CustomCardHolder from "@/components/custom/card/Holder";
import JobCard from "@/components/custom/card/Job";
import { getCoverImage } from "@/lib/project";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";

const DashboardPage = () => {
  const { data: draftProjectsData, isPending: isLoadingDraftProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "DRAFT",
    });
  const { data: liveProjectsData, isPending: isLoadingLiveProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "LIVE",
    });
  const { data: adsProjectsData, isPending: isLoadingAdsProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "ADS",
    });
  const {
    data: completedProjectsData,
    isPending: isLoadingCompletedProjectsData,
  } = useGetAllDesignerProject({
    projectStatus: "COMPLETED",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 justify-stretch mt-4">
      <CustomCardHolder
        count={
          (adsProjectsData?.data?.data?.length || 0) +
          (draftProjectsData?.data?.data?.length || 0)
        }
        title="My Bids"
        loading={isLoadingAdsProjectsData || isLoadingDraftProjectsData}
        empty
      >
        {adsProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(job)}
            dueDate={new Date(new Date().setDate(15))}
          />
        ))}
        <div className="flex gap-2 items-center my-2">
          <hr className="flex-1" />
          <span className="text-sm">Bids in draft</span>
          <hr className="flex-1" />
        </div>
        {draftProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(job)}
            dueDate={new Date(new Date().setDate(15))}
          />
        ))}
      </CustomCardHolder>
      <CustomCardHolder
        colour="primary"
        count={liveProjectsData?.data?.data?.length}
        title="My Active Jobs"
        loading={isLoadingLiveProjectsData}
        empty={!liveProjectsData?.data?.data?.length}
      >
        {liveProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            href={`/jobs/${job?.id}`}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(job)}
            dueDate={job.dueDate}
          />
        ))}
      </CustomCardHolder>
      <CustomCardHolder
        colour="success"
        count={completedProjectsData?.data?.data?.length}
        title="My Past Jobs"
        loading={isLoadingCompletedProjectsData}
        empty
      >
        {completedProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(job)}
            dueDate={new Date(new Date().setDate(15))}
          />
        ))}
      </CustomCardHolder>
      <CustomCardHolder
        colour="info"
        count={completedProjectsData?.data?.data?.length}
        title="Completed Jobs"
        loading={isLoadingCompletedProjectsData}
        empty
      >
        {completedProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(job)}
            dueDate={new Date(new Date().setDate(15))}
          />
        ))}
      </CustomCardHolder>
    </div>
  );
};
export default DashboardPage;
