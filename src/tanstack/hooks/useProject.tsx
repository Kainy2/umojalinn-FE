import {
  addProjectReview,
  approveOrRejectMilestone,
  // createWithdrawalMethod,
  deleteProjectById,
  deleteWithdrawalMethod,
  // editWithdrawalMethod,
  fundMilestone,
  fundProject,
  getAllBuyerProjects,
  getAllDesignerProjects,
  getClothingTypes,
  getMilestoneById,
  getMilestoneSubmissions,
  getProjectById,
  getProjectMediaAndLinks,
  getProjectMilestones,
  getSpecialistTypes,
  getAllTransactions,
  getWallet,
  getWithdrawalMethods,
  inviteBuyer,
  postProjectLive,
  requestWithdrawal,
  submitMilestone,
  updateProjectById,
  // setDefaultWithdrawalMethod,
  getFundsReleasedTransactions,
  getListNgnBanks,
  getPaymentAccountInfo,
  verifyNgnAccount,
  addNgnBankAccount,
  connectStripeAccount
} from "@/actions/project";
import { queryClient } from "@/components/provider/TanstackQueryClient";
import useHandleError from "@/hooks/useHandleError";
import {
  NewUmojaLinnProjectReview,
  UmojaLinnMediaLink,
  UmojaLinnMilestone,
  UmojaLinnMilestoneSubmission,
  UmojaLinnProject,
  UmojaLinnSpecialistType,
  UmojalinnWallet,
  UmojaLinnWithdrawalMethod,
  UmojaLinnPayment,
  UmojaLinnNgnBank,
  UmojaLinnPaymentAccountInfo,
  UmojaLinnBankVerified,
  UmojaLinnConnectStripeAccount
} from "@/types/project";
import {
  GenericUseMutationProps,
  GenericUseQueryProps,
} from "@/types/tanstack";
import { ArrayApiResponse, SingleApiResponse } from "@/types/util";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  BUYER,
  CLOTHING_TYPES,
  DESIGNER,
  FUNDS_RELEASED,
  MEDIA_AND_LINK,
  MILESTONE,
  PROJECT,
  SUBMISSION,
  TRANSACTION,
  WALLET,
  WITHDRAWAL_METHODS,
  PAYMENT_ACCOUNT_INFO
} from "../keys";
import {
  // CreateWithdrawalMethodPayload,
  // DirectTransferPayload,
  // PaypalPayload,
  RequestWithdrawalPayload,
  // SetDefaultWithdrawalMethodPayload,
  VerifyNgnAccountPayload,
  AddNgnBankAccounyPaylod
} from "@/section/form/withdraw/WithdrawalAmount";
import { getUserReviews, UserReviewsApiProps } from "@/actions/user";


export const useInviteBuyer = (
  options: GenericUseMutationProps<SingleApiResponse, { emails: string[] }>
) => {
  const { handleError } = useHandleError("Invitation");
  return useMutation({
    ...options,
    mutationFn: inviteBuyer,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["USER", "ME"] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetProjectById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnProject>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, id],
    queryFn: () => getProjectById(id || ""),
  });
};

export const useUpdateProjectById = (
  id?: string,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>
) => {
  const { handleError } = useHandleError("Update Project");
  return useMutation({
    ...options,
    mutationFn: (variable) => updateProjectById(id || "", variable),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const usePostProjectLive = (
  options?: GenericUseMutationProps<SingleApiResponse, string>
) => {
  const { handleError } = useHandleError("Update Project");
  return useMutation({
    ...options,
    mutationFn: postProjectLive,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetClothingTypes = (
  options?: GenericUseQueryProps<
    SingleApiResponse<UmojaLinnProject["clothingTypes"]>
  >
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, CLOTHING_TYPES],
    queryFn: () => getClothingTypes(),
  });
};

export const useGetAllBuyerProject = (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    projectStatus:
    | UmojaLinnProject["status"]
    | Array<UmojaLinnProject["status"]>;
    projectType:
    | UmojaLinnProject["projectType"]
    | Array<UmojaLinnProject["projectType"]>;
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProject>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled:
      !!(me?.user?.profileRole === "BUYER") && options?.enabled !== false,
    queryKey: [PROJECT, BUYER, { apiParams }],
    queryFn: () => getAllBuyerProjects(apiParams),
  });
};

export const useGetAllDesignerProject = (
  apiParams?: Partial<{
    lastId: string;
    limit: number;
    projectStatus:
    | UmojaLinnProject["status"]
    | Array<UmojaLinnProject["status"]>;
    projectType:
    | UmojaLinnProject["projectType"]
    | Array<UmojaLinnProject["projectType"]>;
    hasBid?: boolean;
  }>,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnProject>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled:
      !!(me?.user?.profileRole === "DESIGNER") && options?.enabled !== false,
    queryKey: [PROJECT, DESIGNER, { apiParams }],
    queryFn: () => getAllDesignerProjects(apiParams),
  });
};

export const useGetProjectMilestones = (
  projectId: string,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnMilestone>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!projectId && !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, MILESTONE, { projectId }],
    queryFn: () => getProjectMilestones(projectId),
  });
};

export const useFundProject = (
  id: string,
  options?: GenericUseMutationProps<SingleApiResponse<UmojaLinnPayment>>
) => {
  const { handleError } = useHandleError("Fund Project");
  return useMutation({
    ...options,
    mutationFn: () => fundProject(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useFundMilestone = (
  id: string,
  options?: GenericUseMutationProps<SingleApiResponse<UmojaLinnPayment>>
) => {
  const { handleError } = useHandleError("Fund Milestone");
  return useMutation({
    mutationFn: () => fundMilestone(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);

    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useGetMilestoneById = (
  id?: string,
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnMilestone>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, MILESTONE, id],
    queryFn: () => getMilestoneById(id || ""),
  });
};

export const useGetMilestoneSubmissions = (
  id?: string,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnMilestoneSubmission>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, MILESTONE, SUBMISSION, id],
    queryFn: () => getMilestoneSubmissions(id || ""),
  });
};

export const useGetProjectMediaAndlinks = (
  id?: string,
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnMediaLink>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && !!id && options?.enabled !== false,
    queryKey: [PROJECT, MEDIA_AND_LINK, id],
    queryFn: () => getProjectMediaAndLinks(id || ""),
  });
};

export const useApproveOrRejectMilestone = (
  id: string,
  options?: GenericUseMutationProps<
    SingleApiResponse,
    Pick<UmojaLinnMilestoneSubmission, "status" | "rejectionReason">
  >
) => {
  const { handleError } = useHandleError("Submit Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => approveOrRejectMilestone(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useSubmitMilestone = (
  id: string,
  options?: GenericUseMutationProps<SingleApiResponse, FormData>
) => {
  const { handleError } = useHandleError("Submit Milestone");
  return useMutation({
    ...options,
    mutationFn: (variables) => submitMilestone(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [PROJECT] });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetWallet = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojalinnWallet>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, WALLET],
    queryFn: () => getWallet(),
  });
};

export const useGetTransactions = (
  params?: Record<string, unknown>,
) => {
  const { data: me } = useSession();
  return useQuery({
    enabled: !!me?.user,
    queryKey: [TRANSACTION, params],
    queryFn: () => getAllTransactions(params),
  });
};

export const useGetInfiniteTransactions = (
  params?: Record<string, unknown>,
  // options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnTransaction>>
) => {
  const { data: me } = useSession();
  const lastId = params?.lastId;

  return useInfiniteQuery({
    initialPageParam: lastId,
    enabled: !!me?.user,
    queryKey: [TRANSACTION, params],
    queryFn: ({ pageParam: lastId }) => getAllTransactions({ lastId, ...params }),
    getNextPageParam: (lastPage) => lastPage?.data.lastId,
  });
};
export const useGetInfiniteFundReleasedTransactions = (
  params?: { lastId?: string; limit?: string },
  // options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnTransaction>>
) => {
  const { data: me } = useSession();
  const lastId = params?.lastId;

  return useInfiniteQuery({
    initialPageParam: lastId,
    enabled: !!me?.user,
    queryKey: [FUNDS_RELEASED, params],
    queryFn: ({ pageParam: lastId }) => getFundsReleasedTransactions({ lastId, ...params }),
    getNextPageParam: (lastPage) => lastPage?.data.lastId,
  });
};

export const useGetWithdrawalMethods = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnWithdrawalMethod>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
    queryFn: () => getWithdrawalMethods(),
  });
};
export const useGetListNgnBanks = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnNgnBank>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
    queryFn: () => getListNgnBanks(),
  });
};
export const useGetPaymentAccountInfo = (
  options?: GenericUseQueryProps<SingleApiResponse<UmojaLinnPaymentAccountInfo>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: [PROJECT, WALLET, PAYMENT_ACCOUNT_INFO],
    queryFn: () => getPaymentAccountInfo(),
  });
};

// export const useCreateWithdrawalMethod = (
//   options?: GenericUseMutationProps<
//     SingleApiResponse<UmojaLinnWithdrawalMethod>,
//     CreateWithdrawalMethodPayload
//   >
// ) => {
//   const { handleError } = useHandleError("Create Withdrawal Method");
//   return useMutation({
//     ...options,
//     mutationFn: (variables) => createWithdrawalMethod(variables),
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({
//         queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
//       });
//       options?.onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       handleError(error);
//       options?.onError?.(error, variables, context);
//     },
//   });
// };

// export const useSetDefaultWithdrawalMethod = (
//   options?: GenericUseMutationProps<
//     SingleApiResponse<UmojaLinnWithdrawalMethod>,
//     SetDefaultWithdrawalMethodPayload
//   >
// ) => {
//   const { handleError } = useHandleError("Create Withdrawal Method");
//   return useMutation({
//     ...options,
//     mutationFn: (variables) => setDefaultWithdrawalMethod(variables),
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({
//         queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
//       });
//       options?.onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       handleError(error);
//       options?.onError?.(error, variables, context);
//     },
//   });
// };
export const useVerifyNgnAccount = (
  options?: GenericUseMutationProps<SingleApiResponse<UmojaLinnBankVerified>, VerifyNgnAccountPayload>
) => {
  const { handleError } = useHandleError("Verify Ngn Account");
  return useMutation({
    ...options,
    mutationFn: (variables) => verifyNgnAccount(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
}
export const useAddNgnAccount = (
  options?: GenericUseMutationProps<SingleApiResponse, AddNgnBankAccounyPaylod>
) => {
  const { handleError } = useHandleError("Add Ngn Account");
  return useMutation({
    ...options,
    mutationFn: (variables) => addNgnBankAccount(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
}

// export const useEditWithdrawalMethod = (
//   id: string,
//   options?: GenericUseMutationProps<
//     SingleApiResponse<UmojaLinnWithdrawalMethod>,
//     PaypalPayload | DirectTransferPayload
//   >
// ) => {
//   const { handleError } = useHandleError("Edit Withdrawal Method");
//   return useMutation({
//     ...options,
//     mutationFn: (variables) => editWithdrawalMethod(id, variables),
//     onSuccess: (data, variables, context) => {
//       queryClient.invalidateQueries({
//         queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
//       });
//       options?.onSuccess?.(data, variables, context);
//     },
//     onError: (error, variables, context) => {
//       handleError(error);
//       options?.onError?.(error, variables, context);
//     },
//   });
// };
export const useConnectStripeAccount = (
  options?: GenericUseMutationProps<SingleApiResponse<UmojaLinnConnectStripeAccount>>
) => {
  const { handleError } = useHandleError("Connect Stripe Account");
  return useMutation({
    ...options,
    mutationFn: () => connectStripeAccount(),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
}
export const useDeleteWithdrawalMethod = (
  id: string,
  options?: GenericUseMutationProps<SingleApiResponse>
) => {
  const { handleError } = useHandleError("Delete Withdrawal Method");
  return useMutation({
    ...options,
    mutationFn: () => deleteWithdrawalMethod(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useRequestWithdrawal = (
  options?: GenericUseMutationProps<SingleApiResponse, RequestWithdrawalPayload>
) => {
  const { handleError } = useHandleError("Request Withdrawal");
  return useMutation({
    ...options,
    mutationFn: (variables) => requestWithdrawal(variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, WALLET, WITHDRAWAL_METHODS],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useDeleteProject = (
  options?: GenericUseMutationProps<SingleApiResponse, string>
) => {
  const { handleError } = useHandleError("Delete Project");
  return useMutation({
    ...options,
    mutationFn: (id) => deleteProjectById(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT, BUYER, { apiParams: { projectStatus: "DRAFT", } }]
      });
      queryClient.invalidateQueries({
        queryKey: [PROJECT, BUYER, {
          apiParams: { projectStatus: "ADS" }
        }],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useAddProjectReview = (
  id: string = "",
  options?: GenericUseMutationProps<
    SingleApiResponse<UmojaLinnProject>,
    FormData
  >
) => {
  const { handleError } = useHandleError("Add Review");
  return useMutation({
    ...options,
    mutationFn: (variables) => addProjectReview(id, variables),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [PROJECT],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      handleError(error);
      options?.onError?.(error, variables, context);
    },
  });
};

export const useGetUserReviews = (
  apiParams: UserReviewsApiProps,
  options?: GenericUseQueryProps<ArrayApiResponse<NewUmojaLinnProjectReview>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: me?.user && apiParams && options?.enabled !== false,
    queryKey: [PROJECT, "REVIEWS", { apiParams }],
    queryFn: () => getUserReviews(apiParams),
  });
};

export const useGetSpecialistTypes = (
  options?: GenericUseQueryProps<ArrayApiResponse<UmojaLinnSpecialistType>>
) => {
  const { data: me } = useSession();
  return useQuery({
    ...options,
    enabled: !!me?.user && options?.enabled !== false,
    queryKey: ["SPECIALIST_TYPES"],
    queryFn: () => getSpecialistTypes(),
  });
};
