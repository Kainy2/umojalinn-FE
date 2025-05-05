import React from "react";

interface Options {
  [key: string]: React.ComponentProps<"span">;
}

type NotificationMessageProps = {
  message: string;
  content: Record<string, string | number>;
  options?: Options;
};

const NotificationMessage = (props: NotificationMessageProps) => {
  const { content, message, options = {} } = props;
  const parts = message.split(/({{\s*\w+\s*}})/g);

  // console.log(options, "<<< OPTIONS");

  return (
    <span>
      {parts.map((part, index) => {
        const match = part.match(/{{\s*(\w+)\s*}}/);
        if (match) {
          const key = match[1];
          if (key in content) {
            // console.log(options[key], key, "<<< OPTION");
            return (
              <span key={index} {...(options[key] || {})}>
                {content[key]}
              </span>
            );
          }
        }
        return part;
      })}
    </span>
  );
};

export default NotificationMessage;
