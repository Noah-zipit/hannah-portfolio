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
    <section id="work" className="relative mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="text-xs font-bold tracking-[0.22em] text-amber uppercase">Selected work</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Real campaigns, <span className="italic">real numbers</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sand">
          Posters, posts, pins and AI visuals from live client accounts — hover any piece to feel it in 3D.
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
                  ? "bg-amber text-ink"
                  : "border border-line text-sand hover:border-amber hover:text-cream"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {shown.map((item) => (
            <motion.article
              layout
              key={item.src}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.22, 0.8, 0.24, 1] }}
            >
              <TiltCard>
                <div className="relative">
                  <Image
                    src={item.src}
                    alt={`${item.title} — ${item.note}`}
                    width={640}
                    height={800}
                    className="aspect-[4/5] w-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-bold tracking-wide text-amber uppercase backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg leading-snug font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-amber">{item.client}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-sand">{item.note}</p>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
