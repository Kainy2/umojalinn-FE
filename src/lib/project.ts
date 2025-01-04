import { UmojaLinnProject } from "@/types/project";

export function getCoverImage(project: UmojaLinnProject) {
  return (
    project?.Gallery?.find?.((gallery) => gallery?.isCoverImage)?.imageUrl ||
    "/img/svg/null.svg"
  );
}
