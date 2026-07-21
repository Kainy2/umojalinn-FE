"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { uuidToBase62Safe } from "@/lib/uuid";
import {
  useCreateMilestone,
  useDeleteMilestone,
  useGetDesignerBidById,
  useSubmitBid,
  useUpdateBid,
  useUpdateMilestone,
  useGetProjectAccountConnectionStatus,
} from "@/tanstack/hooks/useBid";
import { UmojaLinnDeliveryMethod } from "@/types/project";
import { EDeliveryMileStoneType } from "@/types/enum";
import { SingleApiResponse } from "@/types/util";
import { UmojaLinnSubmitBidResponse } from "@/types/project";
import { AxiosResponse } from "axios";

const MILESTONE_TEMPLATE = {
  title: "",
  description: "",
  price: 0,
};

export const useBidEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [milestones, setMilestones] = useState<
    {
      id?: string;
      title: string;
      description: string;
      price: number;
    }[]
  >([MILESTONE_TEMPLATE]);
  const [editing, setEditing] = useState<number | null>(0);
  const [deliveryMilestonePrice, setDeliveryMilestonePrice] = useState(0);
  const [deliveryMethod, setDeliveryMethod] =
    useState<UmojaLinnDeliveryMethod | null>(null);
  const [selectedDeliveryMethodType, setSelectedDeliveryMethodType] =
    useState<EDeliveryMileStoneType>(EDeliveryMileStoneType.FIXED);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [paymentStatus, setPaymentStatus] =
    useState<UmojaLinnSubmitBidResponse>({
      paymentAccountConnected: false,
      paymentAccountOnboarded: false,
    });

  // const { data: meData } = useGetMe();

  const { data, isLoading: isPending } = useGetDesignerBidById(id);
  const bid = data?.data?.data;
  const project = bid?.project;

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (bid?.milestones?.length) {
      setMilestones(
        bid.milestones.map((milestone) => ({
          title: milestone?.title || "",
          description: milestone?.description || "",
          price: milestone?.amount || 0,
          id: milestone?.id,
        })),
      );
      setEditing(null);
    }
    if (bid?.deliveryMilestone?.deliveryMethod) {
      setDeliveryMethod(bid?.deliveryMilestone?.deliveryMethod);
    }
    if (bid?.deliveryMilestone?.amount) {
      setDeliveryMilestonePrice(bid?.deliveryMilestone?.amount);
    }
    if (bid?.additionalNotesToClient) {
      setNote(bid?.additionalNotesToClient);
      setAddNote(true);
    }
    if (bid?.deliveryMilestone.deliveryMileStoneType) {
      setSelectedDeliveryMethodType(
        bid.deliveryMilestone.deliveryMileStoneType,
      );
    }
  }, [bid]);

  const {
    mutateAsync: createMilestoneAsync,
    isPending: isPendingCreateBid,
  } = useCreateMilestone(id, {
    onSuccess: () => {
      setEditing(null);
    },
  });

  const {
    mutateAsync: updateMilestoneAsync,
    isPending: isPendingUpdateBid,
  } = useUpdateMilestone({
    onSuccess: () => {
      setEditing(null);
    },
  });

  const { mutate: deleteMilestone, isPending: isPendingDelete } =
    useDeleteMilestone({
      onSuccess: () => {
        setMilestones((milestones) =>
          milestones?.length === 1 ? [] : milestones,
        );
        setEditing(null);
      },
    });

  const { mutate: updateBid, isPending: isUpdatingBid } = useUpdateBid(id, {
    onSuccess() {
      toast({
        title: "Bid saved in Drafts",
        description: "Your bid has been saved successfully.",
      });
      router.push(`/jobs/${uuidToBase62Safe(project?.id || "")}`);
    },
  });

  // Called after last update
  const { mutate: submitBid, isPending: isSubmittingBid } = useSubmitBid(id, {
    onSuccess(
      data: AxiosResponse<SingleApiResponse<UmojaLinnSubmitBidResponse>>,
    ) {
      console.log(data);
      toast({
        title: "Bid Live",
        description: "Your bid has been published successfully.",
      });
      router.push("/dashboard");
    },
  });

  // Update before sending live
  const { mutate: updateToSubmit } = useUpdateBid(id, {
    onSuccess() {
      submitBid();
    },
  });

  const { mutate: getAccountStatus, isPending: isCheckingAccountStatus } =
    useGetProjectAccountConnectionStatus({
      onSuccess: (data) => {
        const { paymentAccountConnected, paymentAccountOnboarded } =
          data.data.data || {};
        if (
          paymentAccountConnected === false ||
          paymentAccountOnboarded === false
        ) {
          setPaymentStatus({
            paymentAccountConnected,
            paymentAccountOnboarded,
          });
          setShowStripeModal(true);
        } else {
          updateToSubmit({
            additionalNote: addNote ? note : undefined,
            deliveryAmount: Number(deliveryMilestonePrice),
            deliveryMethod: deliveryMethod || undefined,
            deliveryMileStoneType: selectedDeliveryMethodType,
          });
        }
      },
    });

  const [addNote, setAddNote] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const [excess, setExcess] = useState<number>(0);
  const [showExcessDialog, setShowExcessDialog] = useState<boolean>(false);

  const [mode, setMode] = useState<"UPDATE" | "LIVE" | null>(null);

  const totalPrice = useMemo(
    () =>
      milestones?.reduce(
        (prev, curr) => Number(prev) + (Number(curr?.price) || 0),
        0,
      ) + Number(deliveryMilestonePrice),
    [deliveryMilestonePrice, milestones],
  );

  const projectBudget = Number(bid?.project?.budget);
  const isOverBudget =
    Number.isFinite(projectBudget) &&
    projectBudget > 0 &&
    totalPrice > projectBudget;

  const getSubmitPayload = () => ({
    additionalNote: addNote ? note : undefined,
    deliveryAmount: Number(deliveryMilestonePrice),
    deliveryMethod: deliveryMethod || undefined,
    deliveryMileStoneType: selectedDeliveryMethodType,
  });

  const openExcessDialog = (nextMode: "UPDATE" | "LIVE" | null) => {
    setExcess(totalPrice - projectBudget);
    setShowExcessDialog(true);
    setMode(nextMode);
  };

  const handleFinalSubmit = () => {
    updateToSubmit(getSubmitPayload());
    setShowStripeModal(false);
  };

  const handleSave =
    (index: number) =>
    async (props: {
      id?: string;
      title: string;
      description: string;
      price: number;
    }) => {
      const milestoneId = milestones[index]?.id ?? props.id;
      const variables = {
        title: props.title,
        description: props.description,
        amount: props.price,
        ...(milestoneId ? { id: milestoneId } : {}),
      };
      if (milestoneId) {
        await updateMilestoneAsync(variables);
      } else {
        await createMilestoneAsync(variables);
      }
      setMilestones((prev) =>
        prev.map((milestone, i) =>
          i === index
            ? {
                ...milestone,
                title: props.title,
                description: props.description,
                price: props.price,
                ...(milestoneId ? { id: milestoneId } : {}),
              }
            : milestone,
        ),
      );
    };

  const handleUpdateAction = (mode: "UPDATE" | "LIVE" | null) => {
    switch (mode) {
      case "UPDATE":
        updateBid(getSubmitPayload());
        break;
      case "LIVE":
        getAccountStatus(project?.id || "");
        break;
      default:
        break;
    }
  };

  const handleExcessConfirm = () => {
    setShowExcessDialog(false);
    handleUpdateAction(mode);
  };

  const handleUpdate = (mode: "UPDATE" | "LIVE" | null) => {
    const isCompleteForm = milestones.every(
      (milestone) => milestone?.title && milestone?.description,
    );

    if (!isCompleteForm) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description:
          "you have unsaved edits to your milestone. Please review and save or cancel before submitting.",
      });
      return;
    }

    // if (mode === "LIVE") {
    // 	const canSubmit = isCompleteForm && deliveryMilestonePrice && deliveryMethod && milestones.length > 0
    // 	if (!canSubmit) {
    // 		toast({
    // 			variant: "destructive",
    // 			title: "Submission Error",
    // 			description: "At least One Milestone + Delivery Method must be filled before submitting",
    // 		})
    // 		return
    // 	}
    // }

    if (isOverBudget) {
      openExcessDialog(mode);
    } else {
      handleUpdateAction(mode);
    }
  };

  const handleCancel = (index: number) => {
    handleToggle(index)();
    setMilestones((prev) => {
      const currentMilestone = prev[index];
      if (currentMilestone?.id) {
        // if milestone has been saved on db already, get old milestone before edit and replace
        const oldMilestone = bid?.milestones?.find(
          (milestone) => milestone?.id === currentMilestone.id,
        );
        return prev.map((milestone, i) =>
          i === index
            ? {
                ...currentMilestone,
                title: oldMilestone?.title ?? "",
                description: oldMilestone?.description ?? "",
                price: oldMilestone?.amount ?? 0,
              }
            : milestone,
        );
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleToggle = (index: number) => () =>
    setEditing((prev) => (prev === index ? null : index));

  const handleAdd = () => {
    setMilestones((prev) => {
      setEditing(prev.length);
      return [...prev, MILESTONE_TEMPLATE];
    });
  };

  const editMode = ["DRAFT", "REJECTED"].includes(bid?.status || "");

  return {
    bid,
    project,
    handleCancel,
    handleUpdateAction,
    handleAdd,
    handleToggle,
    handleSave,
    handleUpdate,
    handleExcessConfirm,
    milestones,
    totalPrice,
    addNote,
    setAddNote,
    note,
    setNote,
    excess,
    showExcessDialog,
    setShowExcessDialog,
    deliveryMethod,
    setDeliveryMethod,
    deliveryMilestonePrice,
    setDeliveryMilestonePrice,
    mode,
    editMode,
    editing,
    isPending,
    deleteMilestone,
    isUpdatingBid,
    isSubmittingBid,
    isPendingDelete,
    isPendingUpdateBid,
    isPendingCreateBid,
    selectedDeliveryMethodType,
    setSelectedDeliveryMethodType,
    showStripeModal,
    setShowStripeModal,
    paymentStatus,
    isCheckingAccountStatus,
    handleFinalSubmit,
  };
};
