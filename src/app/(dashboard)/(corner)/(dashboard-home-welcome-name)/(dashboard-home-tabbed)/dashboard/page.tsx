"use client";
import CustomCardHolder, {
  CustomCardHolderProps,
} from "@/components/custom/card/Holder";
import JobCard from "@/components/custom/card/Job";
import { getCoverImage } from "@/lib/project";
import { uuidToBase62Safe } from "@/lib/uuid";
import { useGetDesignerBids } from "@/tanstack/hooks/useBid";
import { useGetAllDesignerProject } from "@/tanstack/hooks/useProject";
import { useCallback, useMemo, useState } from "react";

const options = [
  "MY_BIDS",
  "MY_ACTIVE_JOBS",
  "MY_COMPLETED_JOBS",
  "CLOSED_BIDS",
] as const;

type OptionsType = (typeof options)[number];

const DashboardPage = () => {
  const [mobileSelection, setMobileSelection] =
    useState<OptionsType>("MY_BIDS");

  const { data: myBids, isPending: isLoadingMyBids } = useGetDesignerBids({
    bidStatus: ["PENDING", "REJECTED", "DRAFT"],
    projectStatus: ["ADS","LIVE"],
  });

  const { data: draftBidData, isPending: isLoadingDraftBidData } =
    useGetDesignerBids({
      bidStatus: "DRAFT",
      projectStatus: "ADS",
    });

  const {
    data: myBidsDataWithoutDraft,
    isPending: isLoadingMyBidsWithoutDraftData,
  } = useGetDesignerBids({
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
    projectStatus: ["COMPLETED"],
  });

  const { data: closedBids, isPending: isLoadingClosedBidsData } =
    useGetDesignerBids({
      projectStatus: ["COMPLETED"],
      bidStatus: ["REJECTED", "PENDING"],
    });

  const myBidsContent = useMemo(
    () => (
      <>
        {myBidsDataWithoutDraft?.data?.data?.map((bid) => (
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
      </>
    ),
    [draftBidData?.data?.data, myBidsDataWithoutDraft?.data?.data]
  );

  const myActiveJobsContent = useMemo(
    () => (
      <>
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
      </>
    ),
    [liveProjectsData?.data?.data]
  );

  const myCompleteJobsContent = useMemo(
    () => (
      <>
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
      </>
    ),
    [completedProjectsData?.data?.data]
  );

  const closedBidsContent = useMemo(
    () => (
      <>
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
      </>
    ),
    [closedBids?.data?.data]
  );

  const mobileSelectedContent = useMemo(() => {
    switch (mobileSelection) {
      case "CLOSED_BIDS":
        return closedBidsContent;
      case "MY_ACTIVE_JOBS":
        return myActiveJobsContent;
      case "MY_COMPLETED_JOBS":
        return myCompleteJobsContent;
      case "MY_BIDS":
      default:
        return myBidsContent;
    }
  }, [
    closedBidsContent,
    mobileSelection,
    myActiveJobsContent,
    myBidsContent,
    myCompleteJobsContent,
  ]);

  const holderProps = useCallback(
    (mobileSelection: OptionsType): CustomCardHolderProps => {
      switch (mobileSelection) {
        case "MY_ACTIVE_JOBS":
          return {
            colour: "primary",
            count: liveProjectsData?.data?.data?.length || 0,
            title: "My Active Jobs",
            loading: isLoadingLiveProjectsData,
            empty: !liveProjectsData?.data?.data?.length,
          };
        case "MY_COMPLETED_JOBS":
          return {
            colour: "success",
            count: completedProjectsData?.data?.data?.length,
            title: "My Completed Jobs",
            loading: isLoadingCompletedProjectsData,
            empty: !completedProjectsData?.data?.data?.length,
          };
        case "CLOSED_BIDS":
          return {
            colour: "info",
            title: "Closed Bids",
            loading: isLoadingClosedBidsData,
            count: 0,
            empty: true,
            // count: closedBids?.data?.data?.length,
            // empty: !closedBids?.data?.data?.length,
          };
        case "MY_BIDS":
        default:
          return {
            title: "My Bids",
            count: myBids?.data?.data?.length || 0,
            loading:
              isLoadingMyBids ||
              isLoadingDraftBidData ||
              isLoadingMyBidsWithoutDraftData,
            empty: !myBids?.data?.data?.length,
          };
      }
    },
    [
      completedProjectsData?.data?.data?.length,
      isLoadingClosedBidsData,
      isLoadingCompletedProjectsData,
      isLoadingDraftBidData,
      isLoadingLiveProjectsData,
      isLoadingMyBids,
      isLoadingMyBidsWithoutDraftData,
      liveProjectsData?.data?.data?.length,
      myBids?.data?.data?.length,
    ]
  );

  return (
    <>
      <div className="block md:hidden">
        <CustomCardHolder
          {...holderProps(mobileSelection)}
          options={options as unknown as string[]}
          onSelect={(tab) => setMobileSelection(tab as OptionsType)}
        >
          {mobileSelectedContent}
        </CustomCardHolder>
      </div>
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 justify-stretch mt-4">
        <CustomCardHolder {...holderProps("MY_BIDS")}>
          {myBidsContent}
        </CustomCardHolder>
        <CustomCardHolder {...holderProps("MY_ACTIVE_JOBS")}>
          {myActiveJobsContent}
        </CustomCardHolder>
        <CustomCardHolder {...holderProps("MY_COMPLETED_JOBS")}>
          {myCompleteJobsContent}
        </CustomCardHolder>
        <CustomCardHolder {...holderProps("CLOSED_BIDS")}>
          {closedBidsContent}
        </CustomCardHolder>
      </div>
    </>
  );
};
export default DashboardPage;
