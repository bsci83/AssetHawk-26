import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Circle, CheckCircle2 } from "lucide-react";

const tasks = [
  { id: 1, title: "Fix TypeScript errors in YGB", project: "YourGreenBook", status: "todo", priority: "high" },
  { id: 2, title: "Deploy SlateFusion v2.1", project: "SlateFusion", status: "in-progress", priority: "high" },
  { id: 3, title: "Add QR scanning to ContainerX", project: "ContainerX", status: "todo", priority: "medium" },
  { id: 4, title: "Update daily_log schema", project: "ctrl-a", status: "done", priority: "medium" },
];

export default function TasksPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Track and manage your tasks.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>4 tasks total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {task.status === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : task.status === "in-progress" ? (
                    <Circle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.project}</p>
                  </div>
                  <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
