"use client";
import CustomCardHolder from "@/components/custom/card/Holder";
import JobCard from "@/components/custom/card/Job";
import { getCoverImage } from "@/lib/project";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetDesigerBids } from "@/tanstack/hooks/useBid";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";

const PrivateJobPage = () => {
  const { data: myBidsWithDraft, isPending: isLoadingMyBidsWithDraft } =
    useGetDesigerBids({
      bidStatus: ["PENDING", "REJECTED", "DRAFT"],
    });

  const { data: draftBidData, isPending: isLoadingDraftBidData } =
    useGetDesigerBids({
      bidStatus: "DRAFT",
    });

  const { data: myBidsData, isPending: isLoadingMyBidsData } =
    useGetDesigerBids({
      bidStatus: ["PENDING", "REJECTED"],
    });

  const { data: liveProjectsData, isPending: isLoadingLiveProjectsData } =
    useGetAllDesignerProject({
      projectStatus: "LIVE",
      projectType: "PRIVATE",
    });

  const {
    data: completedProjectsData,
    isPending: isLoadingCompletedProjectsData,
  } = useGetAllDesignerProject({
    projectStatus: "COMPLETED",
    projectType: "PRIVATE",
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 justify-stretch mt-4">
      <CustomCardHolder
        count={myBidsWithDraft?.data?.data?.length || 0}
        title="My Bids"
        loading={
          isLoadingMyBidsWithDraft ||
          isLoadingDraftBidData ||
          isLoadingMyBidsData
        }
        empty={!myBidsWithDraft?.data?.data?.length}
      >
        {myBidsData?.data?.data?.map((bid) => (
          <JobCard
            key={bid.id}
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
            key={bid.id}
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
            key={job.id}
            isPrivate={job.projectType === "PRIVATE"}
            name={job?.title || "No title"}
            href={`/jobs/${uuidToBase62Safe(job?.id)}`}
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
            href={`/jobs/${uuidToBase62Safe(job?.id)}`}
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
            href={`/jobs/${uuidToBase62Safe(job?.id)}`}
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
export default PrivateJobPage;
