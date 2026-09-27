"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateConsultationRequest } from "@/tanstack/hooks/useConsultation";
import { TCreateConsultationRequestPayload } from "@/types/consultation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ConsultationRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

const STEPS = ["Project Details", "Inspiration & Notes"];

const ConsultationRequestModal = ({
  open,
  onClose,
}: ConsultationRequestModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<TCreateConsultationRequestPayload>>({
    currency: "USD",
    gender: "MALE",
    inspirationImages: [],
  });

  const { mutate, isPending } = useCreateConsultationRequest({
    onSuccess: () => {
      toast({ title: "Consultation request submitted!" });
      onClose();
      setStep(0);
      setForm({ currency: "USD", gender: "MALE", inspirationImages: [] });
    },
  });

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else {
      mutate(form as TCreateConsultationRequestPayload);
    }
  };

  const handleBack = () => setStep((s) => s - 1);

  const update = (patch: Partial<TCreateConsultationRequestPayload>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New Consultation Request</DialogTitle>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "size-6 rounded-full flex items-center justify-center text-xs font-semibold",
                  i <= step
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-500",
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  "text-sm",
                  i <= step ? "text-foreground font-medium" : "text-foreground-body",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-px bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Project Title</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                placeholder="e.g. My Wedding Agbada"
                value={form.projectTitle ?? ""}
                onChange={(e) => update({ projectTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Project Description</label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm mt-1 resize-none"
                rows={4}
                placeholder="Describe your project..."
                value={form.projectDescription ?? ""}
                onChange={(e) => update({ projectDescription: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={form.timeline?.startDate ?? ""}
                  onChange={(e) =>
                    update({
                      timeline: {
                        startDate: e.target.value,
                        endDate: form.timeline?.endDate ?? "",
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={form.timeline?.endDate ?? ""}
                  onChange={(e) =>
                    update({
                      timeline: {
                        startDate: form.timeline?.startDate ?? "",
                        endDate: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Budget Min ($)</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  placeholder="10"
                  value={form.budget?.min ?? ""}
                  onChange={(e) =>
                    update({
                      budget: {
                        min: Number(e.target.value),
                        max: form.budget?.max ?? 0,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Budget Max ($)</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  placeholder="200"
                  value={form.budget?.max ?? ""}
                  onChange={(e) =>
                    update({
                      budget: {
                        min: form.budget?.min ?? 0,
                        max: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Gender</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  value={form.gender}
                  onChange={(e) =>
                    update({ gender: e.target.value as "MALE" | "FEMALE" })
                  }
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Country</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm mt-1"
                  placeholder="e.g. United States"
                  value={form.deliveryCountry ?? ""}
                  onChange={(e) => update({ deliveryCountry: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium">Clothing Type</label>
              <input
                className="w-full border rounded px-3 py-2 text-sm mt-1"
                placeholder="e.g. Agbada, Gown, Suit..."
                value={form.clothingType ?? ""}
                onChange={(e) => update({ clothingType: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Additional Notes</label>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm mt-1 resize-none"
                rows={4}
                placeholder="Any additional notes for the designer..."
                value={form.additionalNotes ?? ""}
                onChange={(e) => update({ additionalNotes: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Inspiration Images</label>
              <p className="text-xs text-foreground-body mt-0.5">
                Upload images that inspire your design (optional)
              </p>
              <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center text-sm text-foreground-body">
                Click to upload or drag & drop images here
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          {step > 0 ? (
            <button
              onClick={handleBack}
              className="text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            disabled={isPending}
            className="text-sm bg-primary text-white px-5 py-2 rounded font-medium disabled:opacity-50"
          >
            {step === STEPS.length - 1
              ? isPending
                ? "Submitting..."
                : "Submit Request"
              : "Next"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationRequestModal;
