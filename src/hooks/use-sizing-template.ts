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
import { TEMPLATE_MODE, TemplateMode } from "@/types/constants";
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
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProjectById } from "@/tanstack/hooks/useProject";

type TemplateModalType = "EDIT" | "RECOMMEND" | "VIEW-ONLY"

 export type SizingTemplateDialogProps = DialogProps & {
  id?: string;
  handleSuccess?: (template?: UmojaLinnSizingTemplate) => void;
  disableSaving?: boolean;
  // type?: "CREATE" | "DRAFT-EDIT" | "DESIGNER-VIEW" | "BUYER-VIEW";
};


export const useSizingTemplateDialog = (
  props: SizingTemplateDialogProps & {
    bidId?: string;
    projectId?: string;
  }
) => {

 const [previewImage, setPreviewImage] = useState<string | null>(null);
 const [editMode, setEditMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<
    | keyof (UmojaLinnFemaleSizingTemplateProps &
        UmojaLinnMaleSizingTemplateProps)
    | null
  >('height');
  const [value, setValue] = useState<
    Partial<
      UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
    >
  >({});
  const [gender, setGender] =
    useState<UmojaLinnSizingTemplate["gender"]>("MALE");
  const [unit, setUnit] = useState<UmojaLinnSizingTemplate["unit"]>("INCH");
  const [name, setName] = useState<string>("");
  const [recommendationMode, setRecommendationMode] = useState(false);
  const [openRequestChangesDialog, setOpenRequestChangesDialog] =
    useState(false);
  const [reviewsEdit, setReviewsEdit] = useState<
    Partial<
      Record<
        keyof (UmojaLinnFemaleSizingTemplateProps &
          UmojaLinnMaleSizingTemplateProps),
        string
      >
    >
  >({});

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
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlProjectId = searchParams.get("projectId");
    const sizingTemplateId = props.id;
		const sizingTemplateResult = sizingTemplateData?.data.data
    const effectiveProjectId = props.projectId || urlProjectId || sizingTemplateResult?.projects?.[0]?.id || undefined;
  
    // Fetch project data if we have a project ID
    const { data: projectData } = useGetProjectById(effectiveProjectId);
    const project = projectData?.data?.data;
		
		const isDesigner = session?.user?.profileRole === "DESIGNER";
		const TEMPLATE = gender === "FEMALE" ? FEMALE_SIZING_TEMPLATE : MALE_SIZING_TEMPLATE;
		const noOfInputs = TEMPLATE?.length;
  // const type =
	// 	props.type || session?.user.profileRole === "BUYER"
	// 		? sizingTemplateResult?.status !== "IN_USE"
	// 			? "DRAFT-EDIT"
	// 			: "BUYER-VIEW"
	// 		: "DESIGNER-VIEW";


  const [isTemplateHaveLiveProject, isDraft] = useMemo(() => {
    return [
      !!sizingTemplateResult?.projects?.some(
        (project) => project?.status === "LIVE",
      ),
      sizingTemplateResult?.status === "LIVE",
    ];
  }, [sizingTemplateResult]);

  // Derived state for measurement points
  const requestedMeasurementPoints = sizingTemplateResult?.requestedMeasurementPoints || [];
  const submittedMeasurementPoints = sizingTemplateResult?.submittedMeasurementPoints || [];
  const hasRequestedPoints = requestedMeasurementPoints.length > 0;
  const hasSubmittedPoints = submittedMeasurementPoints.length > 0;
  const hasReviews = sizingTemplateResult?.metadata?.reviews && 
    Object.values(sizingTemplateResult.metadata.reviews).some(Boolean);
  const isInUse = sizingTemplateResult?.status === "IN_USE";

  // New templateMode with proper priority logic
  const templateMode: TemplateMode = useMemo(() => {

    // Designer modes (priority order)
    if (isDesigner) {
      // SELECT: Designer requesting measurement points on bid without template yet
      // This takes highest priority for designers when accessing via bidId with no template
      if (props?.bidId && !props?.id) {
        return TEMPLATE_MODE.SELECT;
      }

      // SELECT: Designer needs to select measurement points (when template exists)
      if (isInUse && !hasRequestedPoints) {
        return TEMPLATE_MODE.SELECT;
      }
      // RECOMMEND: Designer wants to add recommendations (toggle via recommendationMode state)
      if (hasRequestedPoints && recommendationMode) {
        return TEMPLATE_MODE.RECOMMEND;
      }
      // VIEW: Designer views the template (read-only)
      return TEMPLATE_MODE.VIEW;
    }

    // Buyer modes (priority order)
    // No template ID = creating new template
    if (!props?.id) {
      return TEMPLATE_MODE.EDIT;
    }

    // UPDATE: Buyer has recommendations to address (highest priority for in-use templates)
    if (isInUse && hasReviews) {
      return TEMPLATE_MODE.UPDATE;
    }

    // FILL: Buyer needs to fill requested measurement points
    if (isInUse && hasRequestedPoints && !hasSubmittedPoints) {
      return TEMPLATE_MODE.FILL;
    }

    // VIEW_ONLY: Template is in use, all submitted, no pending reviews
    if (isInUse && hasSubmittedPoints && !hasReviews) {
      return TEMPLATE_MODE.VIEW_ONLY;
    }

    // EDIT: Default for draft/live templates not in use
    return TEMPLATE_MODE.EDIT;
  }, [
    isDesigner,
    isInUse,
    hasRequestedPoints,
    hasSubmittedPoints,
    hasReviews,
    recommendationMode,
    props?.id,
    props?.bidId,
  ]);

  // Legacy modalType for backward compatibility
	const modalType: TemplateModalType = useMemo(() => {
		if (isDesigner) {
			return "RECOMMEND";
		} else {
			if (!props?.id) return "EDIT"
			if (sizingTemplateResult?.status === "IN_USE" && isTemplateHaveLiveProject) return "VIEW-ONLY";
			return "EDIT";
		}
	},[isDesigner, props?.id, sizingTemplateResult?.status, isTemplateHaveLiveProject]);

  const highlightedSizingName = useMemo(
    () =>
      (highlighted &&
        ALL_SIZING_TEMPLATES?.find?.((value) => highlighted === value?.prop)
          ?.name) ||
      "",
    [highlighted],
  );

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


  const handleChangeValuesByUnit = (
    prevUnit: UmojaLinnSizingTemplate["unit"],
    finalUnit: UmojaLinnSizingTemplate["unit"],
  ) => {
    if (prevUnit !== finalUnit) {
      const conversionFactor = prevUnit === "CM" ? 0.393701 : 2.54;
      setValue((prev) => {
        const newValue: Partial<UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps> = {};
        Object.keys(prev).forEach((key) => {
          const typedKey = key as keyof Partial<
            UmojaLinnFemaleSizingTemplateProps &
              UmojaLinnMaleSizingTemplateProps
          >;
          const currentValue = prev[typedKey];
          // Skip non-numeric values (e.g., ukStandardSize is a string)
          if (typeof currentValue !== "number") {
            // @ts-expect-error - ukStandardSize is string but other values are numbers
            newValue[typedKey] = currentValue;
            return;
          }
          const convertedValue = currentValue * conversionFactor;
          // @ts-expect-error - Type inference limitation with dynamic keys
          newValue[typedKey] = Number.isInteger(convertedValue)
            ? convertedValue
            : parseFloat(convertedValue.toFixed(2));
        });
        return newValue;
      });
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


  useEffect(() => {
    if (sizingTemplateResult ) {
      const {
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
      if (unit) setUnit(unit);
    }
    
    
    if (project){
      // const defaultTemplate = project.gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE
      
      setGender(project.gender ?? sizingTemplateResult?.gender ?? "MALE");
      // setPreviewImage(defaultTemplate[0].img)
    }
  }, [sizingTemplateResult, project]);
  
  useEffect(()=>{
    if (!gender) return;

    const defaultTemplate = gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE
    setPreviewImage(defaultTemplate[0].img)
  }, [gender])

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
      e.preventDefault?.();
      setValue((prev) => ({
        ...prev,
        [prop]: prop === "ukStandardSize" ? e.target.value : parseStringToNumber(e.target.value)?.value || 0,
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
      ukStandardSize: value.ukStandardSize
    };

    (props?.id ? updateSizingTemplate : createSizingTemplate)(
      sizingTemplateProps,
    );
  };

  const loading = props?.id
    ? isUpdatingSizingTemplate || isRequestingChangeOnSizingTemplate
    : isCreatingSizingTemplate;


  const isNewTemplate =
  !isDesigner && templateMode === 'EDIT' && !sizingTemplateId && !effectiveProjectId

  console.log({templateMode})


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
    isNewTemplate,
    isTemplateHaveLiveProject,
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
		modalType,
    editMode, 
    setEditMode,
    // New mode-related exports
    templateMode,
    requestedMeasurementPoints,
    submittedMeasurementPoints,
    hasRequestedPoints,
    hasSubmittedPoints,
    hasReviews,
    isInUse,

    router,
    searchParams,
    urlProjectId,
    sizingTemplateId,
    effectiveProjectId,
    projectData,
    project,
	}
};
