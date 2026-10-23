"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import { proof, reports } from "@/data/content";

export default function Proof() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ySlow = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const yFast = useTransform(scrollYProgress, [0, 1], [70, -70]);

  return (
    <section ref={ref} className="relative overflow-hidden border-y border-line bg-coal py-24">
      <div
        aria-hidden
        className="text-outline pointer-events-none absolute top-6 left-0 w-full text-center font-display text-[16vw] leading-none font-black whitespace-nowrap select-none"
      >
        RESULTS
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.22em] text-amber uppercase">Proof, not promises</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Before → <span className="italic">after</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {proof.map((p, i) => (
            <motion.div key={p.title} style={{ y: i === 0 ? ySlow : yFast }}>
              <Reveal delay={i * 0.1}>
                <div className="rounded-3xl border border-line bg-panel p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
                    <span className="font-display text-3xl font-bold text-amber">{p.metric}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-sand">{p.detail}</p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <figure>
                      <div className="overflow-hidden rounded-xl border border-line">
                        <Image src={p.before} alt={`${p.title} dashboard before Hannah's work`} width={520} height={340} className="aspect-[3/2] w-full object-cover object-top" loading="lazy" />
                      </div>
                      <figcaption className="mt-2 text-xs font-semibold tracking-wide text-faint uppercase">Before</figcaption>
                    </figure>
                    <figure>
                      <div className="overflow-hidden rounded-xl border border-amber/60">
                        <Image src={p.after} alt={`${p.title} dashboard after Hannah's work`} width={520} height={340} className="aspect-[3/2] w-full object-cover object-top" loading="lazy" />
                      </div>
                      <figcaption className="mt-2 text-xs font-semibold tracking-wide text-amber uppercase">After</figcaption>
                    </figure>
                  </div>
                </div>
              </Reveal>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.15}>
          <h3 className="mt-16 font-display text-2xl font-semibold">From the Ads Manager</h3>
          <p className="mt-2 max-w-2xl text-sm text-sand">
            Campaign reports from live accounts — the spreadsheets behind the headline numbers.
          </p>
        </Reveal>
        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          {reports.map((r, i) => (
            <Reveal key={r.src} delay={i * 0.08}>
              <TiltCard max={6}>
                <Image src={r.src} alt={`${r.title} — ${r.detail}`} width={560} height={380} className="aspect-[3/2] w-full object-cover object-top" loading="lazy" />
                <div className="p-4">
                  <p className="font-semibold">{r.title}</p>
                  <p className="mt-0.5 text-sm text-amber">{r.detail}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
