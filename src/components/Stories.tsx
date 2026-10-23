"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";
import { stories, storiesSection, type Story } from "@/data/content";



function StoryBlock({ story, flip, index }: { story: Story; flip: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <div ref={ref} className={`grid items-center gap-10 lg:grid-cols-12 ${flip ? "" : ""}`}>
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Reveal>
          <p className="flex items-center gap-4">
            <span className="font-display text-6xl font-black text-cherry">{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px flex-1 bg-line" aria-hidden />
            <span className="text-xs font-bold tracking-[0.22em] text-sand uppercase">{story.client}</span>
          </p>
          <h3 className="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
            {story.headline}{" "}
            <span className="text-rose italic">{story.accent}</span>
          </h3>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-sand">{story.body}</p>
          <p className="mt-6 border-l-2 border-cherry pl-4 text-sm font-semibold tracking-wide text-cream/80">
            {story.meta}
          </p>
        </Reveal>
      </div>
      <motion.div style={{ y: yImg }} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
        <Reveal delay={0.1}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2rem]"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(129,1,0,0.28), transparent 65%)" }}
            />
            <div className="relative overflow-hidden rounded-3xl border border-line">
              <Image src={story.img} alt={story.alt} width={880} height={660} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </div>
          </div>
        </Reveal>
      </motion.div>
    </div>
  );
}

export default function Stories() {
  return (
    <section className="relative overflow-hidden bg-[#171010] py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">{storiesSection.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {storiesSection.headingLead} <span className="italic">{storiesSection.headingAccent}</span>
          </h2>
        </Reveal>

        <div className="mt-20 space-y-28">
          {stories.map((s, i) => (
            <StoryBlock key={s.client} story={s} flip={i % 2 === 1} index={i} />
          ))}
        </div>

        <Reveal>
          <figure className="mx-auto mt-32 max-w-4xl text-center">
            <blockquote className="font-display text-4xl leading-tight font-medium tracking-tight italic sm:text-6xl">
              “{storiesSection.quote.line1}
              <br />
              {storiesSection.quote.line2Before} <span className="text-rose">{storiesSection.quote.accent}</span> {storiesSection.quote.line2After}”
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold tracking-[0.18em] text-faint uppercase">
              {storiesSection.quote.cite}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
