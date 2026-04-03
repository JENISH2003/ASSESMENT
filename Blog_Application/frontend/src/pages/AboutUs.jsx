import {
  Target,
  Users,
  BookOpen,
  Code,
  Briefcase,
  Lightbulb,
  MonitorPlay,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background Orbs configured to work seamlessly in both light & dark tech modes */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 1. Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center text-center animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-primary font-medium text-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
          Discover Our Blueprint
        </div>

        <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight mb-6">
          Elevate Your <span className="text-gradient">Knowledge.</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl font-light">
          We are building a robust platform where technical insight meets
          elegant design, inspiring continuous growth for modern developers and
          creators.
        </p>
      </section>

      {/* 2. Our Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold tracking-tight text-foreground">
              Our Origin Story
            </h2>
            <div className="w-16 h-1.5 bg-primary/60 rounded-full"></div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              What started as a quiet corner of the internet to document coding
              paradigms has evolved into a thriving, unified platform. We
              recognized that true learning isn't just about reading
              documentation—it's about engaging with a community that shares
              your exact passion for innovation.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, our blog serves thousands of readers worldwide. We provide
              a space for deep technical dives, startup strategies, and design
              thinking. We believe everyone has a unique journey worth sharing.
            </p>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden glass p-2 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Our collaborative Team"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            {/* Soft decorative accent behind image */}
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* 3. Our Mission Section */}
      <section className="py-24 relative z-10 w-full mt-10">
        <div className="absolute inset-0 bg-secondary/30 border-y border-border/50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl font-heading font-bold tracking-tight mb-4">
              Core Principles
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The unshakeable values that dictate everything we architect and
              publish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Uncompromised Quality",
                desc: "Every article is rigorously reviewed to ensure it's actionable, accurate, and accessible.",
              },
              {
                icon: Users,
                title: "Inclusive Community",
                desc: "A safe haven fostering diverse voices, bold ideas, and collaborative mentorship.",
              },
              {
                icon: Target,
                title: "Forward Thinking",
                desc: "Consistently identifying and exploring the next major shift in technology paradigms.",
              },
            ].map((val, i) => (
              <div
                key={i}
                className="glass-card p-10 rounded-3xl flex flex-col items-start group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                  <val.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">
                  {val.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What We Offer Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mt-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl font-heading font-bold tracking-tight mb-4">
            What We Cover
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master your craft across the entire spectrum of digital creation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Code,
              title: "Engineering",
              desc: "Robust architectures, system design, and modern frameworks.",
            },
            {
              icon: MonitorPlay,
              title: "Technology",
              desc: "Hardware advancements, AI tooling, and industry news.",
            },
            {
              icon: Briefcase,
              title: "Business",
              desc: "Scaling startups, effective leadership, and market strategy.",
            },
            {
              icon: Lightbulb,
              title: "Design UI/UX",
              desc: "Pixel-perfect interfaces, accessibility, and user research.",
            },
          ].map((topic, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-6 text-foreground">
                <topic.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">
                {topic.title}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                {topic.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Team Section */}
      <section className="py-24 w-full relative z-10 mt-10">
        <div className="absolute inset-0 bg-secondary/20 border-y border-border/50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-heading font-bold tracking-tight mb-4">
              Meet The Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate creators bridging the gap between complexity and
              clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                name: "Alex Carter",
                role: "Editor in Chief",
                img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
                bio: "Former principal engineer turned technical author overseeing all editorial guidelines.",
              },
              {
                name: "Sarah Jenkins",
                role: "Design Lead",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
                bio: "Award-winning product designer creating fluid and highly accessible web experiences.",
              },
              {
                name: "Michael Chen",
                role: "Platform Architect",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=400&h=400&q=80",
                bio: "Distributed systems expert leading our core infrastructure initiatives.",
              },
            ].map((member, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 bg-secondary ring-4 ring-background shadow-lg group-hover:ring-primary/40 transition-all duration-300">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-semibold text-sm uppercase mb-4 tracking-wider">
                  {member.role}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call To Action Section */}
      <section className="py-24 px-6 mb-12 relative z-10">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          {/* Subtle accent inside the CTA */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -z-10 rounded-full"></div>

          <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Dive into thousands of meticulously curated articles, share your own
            thoughts, and connect with professionals from around the globe.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:-translate-y-1 text-lg"
          >
            Start Reading <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
