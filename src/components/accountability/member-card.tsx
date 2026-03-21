"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import type { Member, MilestoneStatus } from "@/lib/accountability-data";
import { getMemberProgress, getNextMilestone } from "@/lib/accountability-data";

interface MemberCardProps {
  member: Member;
  onToggleMilestone: (memberId: string, week: number) => void;
  onOpenCheckIn: (memberId: string) => void;
}

function StatusIcon({ status }: { status: MilestoneStatus }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

function StatusBadge({ status }: { status: MilestoneStatus }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-500/10">
          Done
        </Badge>
      );
    case "in-progress":
      return (
        <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 bg-yellow-500/10">
          Active
        </Badge>
      );
    default:
      return <Badge variant="outline">Upcoming</Badge>;
  }
}

export function MemberCard({
  member,
  onToggleMilestone,
  onOpenCheckIn,
}: MemberCardProps) {
  const progress = getMemberProgress(member);
  const next = getNextMilestone(member);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{member.name}</CardTitle>
              <span className="text-xs text-muted-foreground">
                {member.handle}
              </span>
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              {member.track}
            </Badge>
          </div>
        </div>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {member.goal}
        </CardDescription>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {/* Milestones */}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Checkpoints
        </p>
        <div className="space-y-1">
          {member.milestones.map((milestone) => (
            <button
              key={milestone.week}
              onClick={() => onToggleMilestone(member.id, milestone.week)}
              className="w-full text-left group cursor-pointer"
            >
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg transition-colors hover:bg-accent">
                <div className="mt-0.5 shrink-0">
                  <StatusIcon status={milestone.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      Wk {milestone.week}: {milestone.label}
                    </span>
                    <StatusBadge status={milestone.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {milestone.target}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Due:{" "}
                    {new Date(milestone.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 mt-1 opacity-0 group-hover:opacity-40 transition-opacity shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </CardContent>

      {/* Check-in Button */}
      <div className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onOpenCheckIn(member.id)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Weekly Check-in
        </Button>
      </div>
    </Card>
  );
}
