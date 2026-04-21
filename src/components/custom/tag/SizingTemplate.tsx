import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import React, { useState } from "react";
import AvatarIconTag from "./AvatarIcon";
import { FilePlus, Plus, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import MenuButton from "../MenuButton";
import {
  useAddSizingTemplateToProject,
  useCreateSizingTemplate,
  useGetAllSizingTemplates,
} from "@/tanstack/hooks/useSizingTemplates";
import { useGetMe } from "@/tanstack/hooks/useUser";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import CheckCircle from "@/icons/CheckCircle";
import { HeightAndSizeModal } from "@/components/sizing-template";
import {
  UmojaLinnSizingTemplate,
  UmojalinnStandardSize,
} from "@/types/project";

type SizingTemplateTagProps = {
  projectId: string;
};

const SizingTemplateTag = (props: SizingTemplateTagProps) => {
  const { data: projectData, isPending: loadingProject } = useGetProjectById(
    props.projectId,
  );
  const { data: sizingTemplateData, isPending: loadingSizingTemplate } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: "LIVE",
    });
  const { data: me } = useGetMe();
  const { data: inUseSizingTemplates } = useGetAllSizingTemplates({
    sizingTemplateStatus: "IN_USE",
  });
  const maxInUseTemplates =
    me?.data?.data?.buyerProfile?.numberOfTemplates ?? 0;
  const canCreateTemplate =
    !!inUseSizingTemplates?.data?.data &&
    inUseSizingTemplates?.data?.data?.length < maxInUseTemplates;
  const [openSizingTemplate, setOpenSizingTemplate] = useState(false);

  // Add template to project - closes modal and accepts bid on success
  const {
    mutate: addSizingTemplateToProject,
    isPending: isAddingSizingTemplateToProject,
  } = useAddSizingTemplateToProject();

  // Create new template - then add to project
  const { mutate: createTemplate, isPending: isCreatingTemplate } =
    useCreateSizingTemplate({
      onSuccess: (data) => {
        const newTemplateId = data?.data?.data?.id;
        if (newTemplateId && projectData?.data?.data?.id) {
          addSizingTemplateToProject({
            projectId: projectData?.data?.data?.id,
            sizingTemplateId: newTemplateId,
          });
        }
      },
    });

  // Handle height/size submission
  // For existing templates: First update with height/ukSize, then add to project
  // For new templates: Create with all values, then add to project
  const handleHeightSubmit = (
    height: number,
    ukStandardSize: UmojalinnStandardSize,
    unit: UmojaLinnSizingTemplate["unit"],
  ) => {
    createTemplate({
      name: projectData?.data?.data?.title || "Project",
      gender: projectData?.data?.data?.gender || "MALE",
      unit,
      height,
      ukStandardSize,
    });
  };

  if (!projectData?.data?.data?.sizingTemplateId) {
    return (
      <>
        <Popover>
          <PopoverTrigger
            className="group popover-trigger"
            asChild
            disabled={
              loadingSizingTemplate || loadingProject || !canCreateTemplate
            }
          >
            <div className="group-[.popover-trigger]:opacity-50">
              <AvatarIconTag
                label={"No sizing template"}
                icon={
                  canCreateTemplate && (
                    <span className="bg-background border-dotted border border-primary text-primary h-6 w-6 flex items-center justify-center rounded-full">
                      <Plus className="h-4 w-4" />
                    </span>
                  )
                }
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="center" className="w-48 p-0 overflow-hidden">
            {sizingTemplateData?.data?.data?.map((template) => (
              <PopoverClose key={template?.id} asChild>
                <MenuButton
                  onClick={() =>
                    addSizingTemplateToProject({
                      projectId: props.projectId,
                      sizingTemplateId: template?.id,
                    })
                  }
                >
                  {template?.name}
                </MenuButton>
              </PopoverClose>
            ))}
            <PopoverClose asChild>
              <MenuButton
                onClick={() => canCreateTemplate && setOpenSizingTemplate(true)}
                icon={
                  canCreateTemplate ? (
                    <FilePlus />
                  ) : (
                    <X className="text-red-500" />
                  )
                }
                className="bg-gray-100 hover:bg-gray-200"
                disabled={canCreateTemplate}
              >
                {canCreateTemplate
                  ? "Create new template"
                  : `Max is ${maxInUseTemplates} templates`}
              </MenuButton>
            </PopoverClose>
          </PopoverContent>
        </Popover>
        {/* <SizingTemplateDialog
          open={openSizingTemplate}
          onOpenChange={setOpenSizingTemplate}
        /> */}

        <HeightAndSizeModal
          triggerOpen={openSizingTemplate}
          onOpenChange={setOpenSizingTemplate}
          unit={projectData?.data?.data?.sizingTemplate?.unit ?? "CM"}
          onSubmit={handleHeightSubmit}
          isLoading={isCreatingTemplate || isAddingSizingTemplateToProject}
          gender={projectData?.data?.data?.sizingTemplate?.gender}
        />

        {projectData?.data?.data?.status === "COMPLETED" && (
          <div className="w-full h-full absolute top-0 left-0 cursor-not-allowed bg-gray-200 opacity-10" />
        )}
      </>
    );
  }

  if (projectData?.data?.data?.sizingTemplate?.metadata?.reviews) {
    return (
      <div>
        <SizingTemplateDialog id={projectData?.data?.data?.sizingTemplateId}>
          <AvatarIconTag
            label="View sizing recommendation"
            icon={<CheckCircle className="text-warning" />}
          />
        </SizingTemplateDialog>
      </div>
    );
  }

  return (
    <div>
      <SizingTemplateDialog id={projectData?.data?.data?.sizingTemplateId}>
        <AvatarIconTag
          label="View sizing template"
          icon={<CheckCircle className="text-success" />}
        />
      </SizingTemplateDialog>
    </div>
  );
};

export default SizingTemplateTag;
