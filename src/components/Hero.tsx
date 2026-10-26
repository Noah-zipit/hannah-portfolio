"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile, hero } from "@/data/content";

const ease = [0.22, 0.8, 0.24, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax layers — back word slowest, text drifts gently
  const yWord = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 22]);

  return (
    <header ref={ref} className="grain relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* giant parallax backdrop word */}
      <motion.div
        aria-hidden
        style={{ y: yWord }}
        className="text-outline pointer-events-none absolute -top-4 left-0 w-full text-center font-display text-[18vw] leading-none font-black tracking-tight whitespace-nowrap select-none"
      >
        MARKETER
      </motion.div>

      {/* pool of cherry light behind the hero pieces */}
      <div aria-hidden className="absolute top-10 right-[2%] hidden h-[480px] w-[560px] lg:block" style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(129,1,0,0.32), transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div style={{ y: yText }} className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-line bg-coal px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-sand uppercase"
          >
            <span className="h-2 w-2 rounded-full bg-cherry" />
            {profile.tagline}
          </motion.p>

          <h1 className="font-display text-[15vw] leading-[0.92] font-black tracking-tight sm:text-7xl lg:text-[6.5rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.03, ease }}
            >
              {profile.firstName}
            </motion.span>
            <motion.span
              className="block text-rose italic"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            >
              {profile.lastName}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-sand"
          >
            {hero.introLead}<strong className="text-cream">{hero.introBold1}</strong>{hero.introMiddle}<strong className="text-cream">{hero.introBold2}</strong>{hero.introTail}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href={hero.primaryCta.href}
              className="rounded-full bg-cherry px-7 py-3 text-sm font-bold text-cream transition-transform duration-300 hover:scale-[1.04] active:scale-95"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="rounded-full border border-line px-7 py-3 text-sm font-bold text-cream transition-colors duration-300 hover:border-cherry hover:text-rose"
            >
              {hero.secondaryCta.label}
            </a>
            <span className="text-sm text-faint">{profile.location} · {profile.locationNote}</span>
          </motion.div>
        </motion.div>

      </div>
    </header>
  );
}
