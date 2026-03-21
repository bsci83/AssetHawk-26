"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Settings, User, Palette, Database, Bell } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{user?.displayName?.split(" ").map(n => n[0]).join("") || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.displayName || "Not signed in"}</p>
                <p className="text-sm text-muted-foreground">{user?.email || "Sign in to see email"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Integrations</CardTitle>
            </div>
            <CardDescription>Connect to external services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Turso Database</p>
                <p className="text-sm text-muted-foreground">agents-bifill Turso DB</p>
              </div>
              <Badge variant="secondary">Connected</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Firebase Auth</p>
                <p className="text-sm text-muted-foreground">Authentication service</p>
              </div>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? "Active" : "Not configured"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Resend</p>
                <p className="text-sm text-muted-foreground">Email service</p>
              </div>
              <Badge variant="outline">Not configured</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Agent Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Agent Connection</CardTitle>
            </div>
            <CardDescription>Connect AI agents to your dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">ctrl-a Agent</p>
                <Badge>Ready</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your ctrl-a AI employees to power the chat and automate tasks.
              </p>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Ralph (Dev Agent)</p>
                <Badge>Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Autonomous developer running daily builds and fixes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
