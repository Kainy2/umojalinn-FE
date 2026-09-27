import { cn } from "@/lib/utils";

const DisabledTemplateItems = ({
  title,
  value,
}: {
  title: string;
  value?: string | number;
}) => {
  console.log(value)
  return (
    <div
      // style={{ animationDelay: `${(index + 4) * 30}ms` }}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-not-allowed group animate-in fade-in slide-in-from-left-2",
        "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            "text-foreground-body"
          )}
        >
          {title}
        </span>
      </div>

      <div>
        {value}
      </div>
    </div>
  );
};

export default DisabledTemplateItems;