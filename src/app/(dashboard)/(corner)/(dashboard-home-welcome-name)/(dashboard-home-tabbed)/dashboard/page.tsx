"use client";
import CustomCardHolder from "@/components/custom/card/Holder";
import JobCard from "@/components/custom/card/Job";
import { getCoverImage } from "@/lib/project";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetDesigerBids } from "@/tanstack/hooks/useBid";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";

const DashboardPage = () => {
  const { data: myBidsWithoutDraft, isPending: isLoadingMyBidsWithoutDraft } =
    useGetDesigerBids({
      bidStatus: ["PENDING", "REJECTED"],
      projectStatus: "ADS",
    });

  const { data: draftBidData, isPending: isLoadingDraftBidData } =
    useGetDesigerBids({
      bidStatus: "DRAFT",
      projectStatus: "ADS",
    });

  const { data: myBidsData, isPending: isLoadingMyBidsData } =
    useGetDesigerBids({
      bidStatus: ["PENDING", "REJECTED"],
      projectStatus: "ADS",
    });

  const { data: liveProjectsData, isPending: isLoadingLiveProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "LIVE",
    });

  const {
    data: completedProjectsData,
    isPending: isLoadingCompletedProjectsData,
  } = useGetAllDesignerProject({
    projectStatus: ["COMPLETED"]
  });

  const {
    data: closedBids,
    isPending: isLoadingClosedBidsData,
  } = useGetDesigerBids({
    projectStatus: ["COMPLETED"],
    bidStatus: ["REJECTED", "PENDING"]
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 justify-stretch mt-4">
      <CustomCardHolder
        count={(myBidsWithoutDraft?.data?.data?.length || 0) + (draftBidData?.data?.data?.length || 0)}
        title="My Bids"
        loading={
          isLoadingMyBidsWithoutDraft ||
          isLoadingDraftBidData ||
          isLoadingMyBidsData
        }
        empty={!((myBidsWithoutDraft?.data?.data?.length || 0) + (draftBidData?.data?.data?.length || 0))}
      >
        {myBidsData?.data?.data?.map((bid) => (
          <JobCard
            key={bid?.id}
            isPrivate={bid.project?.projectType === "PRIVATE"}
            name={bid?.project?.title || "No title"}
            href={`/bids/${uuidToBase62Safe(bid?.id)}/edit`}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(bid.project)}
            dueDate={bid?.project?.dueDate}
          />
        ))}
        {!!draftBidData?.data?.data?.length && (
          <div className="flex gap-2 items-center my-2 [&>hr]:bg-yellow text-gray-400">
            <hr className="flex-1" />
            <span className="text-xs">Bids in draft</span>
            <hr className="flex-1" />
          </div>
        )}
        {draftBidData?.data?.data?.map((bid) => (
          <JobCard
            key={bid?.id}
            isPrivate={bid.project?.projectType === "PRIVATE"}
            name={bid?.project?.title || "No title"}
            href={`/bids/${uuidToBase62Safe(bid?.id)}/edit`}
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
        count={liveProjectsData?.data?.data?.length || 0}
        title="My Active Jobs"
        loading={isLoadingLiveProjectsData}
        empty={!liveProjectsData?.data?.data?.length}
      >
        {liveProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job?.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            href={`/active-jobs/${uuidToBase62Safe(job?.id)}`}
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
        title="My Completed Jobs"
        loading={isLoadingCompletedProjectsData}
        empty={!completedProjectsData?.data?.data?.length}
      >
        {completedProjectsData?.data?.data?.map((job) => (
          <JobCard
            key={job?.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            href={`/completed-jobs/${uuidToBase62Safe(job?.id)}`}
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
        count={closedBids?.data?.data?.length}
        title="Closed Bids"
        loading={isLoadingClosedBidsData}
        empty={!closedBids?.data?.data?.length}
      >
        {closedBids?.data?.data?.map((bid) => (
          <JobCard
            key={bid?.id}
            isPrivate={bid?.project?.projectType === "PRIVATE"}
            name={bid?.project?.title || "No title"}
            href={`/bids/${uuidToBase62Safe(bid?.id)}`}
            progress={{
              value: 0,
              total: 1,
            }}
            img={getCoverImage(bid.project)}
            dueDate={bid.project?.dueDate}
          />
        ))}
      </CustomCardHolder>
    </div>
  );
};
export default DashboardPage;
