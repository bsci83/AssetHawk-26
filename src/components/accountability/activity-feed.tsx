"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import type { Squad, CheckIn } from "@/lib/accountability-data";

interface ActivityFeedProps {
  squad: Squad;
}

function getMoodEmoji(mood: CheckIn["mood"]) {
  switch (mood) {
    case "fired-up":
      return "🔥";
    case "steady":
      return "✊";
    case "struggling":
      return "😤";
  }
}

export function ActivityFeed({ squad }: ActivityFeedProps) {
  // Collect all check-ins across members, sorted by date desc
  const allCheckIns = squad.members
    .flatMap((m) =>
      m.checkIns.map((c) => ({
        ...c,
        memberName: m.name,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Also track milestone changes as events
  const milestoneEvents = squad.members.flatMap((m) =>
    m.milestones
      .filter((ms) => ms.status === "completed")
      .map((ms) => ({
        type: "milestone" as const,
        memberName: m.name,
        label: `Completed Week ${ms.week}: ${ms.label}`,
        date: ms.dueDate,
      }))
  );

  const hasActivity = allCheckIns.length > 0 || milestoneEvents.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Squad Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!hasActivity ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">
              No activity yet. Submit your first check-in to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {milestoneEvents.map((event, i) => (
              <div key={`ms-${i}`} className="flex items-start gap-3">
                <Badge
                  variant="outline"
                  className="mt-0.5 text-green-500 border-green-500/30 shrink-0"
                >
                  ✓
                </Badge>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{event.memberName}</span>{" "}
                    {event.label}
                  </p>
                </div>
              </div>
            ))}
            {allCheckIns.map((checkIn, i) => (
              <div key={`ci-${i}`} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  {getMoodEmoji(checkIn.mood)}
                </Badge>
                <div className="space-y-0.5">
                  <p className="text-sm">
                    <span className="font-medium">{checkIn.memberName}</span>{" "}
                    checked in
                  </p>
                  {checkIn.wins && (
                    <p className="text-xs text-muted-foreground">
                      Win: {checkIn.wins}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60">
                    {new Date(checkIn.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
