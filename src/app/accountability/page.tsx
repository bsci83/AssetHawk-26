"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SquadHeader } from "@/components/accountability/squad-header";
import { TimelineBar } from "@/components/accountability/timeline-bar";
import { MemberCard } from "@/components/accountability/member-card";
import { CheckInDialog } from "@/components/accountability/check-in-dialog";
import { SquadAgreement } from "@/components/accountability/squad-agreement";
import { ActivityFeed } from "@/components/accountability/activity-feed";
import {
  squad as initialSquad,
  type Squad,
  type CheckIn,
  type MilestoneStatus,
} from "@/lib/accountability-data";

export default function AccountabilityPage() {
  const [squad, setSquad] = useState<Squad>(() => {
    if (typeof window === "undefined") return initialSquad;
    const saved = localStorage.getItem("tor90-squad");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* fall through */
      }
    }
    return initialSquad;
  });

  const [checkInMemberId, setCheckInMemberId] = useState<string | null>(null);

  const persist = useCallback((updated: Squad) => {
    setSquad(updated);
    localStorage.setItem("tor90-squad", JSON.stringify(updated));
  }, []);

  const toggleMilestone = useCallback(
    (memberId: string, week: number) => {
      const updated = {
        ...squad,
        members: squad.members.map((member) => {
          if (member.id !== memberId) return member;
          return {
            ...member,
            milestones: member.milestones.map((m) => {
              if (m.week !== week) return m;
              const cycle: Record<MilestoneStatus, MilestoneStatus> = {
                "not-started": "in-progress",
                "in-progress": "completed",
                completed: "not-started",
              };
              return { ...m, status: cycle[m.status] };
            }),
          };
        }),
      };
      persist(updated);
    },
    [squad, persist]
  );

  const submitCheckIn = useCallback(
    (checkIn: Omit<CheckIn, "id">) => {
      const updated = {
        ...squad,
        members: squad.members.map((member) => {
          if (member.id !== checkIn.memberId) return member;
          return {
            ...member,
            checkIns: [
              ...member.checkIns,
              { ...checkIn, id: crypto.randomUUID() },
            ],
          };
        }),
      };
      persist(updated);
    },
    [squad, persist]
  );

  const checkInMember =
    checkInMemberId
      ? squad.members.find((m) => m.id === checkInMemberId) ?? null
      : null;

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        {/* Header Stats */}
        <SquadHeader squad={squad} />

        {/* Timeline */}
        <TimelineBar squad={squad} />

        {/* Member Cards */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Squad Members
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {squad.members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onToggleMilestone={toggleMilestone}
                onOpenCheckIn={setCheckInMemberId}
              />
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <ActivityFeed squad={squad} />
          <SquadAgreement squad={squad} />
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-muted-foreground border-t">
          <p>Career Accelerator 90 &middot; Antoine Wade</p>
          <p className="mt-1 opacity-60">
            AI is your co-pilot. You&apos;re still the one flying.
          </p>
          {/* TODO: CTRL-A API integration — AI coaching, automated check-in reminders, progress insights */}
        </footer>

        {/* Check-in Dialog */}
        <CheckInDialog
          open={!!checkInMemberId}
          member={checkInMember}
          onClose={() => setCheckInMemberId(null)}
          onSubmit={submitCheckIn}
        />
      </div>
    </AppShell>
  );
}
