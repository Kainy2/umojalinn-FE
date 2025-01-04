"use client";
import CustomCardHolder from "@/components/custom/card/Holder";
import JobCard from "@/components/custom/card/Job";
import { getCoverImage } from "@/lib/project";
import { useGetDesigerBids } from "@/tanstack/hooks/useBid";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";

const DashboardPage = () => {
  const { data: draftBidData, isPending: isLoadingDraftBids } =
    useGetDesigerBids({
      bidStatus: "DRAFT",
    });
  const { data: bidsData, isPending: isLoadingBids } = useGetDesigerBids();

  const { data: draftProjectsData, isPending: isLoadingDraftProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "DRAFT",
    });
  const { data: liveProjectsData, isPending: isLoadingLiveProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "LIVE",
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
          bidsData?.data?.data?.filter(
            (bid) => !["ACCEPTED"].includes(bid.status)
          ).length || 0
        }
        title="My Bids"
        loading={isLoadingDraftBids || isLoadingBids}
        empty={
          !bidsData?.data?.data?.filter(
            (bid) => !["ACCEPTED"].includes(bid.status)
          ).length
        }
      >
        {bidsData?.data?.data
          ?.filter((bid) => !["DRAFT", "ACCEPTED"].includes(bid.status))
          .map((bid) => (
            <JobCard
              key={bid.id}
              isPrivate={bid.project?.projectType === "PRIVATE"}
              name={bid?.project?.title || "No title"}
              href={`/bids/${bid?.id}/edit`}
              progress={{
                value: 0,
                total: 1,
              }}
              img={getCoverImage(bid.project)}
              dueDate={bid?.project?.dueDate}
            />
          ))}
        <div className="flex gap-2 items-center my-2 [&>hr]:bg-yellow text-gray-400">
          <hr className="flex-1" />
          <span className="text-xs">Bids in draft</span>
          <hr className="flex-1" />
        </div>
        {draftBidData?.data?.data?.map((bid) => (
          <JobCard
            key={bid.id}
            isPrivate={bid.project?.projectType === "PRIVATE"}
            name={bid?.project?.title || "No title"}
            href={`/bids/${bid?.id}/edit`}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(bid.project)}
            dueDate={bid?.project?.dueDate}
          />
        ))}
      </CustomCardHolder>
      <CustomCardHolder
        colour="primary"
        count={
          (liveProjectsData?.data?.data?.length || 0) +
          (draftProjectsData?.data?.data?.length || 0)
        }
        title="My Active Jobs"
        loading={isLoadingLiveProjectsData || isLoadingDraftProjectsData}
        empty={
          !liveProjectsData?.data?.data?.length &&
          !draftProjectsData?.data?.data?.length
        }
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

        <div className="flex gap-2 items-center my-2 [&>hr]:bg-yellow text-gray-400">
          <hr className="flex-1" />
          <span className="text-xs">Jobs in draft</span>
          <hr className="flex-1" />
        </div>
        {draftProjectsData?.data?.data?.map((job) => (
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
        empty={!completedProjectsData?.data?.data?.length}
      >
        {completedProjectsData?.data?.data?.map((job) => (
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
        colour="info"
        count={completedProjectsData?.data?.data?.length}
        title="Completed Jobs"
        loading={isLoadingCompletedProjectsData}
        empty={!completedProjectsData?.data?.data?.length}
      >
        {completedProjectsData?.data?.data?.map((job) => (
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
    </div>
  );
};
export default DashboardPage;
