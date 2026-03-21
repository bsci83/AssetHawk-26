"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { CheckIn, Member } from "@/lib/accountability-data";

interface CheckInDialogProps {
  open: boolean;
  member: Member | null;
  onClose: () => void;
  onSubmit: (checkIn: Omit<CheckIn, "id">) => void;
}

const moods = [
  { value: "fired-up" as const, label: "Fired Up", emoji: "🔥" },
  { value: "steady" as const, label: "Steady", emoji: "✊" },
  { value: "struggling" as const, label: "Struggling", emoji: "😤" },
];

export function CheckInDialog({
  open,
  member,
  onClose,
  onSubmit,
}: CheckInDialogProps) {
  const [wins, setWins] = useState("");
  const [blockers, setBlockers] = useState("");
  const [commitments, setCommitments] = useState("");
  const [mood, setMood] = useState<CheckIn["mood"]>("steady");

  function handleSubmit() {
    if (!member) return;
    onSubmit({
      memberId: member.id,
      date: new Date().toISOString().split("T")[0],
      wins,
      blockers,
      commitments,
      mood,
    });
    setWins("");
    setBlockers("");
    setCommitments("");
    setMood("steady");
    onClose();
  }

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Weekly Check-in: {member.name}</DialogTitle>
          <DialogDescription>
            Share your progress with the squad. Be honest — that&apos;s the deal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Mood */}
          <div className="space-y-2">
            <Label>How are you feeling this week?</Label>
            <div className="flex gap-2">
              {moods.map((m) => (
                <Button
                  key={m.value}
                  variant={mood === m.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMood(m.value)}
                  className="flex-1"
                >
                  {m.emoji} {m.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Wins */}
          <div className="space-y-2">
            <Label htmlFor="wins">Wins this week</Label>
            <Input
              id="wins"
              placeholder="What did you accomplish?"
              value={wins}
              onChange={(e) => setWins(e.target.value)}
            />
          </div>

          {/* Blockers */}
          <div className="space-y-2">
            <Label htmlFor="blockers">Blockers</Label>
            <Input
              id="blockers"
              placeholder="What's in your way?"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
            />
          </div>

          {/* Commitments */}
          <div className="space-y-2">
            <Label htmlFor="commitments">Commitments for next week</Label>
            <Input
              id="commitments"
              placeholder="What will you deliver by next Tuesday?"
              value={commitments}
              onChange={(e) => setCommitments(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!wins && !commitments}>
            Submit Check-in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
