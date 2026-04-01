import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
import Contact from "@/components/sections/Contact";

// DevClaw custom sections
const devclawHero = {
  title: "THE AI THAT ACTUALLY DOES THINGS",
  subtitle: "Built right into your IDE — Where You Work",
  cta: "Download for macOS",
  ctaLink: "/download",
};

const devclawFeatures = {
  title: "Why DevClaw?",
  subtitle: "The AI coding assistant that works while you sleep",
  items: [
    {
      title: "Autonomous Agents",
      description: "AI agents that code, test, and deploy — independently",
      icon: "🤖",
    },
    {
      title: "Native Performance",
      description: "Built on VSCode. Full IDE power with AI that understands your codebase",
      icon: "⚡",
    },
    {
      title: "Your Data, Your Control",
      description: "Run locally or connect to your own AI. No vendor lock-in",
      icon: "🔒",
    },
    {
      title: "Open Source",
      description: "Free to use, free to modify. Built by developers, for developers",
      icon: "🚀",
    },
  ],
};

const devclawServices = {
  title: "What DevClaw Does",
  subtitle: "More than just autocomplete",
  items: [
    {
      title: "Auto-Code Review",
      description: "AI reviews your PRs, suggests improvements, catches bugs before they happen",
    },
    {
      title: "Test Generation",
      description: "Automatically writes unit tests, integration tests, and e2e tests",
    },
    {
      title: "Doc Generation",
      description: "Keeps your docs in sync with code changes automatically",
    },
    {
      title: "Deploy & Ship",
      description: "Push to production, run migrations, manage infrastructure — all from chat",
    },
  ],
};

const devclawProcess = {
  title: "How It Works",
  subtitle: "From setup to autonomous coding in minutes",
  steps: [
    {
      number: "01",
      title: "Download",
      description: "Install DevClaw on macOS, Linux, or Windows",
    },
    {
      number: "02",
      title: "Connect",
      description: "Link your AI provider (OpenAI, Anthropic, or local models)",
    },
    {
      number: "03",
      title: "Tell It What to Build",
      description: "Natural language commands. Watch your code write itself",
    },
    {
      number: "04",
      title: "Ship",
      description: "Deploy directly from the IDE. No context switching needed",
    },
  ],
};

const devclawCta = {
  title: "Ready to Code Smarter?",
  subtitle: "Join thousands of developers shipping faster with AI",
  button: "Get Started Free",
  buttonLink: "/download",
};

export default function DevClawPage() {
  return (
    <>
      <Header />
      <main>
        {/* We'll use custom components that match the style but with DevClaw branding */}
        <section className="relative bg-black min-h-screen flex items-center justify-center overflow-hidden">
          {/* Starfield background */}
          <div className="absolute inset-0 opacity-30">
            <div className="stars" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            {/* Mascot SVG */}
            <div className="mb-8">
              <svg 
                className="w-32 h-32 mx-auto animate-bounce" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="50" cy="55" rx="28" ry="25" fill="#E63946"/>
                <path d="M22 50 Q5 45 5 30 Q5 15 25 25" fill="#E63946" stroke="#C1121F" strokeWidth="2"/>
                <path d="M78 50 Q95 45 95 30 Q95 15 75 25" fill="#E63946" stroke="#C1121F" strokeWidth="2"/>
                <circle cx="38" cy="48" r="8" fill="white"/>
                <circle cx="62" cy="48" r="8" fill="white"/>
                <circle cx="40" cy="47" r="5" fill="#0d0d0d"/>
                <circle cx="64" cy="47" r="5" fill="#0d0d0d"/>
                <path d="M40 32 Q38 18 30 10" stroke="#E63946" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M60 32 Q62 18 70 10" stroke="#E63946" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              THE AI THAT <span className="text-red-500">ACTUALLY DOES THINGS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10">
              Built right into your IDE — <span className="text-white font-semibold">Where You Work</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/download" 
                className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Download for macOS
              </a>
              <a 
                href="https://github.com/bsci83/devclaw-oss" 
                target="_blank"
                className="px-8 py-4 border-2 border-gray-600 text-white font-semibold rounded-lg hover:border-white transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white text-center mb-4">Why DevClaw?</h2>
            <p className="text-xl text-gray-400 text-center mb-16">The AI coding assistant that works while you sleep</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {devclawFeatures.items.map((item, i) => (
                <div key={i} className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-red-500 transition-colors">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services / What it does */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white text-center mb-4">What DevClaw Does</h2>
            <p className="text-xl text-gray-400 text-center mb-16">More than just autocomplete</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {devclawServices.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white text-center mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 text-center mb-16">From setup to autonomous coding in minutes</p>
            
            <div className="grid md:grid-cols-4 gap-8">
              {devclawProcess.steps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="text-6xl font-bold text-red-600 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-red-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{devclawCta.title}</h2>
            <p className="text-xl text-red-100 mb-8">{devclawCta.subtitle}</p>
            <a 
              href="/download" 
              className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {devclawCta.button}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}