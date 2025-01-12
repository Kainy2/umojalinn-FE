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
          <PopoverTrigger asChild>
            <button
              disabled={loadingSizingTemplate || loadingProject}
              className="disabled:opacity-50"
            >
              <AvatarIconTag
                label="No sizing template"
                icon={
                  <span className="bg-background border-dotted border border-primary text-primary h-6 w-6 flex items-center justify-center rounded-full">
                    <Plus className="h-4 w-4" />
                  </span>
                }
              />
            </button>
          </PopoverTrigger>
          <PopoverContent align="center" className="w-48 p-0 overflow-hidden">
            {sizingTemplateData?.data?.data?.map((template) => (
              <PopoverClose key={template?.id} asChild>
                <MenuButton
                  onClick={() =>
                    addSizingTemplateToProject({
                      projectId: props.projectId,
                      sizingTemplateId: template.id,
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
        />
      </>
    );
  }

  return (
    <SizingTemplateDialog id={projectData?.data?.data?.sizingTemplateId}>
      <AvatarIconTag
        label="View sizing template"
        icon={<CheckCircle className="text-success" />}
      />
    </SizingTemplateDialog>
  );
};

export default SizingTemplateTag;
