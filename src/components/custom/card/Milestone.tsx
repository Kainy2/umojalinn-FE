import { Button } from "@/components/ui/button";
import { getCurrencySymbol } from "@/lib/string";
import { parseStringToNumber } from "@/lib/utils";
import { UmojaLinnCurrency } from "@/types/project";
import { Edit, Minus, Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import TextField from "../TextField";
import TextAreaField from "../TextField copy";

type MileStoneCardProps = {
  view: boolean;
  title: string;
  description: string;
  onSave: (props: {
    title: string;
    description: string;
    price: number;
  }) => void;
  onEdit: React.ComponentProps<"button">["onClick"];
  onCancel: React.ComponentProps<"button">["onClick"];
  onDelete: React.ComponentProps<"button">["onClick"];
  currency: UmojaLinnCurrency | null;
  price: number;
  hideActions: boolean;
};

export const MileStoneCardFooter = (
  props: Pick<MileStoneCardProps, "view" | "price" | "currency"> & {
    label: string;
    onPriceChange: (value: number) => void;
  }
) => {
  const { view, price, onPriceChange, label, currency } = props;
  const [content, setContent] = useState(price);
  const [width, setWidth] = useState<number | undefined>();
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setWidth(span.current?.offsetWidth);
  }, [content, price]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseStringToNumber(e?.target?.value)?.value || 0;
    setContent(value);
    onPriceChange(value);
  };

  return (
    <div className="flex justify-between items-center text-subtitle-2 font-semibold">
      <h4>{label}</h4>
      <div className="flex w-fit gap-2 items-center [&>*>svg]:text-primary ">
        {view ? (
          <span>
            {getCurrencySymbol(currency)} {price}
          </span>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPriceChange(price && price > 10 ? price - 10 : 0)
              }
            >
              <Minus />
            </Button>

            <div className="relative font-semibold w-fit flex shrink-0">
              <span className="absolute pointer-events-none inset-y-0 left-0 flex items-center">
                {getCurrencySymbol(currency)}
              </span>
              <span
                className="absolute opacity-0 pointer-events-none"
                ref={span}
              >
                {price || content}
              </span>
              <input
                value={price || ""}
                onChange={changeHandler}
                className="pl-4 transition shrink-0 w-fit block disabled:bg-background ring-ring placeholder:text-subtitle-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="0"
                disabled={view}
                type="number"
                min={0}
                style={{ width: width ? `${width + 20}px` : "30px" }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPriceChange(price ? price + 10 : 10)}
            >
              <Plus />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const MileStoneCard = (props: MileStoneCardProps) => {
  const {
    view,
    title,
    description,
    currency,
    price,
    hideActions,
    onSave,
    onEdit,
    onDelete,
    onCancel,
  } = props;

  const [editedValues, setEditedValues] = useState({
    title,
    description,
    price,
  });

  useEffect(() => {
    if (!view) {
      setEditedValues({
        title,
        description,
        price,
      });
    }
  }, [description, price, title, view]);

  const handleEdit =
    (value: "title" | "description" | "price") =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | number
    ) => {
      setEditedValues((prev) => ({
        ...prev,
        [value]:
          value === "price" || typeof e === "number" ? e : e.target.value,
      }));
    };

  const footer = (
    <MileStoneCardFooter
      currency={currency}
      price={view ? price : editedValues.price}
      onPriceChange={handleEdit("price")}
      view={view}
      label="Payment"
    />
  );

  if (view) {
    return (
      <div className="relative card p-8 flex flex-col gap-4">
        {!hideActions && (
          <button
            className="absolute top-8 right-8 text-primary [&>svg]:size-5"
            onClick={onDelete}
          >
            <Trash2 />
          </button>
        )}
        <div className="mb-8">
          <h3 className="mb-2 text-subtitle-2 font-semibold">
            {title || "Milestone name"}
          </h3>
          <p className="text-foreground-body text-sm">
            {description || "No description"}
          </p>
        </div>
        {footer}
        {!hideActions && (
          <button
            onClick={onEdit}
            className="text-left w-fit flex text-sm text-primary  [&>svg]:size-5 gap-2"
          >
            <Edit />
            Edit
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="card p-6 flex flex-col gap-4">
      <TextField
        label="Milestone name"
        value={title}
        onChange={handleEdit("title")}
      />
      <TextAreaField
        label="Description"
        value={description}
        onChange={handleEdit("description")}
        placeholder="Enter a description..."
        rows={5}
      />
      {footer}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => onSave(editedValues)}
          className="text-left w-fit flex text-sm text-primary [&>svg]:size-5 gap-2"
        >
          <Save />
          Save
        </button>
        <button
          onClick={onCancel}
          className="text-left w-fit flex text-sm text-foreground-body [&>svg]:size-5 gap-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MileStoneCard;
