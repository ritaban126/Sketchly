
"use client";

import {
  Rocket,
  Sparkles,
  Users,
  LayoutDashboard,
  ShieldCheck,
  Palette,
  BarChart3,
  Workflow,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Product Strategy",
    description:
      "Plan roadmaps, prioritize ideas, and turn customer feedback into meaningful features.",
    icon: Rocket,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Team Collaboration",
    description:
      "Keep everyone aligned with discussions, mentions, tasks, and shared workspaces.",
    icon: Users,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "Beautiful UI Design",
    description:
      "Create wireframes, user flows, and polished interfaces with collaborative editing.",
    icon: Palette,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Analytics",
    description:
      "Track engagement, project progress, and team productivity in real time.",
    icon: BarChart3,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Automation",
    description:
      "Reduce repetitive work with smart workflows and automated actions.",
    icon: Workflow,
    color: "from-emerald-500 to-green-500",
  },
  {
    title: "Workspace",
    description:
      "Organize documents, tasks, assets, and projects from one central hub.",
    icon: LayoutDashboard,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Security",
    description:
      "Enterprise-grade authentication, permissions, backups, and encryption.",
    icon: ShieldCheck,
    color: "from-teal-500 to-emerald-500",
  },
  {
    title: "AI Assistant",
    description:
      "Generate ideas, summarize meetings, and accelerate your daily workflow.",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
];

export default function Feature() {
  return (
    <section
      className="relative overflow-hidden bg-white py-28 text-[#15172B]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-pink-200 blur-[120px] opacity-30" />
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-blue-200 blur-[120px] opacity-30" />
      </div>

      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-[#E7E3D8] bg-white px-4 py-2 text-[12px] text-[#5B5D6E]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <Zap className="h-3.5 w-3.5 text-[#FF6B57]" />
            POWERFUL FEATURES
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Everything your team needs
            <br />
            to{" "}
            <span
              className="relative inline-block"
              style={{
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
              }}
            >
              create
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 Q25,1 50,5 T100,4"
                  fill="none"
                  stroke="#FFC94A"
                  strokeWidth="6"
                />
              </svg>
            </span>{" "}
            together.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5B5D6E]">
            A beautifully crafted workspace designed to simplify planning,
            collaboration, design, automation and growth.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-[#ECE8DD] bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-2xl"
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-pink-500/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute inset-px rounded-3xl bg-white" />
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br ${feature.color} text-white shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold tracking-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[15px] leading-7 text-[#5B5D6E]">
                    {feature.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-8 h-1 w-12 rounded-full bg-linear-to-r from-[#15172B] to-[#FF4FA3] transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}