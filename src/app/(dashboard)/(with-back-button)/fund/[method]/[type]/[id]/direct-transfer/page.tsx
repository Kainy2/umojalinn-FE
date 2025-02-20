"use client";
import CopyLabelValue from "@/components/custom/CopyLabelValue";
import FilePreview from "@/components/custom/FilePreview";
import FileUploadPicker from "@/components/custom/picker/FileUpload";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyValue } from "@/lib/number";
import { getCurrencySymbol } from "@/lib/string";
import { jsonToFormData } from "@/lib/utils";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useFundMilestone,
  useFundProject,
  useGetMilestoneById,
  useGetProjectById,
} from "@/tanstack/hooks/useProject";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const DirectTransferPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [progress, setProgress] = useState<undefined | number>(undefined);
  const [transactionRecieptFile, setTransactionRecieptFile] =
    useState<File | null>(null);

  const params = useParams<{
    method: "other";
    type: "project" | "milestone";
    id: string;
  }>();
  const isProject = params.type === "project";

  const { data: projectData, isPending: loadingProjectData } =
    useGetProjectById(params?.id, {
      enabled: isProject,
    });

  const { data: milestoneData, isPending: loadingMilestoneData } =
    useGetMilestoneById(params?.id, {
      enabled: !isProject,
    });

  const { data: milestoneProjectData, isPending: loadingMilestoneProjectData } =
    useGetProjectById(milestoneData?.data?.data?.projectId || "", {
      enabled: !isProject,
    });

  const currency = isProject
    ? projectData?.data?.data?.currency
    : milestoneProjectData?.data?.data?.currency;

  const value = isProject
    ? projectData?.data?.data?.approvedBudget
    : milestoneData?.data?.data?.amount;

  const loading = isProject
    ? loadingProjectData
    : loadingMilestoneData || loadingMilestoneProjectData;

  const {
    mutate: fundProject,
    isPending: isFundingProject,
    isError: isErrorFundingProject,
  } = useFundProject(
    params?.id,
    (e) => {
      setProgress(e?.progress);
    },
    {
      onSuccess() {
        router.push(
          `/projects/${uuidToBase62Safe(
            (isProject ? params?.id : milestoneData?.data?.data?.projectId) ||
              ""
          )}`
        );
      },
    }
  );
  const {
    mutate: fundMilestone,
    isPending: isFundingMilestone,
    isError: isErrorFundingMilestone,
  } = useFundMilestone(
    params?.id,
    (e) => {
      setProgress(e?.progress);
    },
    {
      onSuccess() {
        router.push(`/projects`);
      },
    }
  );

  const handleClick = () => {
    const body = jsonToFormData({
      receipt: transactionRecieptFile,
      paymentChannel: "DIRECT_TRANSFER",
    });
    if (params?.type === "project") {
      fundProject(body);
    } else {
      fundMilestone(body);
    }
  };

  return (
    <div className="container max-w-screen-sm card p-6 shadow-md rounded-md text-foreground-body">
      <h1 className="text-foreground text-lg font-bold mb-1">
        Direct Transfer
      </h1>
      <p className="flex gap-1 items-center">
        Transfer{" "}
        <strong className="text-foreground">
          {loading ? (
            <Skeleton className="h-6 w-24 shrink-0 inline-flex " />
          ) : (
            `${getCurrencySymbol(currency)} ${formatCurrencyValue(value) || 0}`
          )}
        </strong>{" "}
        to this account
      </p>
      <Separator className="border-t-1 my-8" />
      <p className="text-center mb-4">
        Account number expires in{" "}
        <strong className="text-foreground">30 mins</strong>
      </p>
      <div className="flex gap-6 flex-col text-foreground-label">
        <CopyLabelValue label="Account Holder" value="Umoja Linn" />
        <CopyLabelValue
          label="Bank Transfer"
          value="9-16nJaimaca Ave, Woodhaven, NY 1142, USA"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currency === "EURO" ? (
            <>
              {/* <CopyLabelValue label="Account Number" value="8067373838" /> */}
              {/* <CopyLabelValue label="ACH Routing" value="8067373838" /> */}
              <CopyLabelValue label="Account Type" value="Checking" />
              <CopyLabelValue label="Bank Name" value="Umoja Linn" />
              <CopyLabelValue label="BIC" value="BOFIIE2DXXX" />
              <CopyLabelValue label="IBAN" value="IE80BOFI90374483139373 " />
              {/* <CopyLabelValue label="Bank Swift Code" value="8067373838" /> */}
            </>
          ) : (
            <>
              <CopyLabelValue label="Bank Name" value="Fidelity" />
              <CopyLabelValue
                label="Account Name"
                value="Chinaecherem Raphaela Soribe"
              />
              <CopyLabelValue label="Account Number" value="6052950808" />
            </>
          )}
        </div>
        {transactionRecieptFile ? (
          <FilePreview
            file={transactionRecieptFile}
            onDelete={
              isErrorFundingMilestone || isErrorFundingProject
                ? () => setTransactionRecieptFile(null)
                : undefined
            }
            progress={
              isErrorFundingMilestone || isErrorFundingProject
                ? undefined
                : progress
            }
          />
        ) : (
          <FileUploadPicker
            onSelect={(file) => {
              setTransactionRecieptFile(file as File);
            }}
            rounded
            cta="Upload"
            accept=".pdf, .jpg, .jpeg, .png"
            details={
              <>
                or drag and drop payment reciept <br /> PDF, JPG or PDF
              </>
            }
          />
        )}
        <p className="text-center">
          Note: Kindly transfer exact amount to the account details above and
          upload your payment reciept
        </p>
        <Button
          fullWidth
          onClick={handleClick}
          disabled={
            !transactionRecieptFile ||
            (params.type === "project" && isFundingProject) ||
            (params.type === "milestone" && isFundingMilestone)
          }
        >
          I&apos;ve sent the money
        </Button>
        <Button fullWidth variant="outline" asChild>
          <Link href={pathname.split("/direct-transfer").join("")}>
            Change payment method
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DirectTransferPage;
