"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";

import {
  ArrowRight,
  Menu,
  X,
  Cloud,
  Sparkles,
  Users,
  Zap,
  Pencil,
} from "lucide-react";
import DrawableBoard from "./Drawable-board";
import { useRouter } from "next/navigation";
import { client } from "@/lib/auth-client";
import Link from "next/link";


export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const session = useStore(client.useSession);
  const user = session?.data?.user ?? null;
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = () => {
    setIsSigningOut(true);
    client.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsSigningOut(false);
          router.push("/login");
        },
        onError: () => setIsSigningOut(false),
      },
    });
  };

  return (
    <div
      className="min-h-screen w-full bg-[#FAF9F4] text-[#15172B]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      {/* NAVBAR — fixed, stays visible on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-[#E7E3D8] bg-[#FAF9F4]/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2">
            <span
              className="text-2xl leading-none text-[#15172B]"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              sketchly
            </span>
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6B57]" />
          </a>

          <div className="hidden items-center gap-8 font-mono text-[13px] tracking-tight text-[#5B5D6E] md:flex">
            <a href="#" className="transition-colors hover:text-[#15172B]">
              Features
            </a>
            <Link href="/dashboard" className="transition-colors hover:text-[#15172B]">
              Dashboard
            </Link>
            <a href="#" className="transition-colors hover:text-[#15172B]">
              Testimonials
            </a>
          </div>

    <div className="hidden items-center gap-3 md:flex">
      {user ? (
        <>
          <span className="font-mono text-[13px] text-[#5B5D6E]">
            Welcome, {user.name}
          </span>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-full bg-[#15172B] px-4 py-2 font-mono text-[13px] text-[#FAF9F4] transition-transform hover:scale-[1.03] disabled:opacity-50"
          >
            {isSigningOut ? "signing out..." : "Log out"}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => router.push("/login")}
            className="font-mono text-[13px] text-[#5B5D6E] transition-colors hover:text-[#15172B]"
          >
            log in
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="rounded-full bg-[#15172B] px-4 py-2 font-mono text-[13px] text-[#FAF9F4] transition-transform hover:scale-[1.03]"
          >
            sign up free
          </button>
        </>
      )}
    </div>

          <button
            className="p-1 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

       {menuOpen && (
          <div className="flex flex-col gap-4 border-t border-[#E7E3D8] bg-[#FAF9F4] px-5 py-5 font-mono text-sm md:hidden">
            <a href="#">our story</a>
            <a href="#">resources</a>
            <a href="#">contact us</a>
            {user ? (
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-full bg-[#15172B] px-4 py-2 text-center text-[#FAF9F4] disabled:opacity-50"
              >
                {isSigningOut ? "signing out..." : "sign out"}
              </button>
            ) : (
              <button
                onClick={() => router.push("/signup")}
                className="rounded-full bg-[#15172B] px-4 py-2 text-center text-[#FAF9F4]"
              >
                sign up free
              </button>
            )}
          </div>
        )}
      </header>

      {/* HERO */}
      <main className="relative mx-auto max-w-6xl px-5 pb-20 pt-36 sm:pt-40">
        {/* floating doodles */}
        <Cloud
          className="absolute left-2 top-24 hidden h-9 w-9 -rotate-6 text-[#B9B6A8] sm:block"
          strokeWidth={1.5}
        />
        <Sparkles
          className="absolute right-4 top-16 hidden h-7 w-7 rotate-12 text-[#FFC94A] sm:block"
          strokeWidth={1.5}
        />
        <Users
          className="absolute right-0 top-40 hidden h-6 w-6 text-[#1FADA0] md:block"
          strokeWidth={1.5}
        />

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E7E3D8] bg-white px-3 py-1 font-mono text-[11px] text-[#5B5D6E]">
            <Zap className="h-3 w-3 text-[#FF6B57]" />
            now in open beta
          </div>

          <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-tight sm:text-[3.4rem]">
            The whiteboard that{" "}
            <span
              className="relative inline-block px-1 text-[#15172B]"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              draws
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
            back
            <br className="hidden sm:block"/>
            while your team thinks out loud
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[#5B5D6E] sm:text-base">
            Sketchly turns any meeting into a shared canvas. Type, draw, and
            move ideas around in real time — no toolbar hunting, no lag,
            no &quot;can everyone see my screen.&quot;
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {/* cta section */}
        <button
          onClick={() => (user ? router.push("/dashboard") : router.push("/signup"))}
          className="group flex items-center gap-2 rounded-full bg-[#15172B] px-6 py-3 text-sm font-medium text-[#FAF9F4] transition-transform hover:scale-[1.03]"
        >
          {user ? "Go to dashboard" : "Start sketching free"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <button className="rounded-full border border-[#E7E3D8] bg-white px-6 py-3 text-sm font-medium text-[#15172B] transition-colors hover:bg-[#F0EEE5]">
              Watch 60s demo
        </button>
          </div>
          <p className="mt-4 font-mono text-[11px] text-[#9C9A8E]">
            free forever for teams under 5 · no credit card
          </p>
        </div>

        {/* WHITEBOARD MOCKUP */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-[#E7E3D8] bg-white shadow-[0_20px_60px_-20px_rgba(21,23,43,0.25)]">
            {/* browser chrome */}
            <div className="flex items-center gap-3 border-b border-[#E7E3D8] bg-[#FCFBF7] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFC94A]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1FADA0]" />
              </div>
              <div className="flex-1 rounded-md bg-white px-3 py-1 text-center font-mono text-[11px] text-[#9C9A8E] ring-1 ring-[#E7E3D8]">
                sketchly.app/board/team-standup
              </div>
              <Pencil className="h-3.5 w-3.5 text-[#9C9A8E]" />
            </div>

            <DrawableBoard/>
          </div>

          <div className="pointer-events-none absolute -bottom-5 -right-3 hidden rotate-3 rounded-lg bg-[#15172B] px-3 py-1.5 font-mono text-[11px] text-[#FAF9F4] shadow-lg sm:block">
            live · 4 people drawing
          </div>
        </div>
      </main>
    </div>
  );
}
