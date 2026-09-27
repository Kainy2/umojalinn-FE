import DesignerConsultationDetail from "@/components/consultation/detail/DesignerDetail";
import { PageProps } from "@/types/util";

const DesignerConsultationDetailPage = async (
  props: PageProps<{ id: string }>,
) => {
  const params = await props.params;
  return <DesignerConsultationDetail consultationId={params.id} />;
};

export default DesignerConsultationDetailPage;
