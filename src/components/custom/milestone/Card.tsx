import { Button } from "@/components/ui/button";
import { getCurrencySymbol } from "@/lib/string";
import { commadStringToNumber, numberToCommadString } from "@/lib/utils";
import { UmojaLinnCurrency } from "@/types/project";
import { Edit, Minus, Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import TextField from "../input/TextField";
import TextAreaField from "../input/TextAreaField";
import { Separator } from "@/components/ui/separator";
import VerifyDialog from "../dialog/Verify";
import { formatCurrencyValue } from "@/lib/number";

type MileStoneCardProps = {
  id?: string;
  view: boolean;
  title: string;
  description: string;
  onSave: (props: {
    id?: string;
    title: string;
    description: string;
    price: number;
  }) => void;
  price: number;
  stringPrice: string;
  onEdit: React.ComponentProps<"button">["onClick"];
  onCancel: React.ComponentProps<"button">["onClick"];
  onDelete?: () => void;
  currency: UmojaLinnCurrency | null;
  hideActions: boolean;
};

export const MileStoneCardFooter = (
  props: Pick<MileStoneCardProps, "view" | "price" | "stringPrice" | "currency"> & {
    label: string;
    onPriceChange: (value: string) => void;
  }
) => {
  const { view, price, stringPrice, onPriceChange, label, currency } = props;
  const [content, setContent] = useState(String(stringPrice));
  const [width, setWidth] = useState<number | undefined>();
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setWidth(span.current?.offsetWidth);
  }, [content, stringPrice]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const value = parseStringToNumber(e?.target?.value)?.value ;
    const value = e?.target?.value;
    const numericValue = value.replace(/[^\d]/g, "")
		const commaValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log({ numericValue, commaValue });
    
    setContent(commaValue);
    onPriceChange(commaValue);
  };

  return (
    <div className="flex justify-between items-center text-subtitle-2 font-semibold">
      <h4>{label}</h4>
      <div className="flex w-fit gap-2 items-center [&>*>svg]:text-primary ">
        {view ? (
          <span>
            {getCurrencySymbol(currency)} {formatCurrencyValue(price)}
          </span>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPriceChange(price && price > 10 ? numberToCommadString(price - 10) : "0")
              }
            >
              <Minus />
            </Button>

            <div className="relative font-semibold w-fit flex shrink-0">
              <span className="absolute pointer-events-none inset-y-0 left-0 flex items-center">
                {getCurrencySymbol(currency)}
              </span>
              <span
                className="absolute opacity-0 shrink-0 pointer-events-none"
                ref={span}
              >
                {price || content}
              </span>
              <input
                value={content || ""}
                onChange={changeHandler}
                className="pl-4 transition shrink-0 w-fit block disabled:bg-background ring-ring placeholder:text-subtitle-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="0"
                disabled={view}
                type="text"
                min={0}
                style={{ width: width ? `${width + 20}px` : "30px" }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPriceChange(price ? numberToCommadString(price + 10) : "10")}
            >
              <Plus />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const MilestoneCard = (props: MileStoneCardProps) => {
  const {
    id,
    view,
    title,
    description,
    currency,
    stringPrice,
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
    price: stringPrice,
  });

  useEffect(() => {
    if (!view) {
      setEditedValues({
        title,
        description,
        price: stringPrice,
      });
    }
  }, [description, stringPrice, price, title, view]);

  const handleEdit =
    (value: "title" | "description" | "price") =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | string
    ) => {
      setEditedValues((prev) => ({
        ...prev,
        [value]:
          value === "price" || typeof e === "string" ? e : e.target.value,
      }));
    };

  const footer = (
    <MileStoneCardFooter
      currency={currency}
      stringPrice={view ? stringPrice : numberToCommadString(editedValues.price)}
      price={view ? price : commadStringToNumber(editedValues.price)}
      onPriceChange={handleEdit("price")}
      view={view}
      label="Payment"
    />
  );

  if (view) {
    return (
      <div className="relative card p-8 flex flex-col gap-4">
        {!hideActions && !!id && (
          <VerifyDialog
            destructive
            onConfirm={onDelete}
            title="Delete Milestone?"
            description="Are you sure you want to delete this milestone? Please note that this is irreversible."
          >
            <button className="absolute top-8 right-8 text-primary [&>svg]:size-5">
              <Trash2 />
            </button>
          </VerifyDialog>
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
        value={editedValues?.title}
        onChange={handleEdit("title")}
      />
      <TextAreaField
        label="Description"
        value={editedValues?.description}
        onChange={handleEdit("description")}
        placeholder="Enter a description..."
        rows={5}
      />
      {footer}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => onSave({ 
            ...editedValues, 
            id,
            price: commadStringToNumber(editedValues.price), 
           })}
          className="text-left items-center w-fit flex text-sm text-primary [&>svg]:size-5 gap-2"
        >
          <Save />
          Save
        </button>
        <Separator orientation="vertical" className="w-[1px] h-6" />
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

export default MilestoneCard;
