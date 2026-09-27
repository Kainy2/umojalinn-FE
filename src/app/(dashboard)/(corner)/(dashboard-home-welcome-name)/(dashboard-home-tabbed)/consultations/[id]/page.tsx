import BuyerConsultationDetail from "@/components/consultation/detail/BuyerDetail";
import { PageProps } from "@/types/util";

const BuyerConsultationDetailPage = async (
  props: PageProps<{ id: string }>,
) => {
  const params = await props.params;
  return <BuyerConsultationDetail consultationId={params.id} />;
};

export default BuyerConsultationDetailPage;
