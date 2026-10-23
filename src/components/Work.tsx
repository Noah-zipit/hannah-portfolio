"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import TiltCard from "./TiltCard";
import Reveal from "./Reveal";
import { work, type WorkItem } from "@/data/content";

const filters = ["All", "Campaigns", "Social", "AI Content", "Pinterest", "Web"] as const;

export default function Work() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const shown: WorkItem[] = active === "All" ? work : work.filter((w) => w.category === active);

  return (
    <section id="work" className="relative bg-[#0f0b0b]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(237,235,221,0.07), transparent 70%)" }} />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">The Gallery</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Works on the <span className="italic">wall</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sand">
          Every piece below ran on a live client account. The room is dark on purpose — hover a piece and the light finds it.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-9 flex flex-wrap gap-2" role="tablist" aria-label="Filter work by category">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={active === f}
              onClick={() => setActive(f)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                active === f
                  ? "bg-cherry text-cream"
                  : "border border-line text-sand hover:border-cherry hover:text-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        <AnimatePresence mode="popLayout">
          {shown.map((item, idx) => (
            <motion.article
              key={item.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 0.8, 0.24, 1] }}
              className="mb-6 break-inside-avoid"
            >
              <TiltCard className="group">
                <div className="relative">
                  <Image
                    src={item.src}
                    alt={`${item.title} — ${item.note}`}
                    width={item.w}
                    height={item.h}
                    className={
                      item.category === "Web"
                        ? "aspect-[3/4] w-full object-cover object-top"
                        : "h-auto w-full"
                    }
                    loading="lazy"
                  />
                  <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] bg-ink/40 transition-opacity duration-500 group-hover:opacity-0" />
                </div>
                <div className="border-t border-line p-5">
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.28em] text-faint uppercase">
                    <span className="inline-block h-1.5 w-1.5 bg-cherry" aria-hidden />
                    Exhibit {String(idx + 1).padStart(2, "0")} · {item.category}
                  </p>
                  <h3 className="font-display text-lg leading-snug font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-rose">{item.client}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-sand">{item.note}</p>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      </div>
    </section>
  );
}
