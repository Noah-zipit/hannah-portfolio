"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "@/data/content";

const ease = [0.22, 0.8, 0.24, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax layers — back word slowest, images at different speeds
  const yWord = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yImgA = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const yImgB = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yImgC = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <header ref={ref} className="grain relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* giant parallax backdrop word */}
      <motion.div
        aria-hidden
        style={{ y: yWord }}
        className="text-outline pointer-events-none absolute -top-4 left-0 w-full text-center font-display text-[24vw] leading-none font-black tracking-tight whitespace-nowrap select-none"
      >
        MARKETER
      </motion.div>

      {/* flat amber disc, solid colour shape */}
      <div aria-hidden className="absolute top-24 right-[8%] hidden h-72 w-72 rounded-full bg-amber/15 lg:block" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12">
        <motion.div style={{ y: yText }} className="lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-coal px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-sand uppercase"
          >
            <span className="h-2 w-2 rounded-full bg-amber" />
            {profile.tagline}
          </motion.p>

          <h1 className="font-display text-[15vw] leading-[0.92] font-black tracking-tight sm:text-7xl lg:text-[6.5rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
            >
              Hannah
            </motion.span>
            <motion.span
              className="block text-amber italic"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
            >
              Iqbal
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-sand"
          >
            I turn small ad budgets into real enquiries — <strong className="text-cream">323 leads at $0.29 each</strong> for a
            study-abroad consultancy, <strong className="text-cream">2,213 clinic conversations at $0.05 each</strong>, and a
            Pinterest account grown from 3.35M to 8.02M impressions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="rounded-full bg-amber px-7 py-3 text-sm font-bold text-ink transition-transform duration-300 hover:scale-[1.04] active:scale-95"
            >
              See the work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-line px-7 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:border-amber hover:text-amber"
            >
              Work with me
            </a>
            <span className="text-sm text-faint">{profile.location} · Working worldwide</span>
          </motion.div>
        </motion.div>

        {/* layered parallax image stack */}
        <div className="relative h-[480px] sm:h-[540px] lg:col-span-5">
          <motion.div
            style={{ y: yImgB, ["--rot" as string]: "-5deg" }}
            className="drift absolute top-0 right-2 w-52 sm:w-60"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
          >
            <div className="overflow-hidden rounded-2xl border border-line" style={{ transform: "rotate(-5deg)" }}>
              <Image src="/work/ai-cinematic.jpg" alt="AI-generated editorial portrait from Hannah's portrait series" width={480} height={640} className="aspect-[3/4] w-full object-cover" priority />
            </div>
            <p className="mt-2 text-right text-xs text-faint">AI content direction</p>
          </motion.div>

          <motion.div
            style={{ y: yImgA, ["--rot" as string]: "4deg" }}
            className="drift absolute bottom-16 left-0 w-48 [animation-delay:1.2s] sm:w-56"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
          >
            <div className="overflow-hidden rounded-2xl border border-line" style={{ transform: "rotate(4deg)" }}>
              <Image src="/work/poster-career-connect.jpg" alt="Career Connect '26 event poster designed for Austrak Immigration" width={480} height={600} className="aspect-[4/5] w-full object-cover" priority />
            </div>
            <p className="mt-2 text-xs text-faint">Campaign design — Austrak</p>
          </motion.div>

          <motion.div
            style={{ y: yImgC }}
            className="absolute right-6 bottom-0 hidden w-40 sm:block"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
          >
            <div className="rounded-2xl border border-amber/50 bg-panel p-4">
              <p className="font-display text-3xl font-bold text-amber">$0.05</p>
              <p className="mt-1 text-xs leading-snug text-sand">per clinic enquiry, across 2,213 conversations</p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
