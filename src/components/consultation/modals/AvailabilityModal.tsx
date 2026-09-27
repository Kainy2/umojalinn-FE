"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetDesignerAvailability,
  useSaveDesignerAvailability,
} from "@/tanstack/hooks/useConsultation";
import {
  ConsultationDay,
  UmojaLinnConsultationAvailabilitySlot,
  UmojaLinnConsultationDuration,
} from "@/types/consultation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type AvailabilityModalProps = {
  open: boolean;
  onClose: () => void;
  designerId: string;
};

const DAYS: ConsultationDay[] = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY",
];

const DAY_SHORT: Record<ConsultationDay, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const DURATION_OPTIONS: { mins: 30 | 45 | 60; label: string }[] = [
  { mins: 30, label: "30 min" },
  { mins: 45, label: "45 min" },
  { mins: 60, label: "60 min" },
];

const AvailabilityModal = ({ open, onClose, designerId }: AvailabilityModalProps) => {
  const { toast } = useToast();
  const { data, isPending } = useGetDesignerAvailability(designerId, { enabled: open });
  const availability = data?.data?.data;

  const [isAvailable, setIsAvailable] = useState(true);
  const [timezone, setTimezone] = useState("UTC");
  const [slots, setSlots] = useState<UmojaLinnConsultationAvailabilitySlot[]>([]);
  const [durations, setDurations] = useState<UmojaLinnConsultationDuration[]>([]);

  // Initialise form from fetched data
  useEffect(() => {
    if (availability) {
      setIsAvailable(availability.isAvailableForConsultation);
      setTimezone(availability.timezone);
      setSlots(availability.slots);
      setDurations(availability.durations);
    }
  }, [availability]);

  const { mutate: save, isPending: saving } = useSaveDesignerAvailability({
    onSuccess: () => {
      toast({ title: "Availability saved!" });
      onClose();
    },
  });

  const toggleDay = (day: ConsultationDay) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.day === day ? { ...s, isAvailable: !s.isAvailable } : s,
      ),
    );
  };

  const updateSlotTime = (
    day: ConsultationDay,
    field: "from" | "to",
    value: string,
  ) => {
    setSlots((prev) =>
      prev.map((s) => (s.day === day ? { ...s, [field]: value } : s)),
    );
  };

  const toggleDuration = (mins: 30 | 45 | 60) => {
    setDurations((prev) =>
      prev.map((d) =>
        d.durationMins === mins ? { ...d, isEnabled: !d.isEnabled } : d,
      ),
    );
  };

  const updateDurationPrice = (mins: 30 | 45 | 60, price: number) => {
    setDurations((prev) =>
      prev.map((d) => (d.durationMins === mins ? { ...d, price } : d)),
    );
  };

  const handleSave = () => {
    save({
      isAvailableForConsultation: isAvailable,
      timezone,
      slots,
      durations,
      bufferMinsBetweenSessions: 15,
      advanceBookingDays: 14,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultation Availability</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10" />
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Available toggle */}
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <p className="text-sm font-semibold">Available for Consultations</p>
                <p className="text-xs text-foreground-body mt-0.5">
                  Toggle off to stop receiving consultation requests
                </p>
              </div>
              <button
                onClick={() => setIsAvailable((v) => !v)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  isAvailable ? "bg-primary" : "bg-gray-300",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                    isAvailable ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>

            {isAvailable && (
              <>
                {/* Timezone */}
                <div>
                  <label className="text-sm font-semibold block mb-1">Timezone</label>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">UTC</option>
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="America/New_York">America/New_York (ET)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>

                {/* Available Days & Hours */}
                <div>
                  <p className="text-sm font-semibold mb-3">Available Days &amp; Hours</p>
                  <div className="flex flex-col gap-3">
                    {DAYS.map((day) => {
                      const slot = slots.find((s) => s.day === day);
                      if (!slot) return null;
                      return (
                        <div key={day} className="flex items-center gap-4">
                          <button
                            onClick={() => toggleDay(day)}
                            className={cn(
                              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
                              slot.isAvailable ? "bg-primary" : "bg-gray-300",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-3 w-3 rounded-full bg-white transition-transform",
                                slot.isAvailable ? "translate-x-5" : "translate-x-1",
                              )}
                            />
                          </button>
                          <span className="w-8 text-sm text-foreground-body">
                            {DAY_SHORT[day]}
                          </span>
                          {slot.isAvailable ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                className="border rounded px-2 py-1 text-sm"
                                value={slot.from}
                                onChange={(e) =>
                                  updateSlotTime(day, "from", e.target.value)
                                }
                              />
                              <span className="text-foreground-body text-sm">to</span>
                              <input
                                type="time"
                                className="border rounded px-2 py-1 text-sm"
                                value={slot.to}
                                onChange={(e) =>
                                  updateSlotTime(day, "to", e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-foreground-body">
                              Unavailable
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Duration & Pricing */}
                <div>
                  <p className="text-sm font-semibold mb-3">
                    Session Duration &amp; Pricing
                  </p>
                  <div className="flex flex-col gap-3">
                    {DURATION_OPTIONS.map(({ mins, label }) => {
                      const dur = durations.find((d) => d.durationMins === mins);
                      if (!dur) return null;
                      return (
                        <div key={mins} className="flex items-center gap-4">
                          <button
                            onClick={() => toggleDuration(mins)}
                            className={cn(
                              "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
                              dur.isEnabled ? "bg-primary" : "bg-gray-300",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-3 w-3 rounded-full bg-white transition-transform",
                                dur.isEnabled ? "translate-x-5" : "translate-x-1",
                              )}
                            />
                          </button>
                          <span className="w-12 text-sm text-foreground">{label}</span>
                          {dur.isEnabled && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-foreground-body">Price</span>
                              <div className="flex items-center border rounded overflow-hidden">
                                <span className="px-2 py-1.5 text-sm text-foreground-body bg-gray-50 border-r">
                                  $
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  className="w-20 px-2 py-1.5 text-sm outline-none"
                                  value={dur.price}
                                  onChange={(e) =>
                                    updateDurationPrice(mins, Number(e.target.value))
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                onClick={onClose}
                className="text-sm border border-gray-300 px-4 py-2 rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Availability"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;
