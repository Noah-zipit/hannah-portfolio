"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import { work, type WorkItem , workSection } from "@/data/content";

const filters = ["All", ...Array.from(new Set(work.map((w) => w.category)))] as const;

export default function Work() {
  const [active, setActive] = useState<string>("All");
  const shown: WorkItem[] = active === "All" ? work : work.filter((w) => w.category === active);

  return (
    <section id="work" className="relative bg-[#0f0b0b]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px]" style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(237,235,221,0.07), transparent 70%)" }} />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">{workSection.eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {workSection.headingLead} <span className="italic">{workSection.headingAccent}</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sand">
          {workSection.sub}
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

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {shown.map((item, idx) => (
            <motion.article
              key={item.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 0.8, 0.24, 1] }}
            >
              <div className="group h-full overflow-hidden rounded-2xl border border-line bg-coal">
                <div className="relative">
                  {/\.(mp4|webm|mov)$/i.test(item.src) ? (
                    // eslint-disable-next-line jsx-a11y/media-has-caption
                    <video
                      src={item.src}
                      controls
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="aspect-[4/5] w-full object-cover object-top"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={`${item.title} — ${item.note}`}
                      width={item.w}
                      height={item.h}
                      className="aspect-[4/5] w-full object-cover object-top"
                      loading="lazy"
                    />
                  )}
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
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      </div>
    </section>
  );
}
