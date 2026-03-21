"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Squad } from "@/lib/accountability-data";
import { getTimelineProgress } from "@/lib/accountability-data";

interface TimelineBarProps {
  squad: Squad;
}

const phases = [
  { label: "Foundation", weeks: "1–3", pct: 25 },
  { label: "Positioning", weeks: "4–6", pct: 50 },
  { label: "Execution", weeks: "7–12", pct: 100 },
];

export function TimelineBar({ squad }: TimelineBarProps) {
  const progress = getTimelineProgress(squad.startDate, squad.endDate);

  const startLabel = new Date(squad.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endLabel = new Date(squad.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Program Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Track */}
        <div className="relative">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-md transition-all duration-700"
            style={{ left: `calc(${progress}% - 8px)` }}
          />
        </div>

        {/* Phase Markers */}
        <div className="grid grid-cols-3 gap-3">
          {phases.map((phase) => {
            const isActive = progress >= (phase.pct === 25 ? 0 : phase.pct === 50 ? 25 : 50);
            const isComplete = progress >= phase.pct;
            return (
              <div key={phase.label} className="text-center">
                <div
                  className={`h-1.5 rounded-full mb-2 transition-colors ${
                    isComplete
                      ? "bg-primary"
                      : isActive
                      ? "bg-primary/40"
                      : "bg-muted"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    isActive ? "" : "text-muted-foreground"
                  }`}
                >
                  {phase.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Weeks {phase.weeks}
                </p>
              </div>
            );
          })}
        </div>

        {/* Date Range */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
