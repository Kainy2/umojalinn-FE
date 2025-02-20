import {
  FEMALE_SIZING_TEMPLATE,
  MALE_SIZING_TEMPLATE,
} from "@/constant/sizingTemplate";
import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
  UmojaLinnProject,
  UmojaLinnSizingTemplate,
} from "@/types/project";

export function getCoverImage(project: UmojaLinnProject) {
  return (
    project?.Gallery?.find?.((gallery) => gallery?.isCoverImage)?.imageUrl ||
    "/img/svg/null.svg"
  );
}

export function getSizingTemplateUpdateProps(
  gender: UmojaLinnSizingTemplate["gender"],
  entries: Partial<
    UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
  >
) {
  const res: Partial<
    UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
  > = {};
  (gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE).map(
    (template) => {
      if (entries?.[template.prop])
        res[template.prop] = entries?.[template.prop];
    }
  );
  return res;
}
