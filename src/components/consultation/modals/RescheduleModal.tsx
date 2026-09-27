"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAcceptReschedule,
  useDeclineReschedule,
  useGetAvailableTimeslots,
  useRescheduleConsultation,
} from "@/tanstack/hooks/useConsultation";
import {
  UmojaLinnAvailableTimeslot,
  UmojaLinnConsultation,
} from "@/types/consultation";
import { UmojaLinnUserRole } from "@/types/user";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type RescheduleModalProps = {
  open: boolean;
  onClose: () => void;
  consultation: UmojaLinnConsultation;
  role: UmojaLinnUserRole;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const RescheduleModal = ({ open, onClose, consultation, role }: RescheduleModalProps) => {
  const { toast } = useToast();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<UmojaLinnAvailableTimeslot["slots"][0] | null>(null);
  const [message, setMessage] = useState("");

  const { data: slotsData } = useGetAvailableTimeslots(
    consultation.designer?.id,
    30,
    { enabled: open && role === "DESIGNER" },
  );
  const availableTimeslots: UmojaLinnAvailableTimeslot[] = slotsData?.data?.data ?? [];

  const { mutate: proposeReschedule, isPending: proposing } = useRescheduleConsultation({
    onSuccess: () => {
      toast({ title: "Reschedule request sent!" });
      onClose();
    },
  });

  const { mutate: acceptReschedule, isPending: accepting } = useAcceptReschedule({
    onSuccess: () => {
      toast({ title: "Reschedule accepted!" });
      onClose();
    },
  });

  const { mutate: declineReschedule, isPending: declining } = useDeclineReschedule({
    onSuccess: () => {
      toast({ title: "Reschedule declined." });
      onClose();
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

  const slotsForSelectedDate = availableTimeslots.find((s) => s.date === selectedDate)?.slots ?? [];

  // ── Buyer view: incoming reschedule request ─────────────────────────────────
  if (role === "BUYER" && consultation.rescheduleRequest?.status === "PENDING") {
    const req = consultation.rescheduleRequest;
    const slot = req.proposedSlot;
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Request</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-foreground-body">
              {consultation.designer?.firstName} has proposed a new time for your consultation:
            </p>
            <div className="border rounded-lg p-4">
              <p className="text-sm font-semibold">
                {new Date(slot.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
              <p className="text-sm text-foreground-body">
                {slot.startTime} – {slot.endTime} ({slot.timezone})
              </p>
              {req.message && (
                <p className="text-sm mt-2 text-foreground-body italic">&ldquo;{req.message}&rdquo;</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => declineReschedule(consultation.id)}
                disabled={declining}
                className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600"
              >
                {declining ? "Declining..." : "Decline"}
              </button>
              <button
                onClick={() => acceptReschedule(consultation.id)}
                disabled={accepting}
                className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
              >
                {accepting ? "Accepting..." : "Accept"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Designer view: propose new time ────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Propose Reschedule</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-foreground-body">
            Choose a new time to propose to the buyer.
          </p>

          {/* Calendar */}
          <div className="flex items-center justify-between">
            <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-semibold">{MONTHS[month]} {year}</span>
            <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center">
            {DAYS.map((d) => (
              <span key={d} className="text-xs text-foreground-body py-1">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
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
                  onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
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

          {selectedDate && slotsForSelectedDate.length > 0 && (
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
          )}

          <div>
            <label className="text-sm font-medium">Message (optional)</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm mt-1 resize-none"
              rows={3}
              placeholder="Explain why you need to reschedule..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <button onClick={onClose} className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600">
              Cancel
            </button>
            <button
              disabled={!selectedDate || !selectedSlot || proposing}
              onClick={() => {
                if (!selectedDate || !selectedSlot) return;
                proposeReschedule({
                  consultationId: consultation.id,
                  proposedSlot: {
                    date: selectedDate,
                    startTime: selectedSlot.startTime,
                    endTime: selectedSlot.endTime,
                    durationMins: selectedSlot.durationMins,
                    timezone: "UTC",
                  },
                  message,
                });
              }}
              className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
            >
              {proposing ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
