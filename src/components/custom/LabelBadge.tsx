import React from "react";
import { Badge } from "@/components/ui/badge";

type LabelBadgeValueProps =
  | string
  | null
  | undefined
  | Array<LabelBadgeValueProps>;

type LabelBadgeProps = {
  title: string;
  value?: LabelBadgeValueProps;
};

const LabelBadge = (props: LabelBadgeProps) => {
  return (
    <div className="flex justify-between">
      <p className="text-sm text-foreground-body">{props.title}</p>
      <div className="flex gap-4 flex-wrap justify-end max-w-48">
        <LabelBadgeValue value={props.value} />
      </div>
    </div>
  );
};

const LabelBadgeValue = (props: { value: LabelBadgeValueProps }) => {
  if (Array.isArray(props.value)) {
    return props.value.map((item, index) => (
      <LabelBadgeValue value={item} key={index} />
    ));
  }
  return (
    props.value && (
      <Badge variant="outline" className="rounded-sm font-normal">
        {props?.value}
      </Badge>
    )
  );
};

export default LabelBadge;
