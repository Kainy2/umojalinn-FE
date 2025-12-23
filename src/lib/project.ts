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

type SizingTemplateUpdateProps = Partial<
  UmojaLinnFemaleSizingTemplateProps & UmojaLinnMaleSizingTemplateProps
>;

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
  const res: SizingTemplateUpdateProps = {};

  (gender === "MALE" ? MALE_SIZING_TEMPLATE : FEMALE_SIZING_TEMPLATE).map(
    (template) => {
      if (entries?.[template.prop])
        res[template.prop] = entries?.[template.prop] as null | undefined;
    }
  );
  return res;
}
