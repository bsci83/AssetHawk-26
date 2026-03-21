// TOR 90 Accountability Data
// TODO: Move to Turso DB + CTRL-A API when ready

export type MilestoneStatus = "not-started" | "in-progress" | "completed";

export interface Milestone {
  week: number;
  label: string;
  target: string;
  status: MilestoneStatus;
  dueDate: string;
}

export interface CheckIn {
  id: string;
  memberId: string;
  date: string;
  wins: string;
  blockers: string;
  commitments: string;
  mood: "fired-up" | "steady" | "struggling";
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  track: string;
  goal: string;
  avatar?: string;
  milestones: Milestone[];
  checkIns: CheckIn[];
}

export interface Squad {
  id: string;
  name: string;
  program: string;
  startDate: string;
  endDate: string;
  checkinDay: string;
  checkinTime: string;
  checkinFormat: string;
  rules: string[];
  members: Member[];
}

export const squad: Squad = {
  id: "squad-1",
  name: "Squad 1",
  program: "Career Accelerator 90",
  startDate: "2026-03-07",
  endDate: "2026-06-12",
  checkinDay: "Tuesday",
  checkinTime: "6:30 PM",
  checkinFormat: "Discord",
  rules: [
    "Share weekly progress on deliverables",
    "Call each other out if we slip — no sugarcoating",
    "DM within 24 hours if you miss a deliverable",
    "No ghosting — silence isn't an option",
    "Celebrate wins together",
  ],
  members: [
    {
      id: "bifil",
      name: "Bifil",
      handle: "@bifil",
      track: "Internal / Entrepreneurial",
      goal: "Land first paying customer for CTRL-A Workspace by June 12, 2026",
      milestones: [
        {
          week: 3,
          label: "Foundation",
          target:
            "CTRL-A demo-able end-to-end. 20 beta testers invited. MedBill free review page live.",
          status: "in-progress",
          dueDate: "2026-03-28",
        },
        {
          week: 6,
          label: "Positioning",
          target:
            "Beta feedback collected, top issues fixed. Stripe billing wired. Waitlist live ($10 reserve). Landing page converting.",
          status: "not-started",
          dueDate: "2026-04-18",
        },
        {
          week: 9,
          label: "Execution",
          target:
            "50+ waitlist signups. 3+ paid $10 reserves. MedBill driving organic traffic.",
          status: "not-started",
          dueDate: "2026-05-09",
        },
        {
          week: 12,
          label: "Finish Line",
          target:
            "First paying customer on $25/mo plan. Stripe processing real money. Product stable.",
          status: "not-started",
          dueDate: "2026-06-12",
        },
      ],
      checkIns: [],
    },
    {
      id: "kam",
      name: "Kam",
      handle: "@kam",
      track: "External",
      goal: "Generate leads for LLC and gain 2 additional clients",
      milestones: [
        {
          week: 3,
          label: "Foundation",
          target:
            "Goal locked. Target market identified. Lead gen strategy defined.",
          status: "not-started",
          dueDate: "2026-03-28",
        },
        {
          week: 6,
          label: "Positioning",
          target:
            "LinkedIn optimized. Outreach system active. Pipeline building.",
          status: "not-started",
          dueDate: "2026-04-18",
        },
        {
          week: 9,
          label: "Execution",
          target:
            "Consistent lead flow. Conversations with prospects. Proposals sent.",
          status: "not-started",
          dueDate: "2026-05-09",
        },
        {
          week: 12,
          label: "Finish Line",
          target: "2 new clients signed. Revenue generating.",
          status: "not-started",
          dueDate: "2026-06-12",
        },
      ],
      checkIns: [],
    },
    {
      id: "suggs",
      name: "Suggs",
      handle: "@suggs",
      track: "TBD",
      goal: "Pending — awaiting response",
      milestones: [
        {
          week: 3,
          label: "Foundation",
          target: "TBD",
          status: "not-started",
          dueDate: "2026-03-28",
        },
        {
          week: 6,
          label: "Positioning",
          target: "TBD",
          status: "not-started",
          dueDate: "2026-04-18",
        },
        {
          week: 9,
          label: "Execution",
          target: "TBD",
          status: "not-started",
          dueDate: "2026-05-09",
        },
        {
          week: 12,
          label: "Finish Line",
          target: "TBD",
          status: "not-started",
          dueDate: "2026-06-12",
        },
      ],
      checkIns: [],
    },
  ],
};

// Helpers
export function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(
    0,
    Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
}

export function getTimelineProgress(
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const total = end.getTime() - start.getTime();
  const elapsed = Math.max(0, now.getTime() - start.getTime());
  return Math.min(100, Math.round((elapsed / total) * 100));
}

export function getMemberProgress(member: Member): number {
  const completed = member.milestones.filter(
    (m) => m.status === "completed"
  ).length;
  return member.milestones.length > 0
    ? Math.round((completed / member.milestones.length) * 100)
    : 0;
}

export function getSquadProgress(squad: Squad): number {
  const all = squad.members.flatMap((m) => m.milestones);
  const completed = all.filter((m) => m.status === "completed").length;
  return all.length > 0 ? Math.round((completed / all.length) * 100) : 0;
}

export function getCurrentPhase(
  startDate: string,
  endDate: string
): string {
  const progress = getTimelineProgress(startDate, endDate);
  if (progress < 25) return "Foundation";
  if (progress < 50) return "Positioning";
  return "Execution";
}

export function getNextMilestone(member: Member): Milestone | null {
  return (
    member.milestones.find(
      (m) => m.status === "not-started" || m.status === "in-progress"
    ) || null
  );
}
