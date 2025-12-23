"use client";
/**
 * RequestMeasurementPointsPage - Designer interface to request specific measurement points from buyers.
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Info, HelpCircle } from "lucide-react";
import { UmojaLinnSizingTemplate } from "@/types/project";
import { useRequestMeasurementPoints } from "@/tanstack/hooks/useSizingTemplates";

type RequestMeasurementPointsPageProps = {
  projectId: string;
  projectName: string;
  gender: UmojaLinnSizingTemplate["gender"];
  template: Array<{ name: string; prop: string; img: string }>;
  ukStandardSize?: string;
  height?: number;
  unit: UmojaLinnSizingTemplate["unit"];
  prefilledPoints?: string[];
  buyerName?: string;
};

const RequestMeasurementPointsPage = ({
  projectId,
  projectName,
  gender,
  template,
  ukStandardSize,
  height,
  unit,
  prefilledPoints = [],
  buyerName = "the buyer",
}: RequestMeasurementPointsPageProps) => {
  const router = useRouter();
  const [selectedPoints, setSelectedPoints] = useState<string[]>(prefilledPoints);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const { mutate: requestPoints, isPending } = useRequestMeasurementPoints({
    onSuccess: () => router.back(),
  });

  const handleToggle = (prop: string) => {
    setSelectedPoints((prev) => prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]);
  };

  const handleReset = () => setSelectedPoints([]);

  const handleSubmit = () => {
    requestPoints({ projectId, requestedMeasurementPoints: selectedPoints });
  };

  const handlePointHover = (img: string, name: string) => {
    setPreviewImage(img);
    setPreviewName(name);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Info Banner */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <Info className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground-body">Height and Standard Size!</p>
            <p className="text-sm text-muted-foreground">In the bidding phase, only Height and Standard size will be shown. Buyers can access other measurements once the project is live.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-6">
              <div className="animate-in fade-in duration-300">
                <h1 className="text-2xl font-bold text-foreground-body mb-2">Request Sizing template</h1>
                <p className="text-sm text-muted-foreground">Send measurements point to &quot;{buyerName}&quot; for &quot;{projectName}&quot; Project</p>
              </div>

              {/* Default Fields */}
              <div className="flex flex-col gap-2 animate-in fade-in duration-300 delay-100">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium">{gender}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">UK Standard Size</span>
                    <HelpCircle className="size-4 text-gray-400" />
                  </div>
                  {ukStandardSize && <span className="text-muted-foreground">{ukStandardSize} UK</span>}
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="font-medium">Height</span>
                  {height && <span className="text-muted-foreground">{height} {unit}</span>}
                </div>
              </div>

              {/* Measurement Points */}
              <div className="flex flex-col gap-2">
                {template.map((point, index) => {
                  const isSelected = selectedPoints.includes(point.prop);
                  return (
                    <div
                      key={point.prop}
                      onClick={() => handleToggle(point.prop)}
                      onMouseEnter={() => handlePointHover(point.img, point.name)}
                      style={{ animationDelay: `${(index + 3) * 30}ms` }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer group animate-in fade-in slide-in-from-left-2",
                        isSelected ? "bg-primary border-primary shadow-sm scale-[1.01]" : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggle(point.prop)}
                          className={cn("transition-all duration-200", isSelected ? "border-white bg-white data-[state=checked]:bg-white data-[state=checked]:text-primary" : "")}
                        />
                        <span className={cn("text-sm font-medium transition-colors", isSelected ? "text-white" : "text-foreground-body")}>{point.name}</span>
                      </div>
                      <HelpCircle className={cn("size-4 transition-colors", isSelected ? "text-white/70" : "text-gray-400")} />
                    </div>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex gap-3 mt-6 animate-in fade-in duration-300">
                <Button variant="outline" onClick={handleReset} disabled={isPending || selectedPoints.length === 0} className="flex-1">Reset</Button>
                <Button onClick={handleSubmit} disabled={isPending} className="flex-1">Request Sizing template</Button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 flex flex-col gap-4">
              {previewName && <h3 className="text-lg font-semibold text-foreground-body animate-in fade-in duration-200">{previewName}</h3>}
              <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300">
                <div className="relative min-h-[400px] bg-white rounded-lg overflow-hidden">
                  {previewImage ? (
                    <Image src={previewImage} fill alt={`Guide for ${previewName || "measurement"}`} className="object-contain animate-in fade-in duration-300" priority />
                  ) : (
                    <div className="flex items-center justify-center h-[400px] text-muted-foreground text-sm">
                      <p className="animate-pulse">Hover over a measurement point to see the guide</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button variant="outline" onClick={handleReset} disabled={isPending || selectedPoints.length === 0} className="flex-1 hover:scale-[1.02] transition-transform">Reset</Button>
                <Button onClick={handleSubmit} disabled={isPending} className="flex-1 hover:scale-[1.02] transition-transform">Request Sizing template</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMeasurementPointsPage;
