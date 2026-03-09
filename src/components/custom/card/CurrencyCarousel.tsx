"use client";
import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICurrencyCarouselProps } from "./@types";

export const CurrencyCarousel = ({ children }: ICurrencyCarouselProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScrollPosition = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;

        // Show left arrow if scrolled right from the start
        setShowLeftArrow(scrollLeft > 0);

        // Show right arrow if there's more content to scroll
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
    };

    useEffect(() => {
        checkScrollPosition();

        const container = scrollContainerRef.current;
        if (!container) return;

        // Check on resize
        const resizeObserver = new ResizeObserver(checkScrollPosition);
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [children]);

    const handleChildClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Find the direct child of the scroll container that was clicked
        let target = e.target as HTMLElement | null;
        while (target && target.parentElement !== container) {
            target = target.parentElement;
        }

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest",
            });
        }
    };

    const scroll = (direction: "left" | "right") => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 265; // Card width (249px) + gap (16px)
        const targetScroll = direction === "left"
            ? container.scrollLeft - scrollAmount
            : container.scrollLeft + scrollAmount;

        container.scrollTo({
            left: targetScroll,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative group">
            {/* Left Arrow */}
            {showLeftArrow && (
                <button
                    onClick={() => scroll("left")}
                    className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                        "size-10 rounded-full bg-white border border-input shadow-lg",
                        "flex items-center justify-center",
                        "hover:bg-gray-50 transition-colors",
                        "text-navy-900"
                    )}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="size-5" />
                </button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScrollPosition}
                onClick={handleChildClick}
                className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {children}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
                <button
                    onClick={() => scroll("right")}
                    className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                        "size-10 rounded-full bg-white border border-input shadow-lg",
                        "flex items-center justify-center",
                        "hover:bg-gray-50 transition-colors",
                        "text-navy-900"
                    )}
                    aria-label="Scroll right"
                >
                    <ChevronRight className="size-5" />
                </button>
            )}
        </div>
    );
};
