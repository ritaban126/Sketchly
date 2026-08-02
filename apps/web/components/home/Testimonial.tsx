


"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Nova Labs",
    review:
      "Sketchly completely changed how our team brainstorms. Meetings are faster, clearer, and far more collaborative.",
  },
  {
    name: "Michael Chen",
    role: "UI/UX Designer",
    company: "Pixel Studio",
    review:
      "The interface is incredibly intuitive. We replaced three different tools with Sketchly and never looked back.",
  },
  {
    name: "Emily Davis",
    role: "Startup Founder",
    company: "FlowTech",
    review:
      "Our remote team finally feels like we're working in the same room. The live collaboration is fantastic.",
  },
  {
    name: "James Wilson",
    role: "Engineering Lead",
    company: "ByteWorks",
    review:
      "Clean, fast, and reliable. Sketchly has become an essential part of our product planning workflow.",
  },
];

export default function Testimonial() {
  return (
    <section
      className="bg-[#FAF9F4] py-20 text-[#15172B]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <span
            className="inline-flex items-center rounded-full border border-[#E7E3D8] bg-white px-4 py-2 text-[12px] text-[#5B5D6E]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            💬 TESTIMONIALS
          </span>

          <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
            Loved by{" "}
            <span
              className="relative inline-block"
              style={{
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
              }}
            >
              teams
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
            everywhere
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-8 text-[#5B5D6E]">
            Thousands of designers, developers and product teams collaborate
            better every day.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-[#E7E3D8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Stars */}
              <div className="mb-5 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mb-8 text-[15px] leading-8 text-[#5B5D6E]">
                 &quot;{item.review}&quot;
              </p>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#15172B] text-sm font-bold text-white">
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <h4 className="text-[18px] font-bold tracking-tight text-[#15172B]">
                    {item.name}
                  </h4>

                  <p className="text-sm text-[#7B7D8A]">
                    {item.role} • {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}