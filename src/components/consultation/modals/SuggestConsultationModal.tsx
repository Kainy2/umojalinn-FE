"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetDesignerAvailability,
  useSuggestConsultation,
} from "@/tanstack/hooks/useConsultation";
import {
  UmojaLinnAvailableTimeslot,
  UmojaLinnConsultationSlot,
} from "@/types/consultation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_AVAILABLE_TIMESLOTS } from "@/lib/consultation-mock";

type SuggestConsultationModalProps = {
  open: boolean;
  onClose: () => void;
  buyerProjectId: string;
  designerId: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const SuggestConsultationModal = ({
  open,
  onClose,
  buyerProjectId,
  designerId,
}: SuggestConsultationModalProps) => {
  const { toast } = useToast();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<
    UmojaLinnAvailableTimeslot["slots"][0] | null
  >(null);
  const [fee, setFee] = useState<number>(5);
  const [currency, setCurrency] = useState<"USD" | "NAIRA" | "GBP" | "EURO">("USD");
  const [message, setMessage] = useState("");

  const { data: availabilityData, isPending: loadingAvailability } =
    useGetDesignerAvailability(designerId, { enabled: open });

  // Use mock timeslots since backend isn't ready
  const availableTimeslots: UmojaLinnAvailableTimeslot[] = MOCK_AVAILABLE_TIMESLOTS;

  const { mutate: suggest, isPending: suggesting } = useSuggestConsultation({
    onSuccess: () => {
      toast({ title: "Consultation request sent to buyer!" });
      onClose();
      setSelectedDate(null);
      setSelectedSlot(null);
      setMessage("");
    },
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availableDates = new Set(availableTimeslots.map((s) => s.date));

  const formatDate = (d: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const slotsForSelectedDate =
    availableTimeslots.find((s) => s.date === selectedDate)?.slots ?? [];

  const handleSend = () => {
    if (!selectedDate || !selectedSlot) return;
    const slot: UmojaLinnConsultationSlot = {
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      durationMins: selectedSlot.durationMins,
      timezone: availabilityData?.data?.data?.timezone ?? "UTC",
    };
    suggest({ buyerProjectId, slot, fee, currency, message });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Suggest a Consultation</DialogTitle>
        </DialogHeader>

        {loadingAvailability ? (
          <Skeleton className="h-64" />
        ) : (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-foreground-body">
              Propose a consultation timeslot and fee to this buyer based on their job ad.
            </p>

            {/* Calendar */}
            <div>
              <p className="text-sm font-medium mb-2">Choose a timeslot</p>
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-semibold">
                  {MONTHS[month]} {year}
                </span>
                <button
                  onClick={() => setViewDate(new Date(year, month + 1, 1))}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 text-center">
                {DAYS.map((d) => (
                  <span key={d} className="text-xs text-foreground-body py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(day);
                  const isAvailable = availableDates.has(dateStr);
                  const isSelected = selectedDate === dateStr;
                  const isPast =
                    new Date(dateStr) < new Date(today.toDateString());
                  return (
                    <button
                      key={day}
                      disabled={!isAvailable || isPast}
                      onClick={() => {
                        setSelectedDate(dateStr);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        "aspect-square rounded-full text-sm flex items-center justify-center transition-colors",
                        isSelected && "bg-primary text-white",
                        !isSelected &&
                          isAvailable &&
                          !isPast &&
                          "hover:bg-primary/10 text-foreground",
                        (!isAvailable || isPast) &&
                          "text-gray-300 cursor-not-allowed",
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && slotsForSelectedDate.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Available times on{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {slotsForSelectedDate.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "text-sm border rounded px-3 py-1.5 transition-colors",
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 hover:border-primary",
                      )}
                    >
                      {slot.startTime} – {slot.endTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fee & currency */}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1">
                  Consultation Fee
                </label>
                <div className="flex items-center border rounded overflow-hidden">
                  <select
                    className="px-2 py-2 text-sm bg-gray-50 border-r outline-none"
                    value={currency}
                    onChange={(e) =>
                      setCurrency(
                        e.target.value as "USD" | "NAIRA" | "GBP" | "EURO",
                      )
                    }
                  >
                    <option value="USD">$</option>
                    <option value="NAIRA">₦</option>
                    <option value="GBP">£</option>
                    <option value="EURO">€</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    className="flex-1 px-3 py-2 text-sm outline-none"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Message to buyer
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder="Tell the buyer why you'd be a great fit for this consultation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                onClick={onClose}
                className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                disabled={!selectedDate || !selectedSlot || suggesting}
                onClick={handleSend}
                className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
              >
                {suggesting ? "Sending..." : "Send Consultation Request"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SuggestConsultationModal;
