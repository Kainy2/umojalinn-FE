import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  ALL_SIZING_TEMPLATES,
  FEMALE_SIZING_TEMPLATE,
  MALE_SIZING_TEMPLATE,
} from "@/constant/sizingTemplate";
import { DialogProps } from "@radix-ui/react-dialog";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojaLinnSizingTemplate,
} from "@/types/project";
import { parseStringToNumber } from "@/lib/utils";
import {
  useCreateSizingTemplate,
  useGetSizingTemplateById,
  useRequestChangeSizingTemplate,
  useUpdateSizingTemplate,
} from "@/tanstack/hooks/useSizingTemplates";
import { getSizingTemplateUpdateProps } from "@/lib/project";
import { useGetMe } from "@/tanstack/hooks/useUser";
import { useSession } from "next-auth/react";

type TemplateModalType = "EDIT" | "RECOMMEND" | "VIEW-ONLY"

 export type SizingTemplateDialogProps = DialogProps & {
  id?: string;
  handleSuccess?: (template?: UmojaLinnSizingTemplate) => void;
  // type?: "CREATE" | "DRAFT-EDIT" | "DESIGNER-VIEW" | "BUYER-VIEW";
};


export const useSizingTemplateDialog = (
  props: SizingTemplateDialogProps
) => {

 const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<
    | keyof (UmojaLinnFemaleSizingTemplateProps &
        UmojaLinnMaleSizingTemplateProps)
    | null
  >(null);
  const [value, setValue] = useState<
    Partial<
      UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
    >
  >({});
  const [gender, setGender] =
    useState<UmojaLinnSizingTemplate["gender"]>("MALE");
  const [unit, setUnit] = useState<UmojaLinnSizingTemplate["unit"]>("CM");
  const [name, setName] = useState<string>("");
  const [recommendationMode, setRecommendationMode] = useState(false);
  const [openRequestChangesDialog, setOpenRequestChangesDialog] =
    useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { isPending: loadingMe } = useGetMe();
  const { data: session } = useSession();
  const { data: sizingTemplateData, isPending: isLoadingSizingTemplate } =
    useGetSizingTemplateById(props?.id);
    const {
      mutate: requestChangeOnSizingTemplate,
      isPending: isRequestingChangeOnSizingTemplate,
    } = useRequestChangeSizingTemplate(props?.id, {
      onSuccess() {
        setReviewsEdit({});
        setRecommendationMode(false);
      },
    });
		
		const sizingTemplateResult = sizingTemplateData?.data.data
		const isDesigner = session?.user?.profileRole === "DESIGNER";
		const TEMPLATE = gender === "FEMALE" ? FEMALE_SIZING_TEMPLATE : MALE_SIZING_TEMPLATE;
		const noOfInputs = TEMPLATE?.length;
  // const type =
	// 	props.type || session?.user.profileRole === "BUYER"
	// 		? sizingTemplateResult?.status !== "IN_USE"
	// 			? "DRAFT-EDIT"
	// 			: "BUYER-VIEW"
	// 		: "DESIGNER-VIEW";

	const modalType: TemplateModalType = useMemo(() => {
		if (isDesigner) {
			return "RECOMMEND";
		} else {
			if (!props?.id) return "EDIT"
			if (sizingTemplateResult?.status !== "IN_USE") return "VIEW-ONLY";
			return "EDIT";
		}
	},[ isDesigner, props?.id, sizingTemplateResult?.status]);


  // Function to handle the Enter key press
  const handleKeyPress = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      // Move focus to the next input, if any
      const nextIndex = index + 1;
      if (nextIndex < noOfInputs) {
        inputRefs.current[nextIndex]?.focus();
      }
    }
  };

  const [reviewsEdit, setReviewsEdit] = useState<
    Partial<
      Record<
        keyof (UmojaLinnFemaleSizingTemplateProps &
          UmojaLinnMaleSizingTemplateProps),
        string
      >
    >
  >({});

  const handleChangeValuesByUnit = (
    prevUnit: UmojaLinnSizingTemplate["unit"],
    finalUnit: UmojaLinnSizingTemplate["unit"],
  ) => {
    if (prevUnit !== finalUnit) {
      const conversionFactor = prevUnit === "CM" ? 0.393701 : 2.54;
      setValue((prev) =>
        Object.keys(prev).reduce((acc, key) => {
          const typedKey = key as keyof Partial<
            UmojaLinnFemaleSizingTemplateProps &
              UmojaLinnMaleSizingTemplateProps
          >;
          const currentValue = prev[typedKey] || 0;
          const convertedValue = currentValue * conversionFactor;
          // Convert each value
          acc[typedKey] = Number.isInteger(convertedValue)
            ? convertedValue
            : parseFloat(convertedValue.toFixed(2));
          return acc;
        }, {} as Partial<UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps>),
      );
    }
  };

  const handleReviewsEditChange = useCallback(
    (
        props:
          | keyof (UmojaLinnFemaleSizingTemplateProps &
              UmojaLinnMaleSizingTemplateProps)
          | null,
      ) =>
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props)
          setReviewsEdit((prev) => ({ ...prev, [props]: e?.target?.value }));
      },
    [],
  );

  const [hasLiveProject, isDraft] = useMemo(() => {
    return [
      !!sizingTemplateResult?.projects?.some(
        (project) => project?.status === "LIVE",
      ),
      sizingTemplateResult?.status === "DRAFT",
    ];
  }, [sizingTemplateResult]);

  const highlightedSizingName = useMemo(
    () =>
      (highlighted &&
        ALL_SIZING_TEMPLATES?.find?.((value) => highlighted === value?.prop)
          ?.name) ||
      "",
    [highlighted],
  );

  useEffect(() => {
    if (sizingTemplateResult) {
      const {
        gender,
        name,
        unit,
        id,
        createdAt,
        buyerId,
        buyer,
        updatedAt,
        status,
        projects,
        ...templateDetails
      } = sizingTemplateResult;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = {
        id,
        createdAt,
        buyerId,
        buyer,
        updatedAt,
        status,
        projects,
      };
      setValue(templateDetails);
      setName(name);
      setGender(gender);
      setUnit(unit);
    }
  }, [sizingTemplateResult]);

  const handleSuccess = (template: UmojaLinnSizingTemplate) => {
    setOpen(false);
    props.onOpenChange?.(false);
    props?.handleSuccess?.(template);
  };

  const { mutate: createSizingTemplate, isPending: isCreatingSizingTemplate } =
    useCreateSizingTemplate({
      onSuccess(data) {
        handleSuccess(data?.data?.data);
      },
    });

  const { mutate: updateSizingTemplate, isPending: isUpdatingSizingTemplate } =
    useUpdateSizingTemplate(props?.id, {
      onSuccess(data) {
        handleSuccess(data?.data?.data);
      },
    });



  const handleChange =
    (
      prop: keyof Partial<
        UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
      >,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setValue((prev) => ({
        ...prev,
        [prop]: parseStringToNumber(e.target.value)?.value || 0,
      }));
    };

  const handleSubmit = (shouldGoLive?: true) => {
    const sizingTemplateProps: Partial<
      UmojaLinnSizingTemplate & {
        shouldGoLive?: true;
      }
    > = {
      ...getSizingTemplateUpdateProps(gender, value),
      gender,
      name,
      unit,
      shouldGoLive,
    };

    (props?.id ? updateSizingTemplate : createSizingTemplate)(
      sizingTemplateProps,
    );
  };

  const loading = props?.id
    ? isUpdatingSizingTemplate || isRequestingChangeOnSizingTemplate
    : isCreatingSizingTemplate;



  return{
		loading,
    isDesigner,
    highlightedSizingName,
    handleReviewsEditChange,
    handleChange,
    handleSubmit,
    sizingTemplateResult,
    reviewsEdit,
    isDraft,
    hasLiveProject,
    TEMPLATE,
    open,
    setOpen,
    name,
    gender,
    unit,
    value,
    highlighted,
    setHighlighted,
    setGender,
    setName,
    setUnit,
    handleChangeValuesByUnit,
    recommendationMode,
    openRequestChangesDialog,
    setOpenRequestChangesDialog,
    setRecommendationMode,
    loadingMe,
    isLoadingSizingTemplate,
    requestChangeOnSizingTemplate,
    handleKeyPress,
    previewImage,
    setPreviewImage,
    inputRefs,
		modalType
	}
};
