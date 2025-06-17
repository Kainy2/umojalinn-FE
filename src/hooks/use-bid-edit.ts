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
} from "@/tanstack/hooks/useBid";
import { UmojaLinnDeliveryMethod } from "@/types/project";


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

  // const { data: meData } = useGetMe();

  const { data, isPending } = useGetDesignerBidById(id);
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
        }))
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
  }, [bid]);

  const { mutate: createMilestone } = useCreateMilestone(id, {
    onSuccess: () => {
      setEditing(null);
    },
  });

  const { mutate: updateMilestone } = useUpdateMilestone({
    onSuccess: () => {
      setEditing(null);
    },
  });

  const { mutate: deleteMilestone } = useDeleteMilestone({
    onSuccess: () => {
      setMilestones((milestones) =>
        milestones?.length === 1 ? [] : milestones
      );
      setEditing(null);
    },
  });

  const { mutate: updateBid } = useUpdateBid(id, {
    onSuccess() {
      toast({
        title: "Bid saved in Drafts",
        description: "Your bid has been saved successfully.",
      });
      router.push(`/jobs/${uuidToBase62Safe(project?.id || "")}`);
    },
  });

  // Called after last update
  const { mutate: submitBid } = useSubmitBid(id, {
    onSuccess() {
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

  const handleSave =
    (index: number) =>
    (props: { title: string; description: string; price: number }) => {
      const id = milestones[index]?.id;
      const { price: amount, ...otherProps } = props;
      const variables = {
        ...otherProps,
        amount,
      };
      if (id) {
        updateMilestone(variables);
      } else {
        createMilestone(variables);
      }
    };

  const [addNote, setAddNote] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const [excess, setExcess] = useState<number>(0);
  const [showExcessDialog, setShowExcessDialog] = useState<boolean>(false);

  const [mode, setMode] = useState<"UPDATE" | "LIVE" | null>(null);

  const handleUpdateAction = (mode: "UPDATE" | "LIVE" | null) => {
    switch (mode) {
      case "UPDATE":
        updateBid({
          additionalNote: addNote ? note : undefined,
          deliveryAmount: deliveryMilestonePrice,
          deliveryMethod: deliveryMethod || undefined,
        });
        break;
      case "LIVE":
        updateToSubmit({
          additionalNote: addNote ? note : undefined,
          deliveryAmount: deliveryMilestonePrice,
          deliveryMethod: deliveryMethod || undefined,
        });
        break;
      default:
        break;
    }
  };

  const handleUpdate = (mode: "UPDATE" | "LIVE" | null) => {
    const isCompleteForm = milestones.every((milestone) => (
      milestone?.title &&
      milestone?.description
    ))
    
    if (!isCompleteForm) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "you have unsaved edits to your milestone. Please review and save or cancel before submitting.",
      })
      return
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

    if (
      typeof bid?.project?.budget === "number" &&
      bid?.project?.budget &&
      totalPrice > bid?.project?.budget
    ) {
      setExcess(totalPrice - bid?.project?.budget);
      setShowExcessDialog(true);
      setMode(mode);
    } else {
      handleUpdateAction(mode);
    }
  };

	const handleCancel = (index:number) => {
		handleToggle(index)();
		setMilestones((prev) => {
			const currentMilestone = prev[index];
			if (currentMilestone?.id) {
				// if milestone has been saved on db already, get old milestone before edit and replace
				const oldMilestone = bid?.milestones?.find(
					(milestone) => milestone?.id === currentMilestone.id
				);
				return prev.map((milestone, i) =>
					i === index
						? {
								...currentMilestone,
								title: oldMilestone?.title ?? "",
								description: oldMilestone?.description ?? "",
								price: oldMilestone?.amount ?? 0,
						  }
						: milestone
				);
			}
			return prev.filter((_, i) => i !== index);
		});
	}

  const handleToggle = (index: number) => () =>
    setEditing((prev) => (prev === index ? null : index));

  const handleAdd = () => {
    setMilestones((prev) => {
      setEditing(prev.length);
      return [...prev, MILESTONE_TEMPLATE];
    });
  };

  const totalPrice = useMemo(
    () =>
      milestones?.reduce((prev, curr) => prev + (curr?.price || 0), 0) +
      deliveryMilestonePrice,
    [deliveryMilestonePrice, milestones]
  );

  const editMode = ["DRAFT", "REJECTED"].includes(bid?.status || "");


	return{
		bid,
		project,
		handleCancel,
		handleUpdateAction,
		handleAdd,
		handleToggle,
		handleSave,
		handleUpdate,
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
		deleteMilestone
	}
}