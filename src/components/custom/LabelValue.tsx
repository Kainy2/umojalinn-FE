import React from "react";

type LabelValueProps = {
  label: string;
  value?: string | string[] | [string, string][];
  className?: string;
};

const LabelValue = (props: LabelValueProps) => {
  return (
    <div className={props.className}>
      <p className="text-foreground-body text-sm mb-2">{props.label}</p>
      <p className="text-foreground">
        {!props.value?.length
          ? "None"
          : Array.isArray(props.value)
          ? props.value
              ?.filter((val) => !!val)
              .map((val, i) => {
                if (Array.isArray(val)) {
                  return (
                    <React.Fragment key={i}>
                      {i !== 0 && ", "}
                      {val[0]}{" "}
                      <span className="font-light text-gray-400">{val[1]}</span>
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={i}>
                    {i !== 0 && ", "}
                    {val}
                  </React.Fragment>
                );
              })
          : props.value}
      </p>
    </div>
  );
};

export default LabelValue;
