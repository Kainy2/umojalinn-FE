import React from "react";

const NairaSign = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 5.9441255,20.985354 V 3.9627528 L 17.83243,21.03757 17.789356,3.9627528"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 2.9137936,9.9651741 H 19.988624"
      />
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 2.9137936,14.976899 H 19.988624"
      />
    </svg>
  );
};

export default NairaSign;
