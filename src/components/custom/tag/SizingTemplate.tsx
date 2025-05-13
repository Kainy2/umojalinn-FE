import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetProjectById } from "@/tanstack/hooks/useProject";
import React, { useState } from "react";
import AvatarIconTag from "./AvatarIcon";
import { FilePlus, Plus } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import MenuButton from "../MenuButton";
import {
  useAddSizingTemplateToProject,
  useGetAllSizingTemplates,
} from "@/tanstack/hooks/useSizingTemplates";
import SizingTemplateDialog from "../dialog/SizingTemplate";
import CheckCircle from "@/icons/CheckCircle";
type SizingTemplateTagProps = {
  projectId: string;
};

const SizingTemplateTag = (props: SizingTemplateTagProps) => {
  const { data: projectData, isPending: loadingProject } = useGetProjectById(
    props.projectId
  );
  const { data: sizingTemplateData, isPending: loadingSizingTemplate } =
    useGetAllSizingTemplates({
      sizingTemplateStatus: "LIVE",
    });

  const [openSizingTemplate, setOpenSizingTemplate] = useState(false);

  const { mutate: addSizingTemplateToProject } =
    useAddSizingTemplateToProject();

  if (!projectData?.data?.data?.sizingTemplateId) {
    return (
      <>
        <Popover>
          <PopoverTrigger 
            className="group popover-trigger"
            asChild
            disabled={loadingSizingTemplate || loadingProject}
           >
            <div className="group-[.popover-trigger]:opacity-50">
              <AvatarIconTag
                label="No sizing template"
                icon={
                  <span className="bg-background border-dotted border border-primary text-primary h-6 w-6 flex items-center justify-center rounded-full">
                    <Plus className="h-4 w-4" />
                  </span>
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
                onClick={() => setOpenSizingTemplate(true)}
                icon={<FilePlus />}
                className="bg-gray-100 hover:bg-gray-200"
              >
                Create new template
              </MenuButton>
            </PopoverClose>
          </PopoverContent>
        </Popover>
        <SizingTemplateDialog
          open={openSizingTemplate}
          onOpenChange={setOpenSizingTemplate}
          type="CREATE"
        />
        { projectData?.data?.data?.status === "COMPLETED" && <div className="w-full h-full absolute top-0 left-0 cursor-not-allowed bg-gray-200 opacity-10" /> }

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
