"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Sparkles } from "lucide-react";
import { useState } from "react";

const messages = [
  { id: 1, role: "user", content: "Show me my active projects", timestamp: "10:30 AM" },
  { id: 2, role: "assistant", content: "You have 4 active projects: YourGreenBook, SlateFusion, ContainerX, and ctrl-a Workspace. Would you like details on any?", timestamp: "10:30 AM" },
  { id: 3, role: "user", content: "What's the status of SlateFusion?", timestamp: "10:32 AM" },
  { id: 4, role: "assistant", content: "SlateFusion is in active development. Current version: 2.1. Tasks: 8 total, 5 in progress, 3 completed.", timestamp: "10:32 AM" },
];

export default function ChatPage() {
  const [input, setInput] = useState("");

  return (
    <AppShell>
      <div className="p-6 h-[calc(100vh-6rem)]">
        <Card className="h-full flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Powered by ctrl-a</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setInput(""); }}>
              <Input
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
