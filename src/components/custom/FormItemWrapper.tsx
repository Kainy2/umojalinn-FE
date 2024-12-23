import React from "react";

type FormItemWrapperProps = {
  children: React.ReactNode;
  title: string;
  description: string;
  endAdornment?: React.ReactNode;
};

const FormItemWrapper = (props: FormItemWrapperProps) => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-3 pt-2">
        <h3 className="font-semibold text-md text-foreground-label mb-1">
          {props.title}
        </h3>
        <p className="text-foreground-body text-sm"> {props.description}</p>
      </div>
      <div className="flex items-center col-span-12 lg:grid lg:grid-cols-subgrid lg:col-span-9 gap-4">
        <div className="flex-1 lg:flex-grow-0 lg:col-span-6">
          {props.children}
        </div>
        <div className="lg:col-span-3">{props.endAdornment}</div>
      </div>
    </div>
  );
};

export default FormItemWrapper;
