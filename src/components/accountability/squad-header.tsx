"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, Clock, TrendingUp } from "lucide-react";
import type { Squad } from "@/lib/accountability-data";
import {
  getDaysRemaining,
  getSquadProgress,
  getCurrentPhase,
} from "@/lib/accountability-data";

interface SquadHeaderProps {
  squad: Squad;
}

export function SquadHeader({ squad }: SquadHeaderProps) {
  const daysLeft = getDaysRemaining(squad.endDate);
  const progress = getSquadProgress(squad);
  const phase = getCurrentPhase(squad.startDate, squad.endDate);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {squad.program}
            </h1>
            <p className="text-sm text-muted-foreground">
              {squad.name} &middot; {squad.checkinDay}s at {squad.checkinTime}{" "}
              via {squad.checkinFormat}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {phase}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Days Left
              </span>
            </div>
            <p className="text-2xl font-bold">{daysLeft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Squad Progress
              </span>
            </div>
            <p className="text-2xl font-bold">{progress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Members
              </span>
            </div>
            <p className="text-2xl font-bold">{squad.members.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Next Check-in
              </span>
            </div>
            <p className="text-lg font-bold">
              {squad.checkinDay} {squad.checkinTime}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
