import React from "react";

const PragraphSpacing = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.5 8.33301H10.8333M17.5 4.99967H10.8333M17.5 11.6663H10.8333M17.5 14.9997H10.8333M5 16.6663L5 3.33301M5 16.6663L2.5 14.1663M5 16.6663L7.5 14.1663M5 3.33301L2.5 5.83301M5 3.33301L7.5 5.83301"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PragraphSpacing;
