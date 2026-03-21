import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BarChart3, MessageSquare, Mail, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">SageAAA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            The Smart Business Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered tools to manage projects, tasks, CRM, and communication. 
            One platform, infinite possibilities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg">Launch Dashboard</Button>
            </Link>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Smart Dashboard</CardTitle>
                <CardDescription>Real-time insights and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                Track projects, tasks, and KPIs in one place. 
                AI-powered insights help you make better decisions.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>AI Chatbot</CardTitle>
                <CardDescription>Your AI business assistant</CardDescription>
              </CardHeader>
              <CardContent>
                Powered by ctrl-a AI agents. Ask questions, 
                get insights, automate tasks.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>CRM</CardTitle>
                <CardDescription>Manage relationships effortlessly</CardDescription>
              </CardHeader>
              <CardContent>
                Track leads, contacts, and communications. 
                Never lose a customer again.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Automation</CardTitle>
                <CardDescription>Let AI do the heavy lifting</CardDescription>
              </CardHeader>
              <CardContent>
                Automated workflows, smart reminders, 
                and AI-generated content.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Mail className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Email Integration</CardTitle>
                <CardDescription>Professional communication</CardDescription>
              </CardHeader>
              <CardContent>
                Built-in email with AI assistance. 
                Automated follow-ups and templates.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Secure</CardTitle>
                <CardDescription>Enterprise-grade security</CardDescription>
              </CardHeader>
              <CardContent>
                Firebase Auth, encrypted data, 
                and role-based access control.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join the future of business management.
          </p>
          <Link href="/dashboard">
            <Button size="lg">Launch Dashboard</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 SageAAA. Built with AI.</p>
        </div>
      </footer>
    </div>
  );
}
