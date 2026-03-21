"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Calendar, MessageSquare, ShieldCheck } from "lucide-react";
import type { Squad } from "@/lib/accountability-data";

interface SquadAgreementProps {
  squad: Squad;
}

export function SquadAgreement({ squad }: SquadAgreementProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Handshake className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">
            Accountability Agreement
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-accent">
          <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Weekly Check-ins</p>
            <p className="text-xs text-muted-foreground">
              {squad.checkinDay}s at {squad.checkinTime} via{" "}
              {squad.checkinFormat}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-accent">
          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Rules of Engagement</p>
            <ul className="text-xs text-muted-foreground mt-1 space-y-1">
              {squad.rules.map((rule, i) => (
                <li key={i}>&bull; {rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
