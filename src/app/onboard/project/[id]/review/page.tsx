import ReviewForm from "@/section/form/project/edit/Review";
import { PageProps } from "@/types/util";

const ReviewPage = async (props: PageProps<{ id: string }>) => {
  const { id } = await props.params;

  return <ReviewForm id={id} isOnboarding />;
};

export default ReviewPage;
