"use client";

import { ArrowUpRight } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  const socials = [
    {
      icon: FaGithub,
      href: "https://github.com",
      label: "GitHub",
    },
    {
      icon: FaXTwitter,
      href: "https://x.com",
      label: "X",
    },
    {
      icon: FaLinkedin,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://instagram.com",
      label: "Instagram",
    },
  ];

  return (
    <footer
      className="bg-[#15172B] text-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top */}
        <div className="flex flex-col items-start justify-between gap-12 border-b border-white/10 pb-12 md:flex-row">
          {/* Brand */}
          <div className="max-w-sm">
            <h2
              className="text-3xl text-white"
              style={{
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
              }}
            >
              sketchly
            </h2>

            <p className="mt-4 leading-7 text-white/70">
              The collaborative whiteboard that helps teams brainstorm,
              organize ideas, and turn creativity into action.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <h4 className="mb-4 font-semibold text-white">Product</h4>

              <ul className="space-y-3 text-white/70">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Resources</h4>

              <ul className="space-y-3 text-white/70">
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-white">Company</h4>

              <ul className="space-y-3 text-white/70">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p
            className="text-sm text-white/60"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            © {new Date().getFullYear()} Sketchly. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#15172B]"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          <a
            href="#"
            className="group flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
          >
            Back to top
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}