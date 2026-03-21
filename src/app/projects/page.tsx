import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Plus, MoreVertical } from "lucide-react";

const projects = [
  { id: 1, name: "YourGreenBook", status: "active", tasks: 12, color: "bg-green-500" },
  { id: 2, name: "SlateFusion", status: "active", tasks: 8, color: "bg-blue-500" },
  { id: 3, name: "ContainerX", status: "development", tasks: 15, color: "bg-yellow-500" },
  { id: 4, name: "ctrl-a Workspace", status: "active", tasks: 6, color: "bg-purple-500" },
];

export default function ProjectsPage() {
  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your projects and track progress.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90">
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${project.color}`} />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={project.status === "active" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {project.tasks} tasks
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
