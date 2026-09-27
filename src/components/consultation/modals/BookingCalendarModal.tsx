"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useBookConsultation,
  useGetAvailableTimeslots,
} from "@/tanstack/hooks/useConsultation";
import {
  UmojaLinnAvailableTimeslot,
  UmojaLinnConsultation,
  UmojaLinnConsultationSlot,
} from "@/types/consultation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type BookingCalendarModalProps = {
  open: boolean;
  onClose: () => void;
  consultation: UmojaLinnConsultation;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const BookingCalendarModal = ({
  open,
  onClose,
  consultation,
}: BookingCalendarModalProps) => {
  const { toast } = useToast();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<
    UmojaLinnAvailableTimeslot["slots"][0] | null
  >(null);

  const { data: slotsData, isPending: loadingSlots } = useGetAvailableTimeslots(
    consultation.designer?.id,
    30,
    { enabled: open },
  );
  const availableTimeslots: UmojaLinnAvailableTimeslot[] =
    slotsData?.data?.data ?? [];

  const { mutate: bookConsultation, isPending: booking } = useBookConsultation({
    onSuccess: () => {
      toast({ title: "Consultation booked successfully!" });
      onClose();
    },
  });

  // ── Calendar grid ──────────────────────────────────────────────────────────

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () =>
    setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(year, month + 1, 1));

  const availableDates = new Set(availableTimeslots.map((s) => s.date));

  const formatDate = (d: number) => {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const slotsForSelectedDate = availableTimeslots.find(
    (s) => s.date === selectedDate,
  )?.slots ?? [];

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    const slot: UmojaLinnConsultationSlot = {
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      durationMins: selectedSlot.durationMins,
      timezone: "UTC",
    };
    bookConsultation({
      consultationId: consultation.id,
      slot,
      durationMins: selectedSlot.durationMins,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Choose a Timeslot</DialogTitle>
        </DialogHeader>

        {loadingSlots ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-24" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Calendar header */}
            <div className="flex items-center justify-between">
              <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-sm font-semibold">
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 text-center">
              {DAYS.map((d) => (
                <span key={d} className="text-xs text-foreground-body py-1">
                  {d}
                </span>
              ))}
            </div>

            {/* Date grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for first day offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = formatDate(day);
                const isAvailable = availableDates.has(dateStr);
                const isSelected = selectedDate === dateStr;
                const isPast = new Date(dateStr) < new Date(today.toDateString());
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
                      !isSelected && isAvailable && !isPast && "hover:bg-primary/10 text-foreground",
                      (!isAvailable || isPast) && "text-gray-300 cursor-not-allowed",
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Available times on{" "}
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {slotsForSelectedDate.length === 0 ? (
                  <p className="text-sm text-foreground-body">
                    No available times on this date.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slotsForSelectedDate.map((slot) => (
                      <button
                        key={slot.startTime}
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "text-sm border rounded px-3 py-1.5 transition-colors",
                          selectedSlot?.startTime === slot.startTime
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 text-foreground hover:border-primary",
                        )}
                      >
                        {slot.startTime} – {slot.endTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fee info */}
            {consultation.consultationFee && (
              <p className="text-xs text-foreground-body">
                Consultation fee: ${consultation.consultationFee} + payment processing fee = ${consultation.totalFee}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                onClick={onClose}
                className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedSlot || booking}
                className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingCalendarModal;
