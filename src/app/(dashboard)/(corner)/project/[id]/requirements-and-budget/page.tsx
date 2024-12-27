import RequirementsBudgetForm from "@/section/form/project/edit/RequirementAndBudget";
import { PageProps } from "@/types/util";
import React from "react";

const RequirementsBudgetPage = async (props: PageProps<{ id: string }>) => {
  const params = await props.params;
  return <RequirementsBudgetForm id={params.id} />;
};

export default RequirementsBudgetPage;
