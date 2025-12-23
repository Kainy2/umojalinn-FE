import SizingTemplatePage from "@/components/sizing-template/SizingTemplatePage";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const NewSizingTemplatePage = () => {
  return (
  <Suspense
    fallback={(
      <div className="h-full w-full flex items-center justify-center">
        <Skeleton className="h-full w-full" />
      </div>
    )}
  >
    <SizingTemplatePage />
  </Suspense>
  );
};

export default NewSizingTemplatePage;

