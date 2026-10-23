"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";

const stories = [
  {
    index: "01",
    client: "Homeopathic Clinic",
    headline: "2,213 conversations.",
    accent: "Five cents each.",
    body: "Two Meta lead campaigns for a Karachi clinic turned Rs30,877 into 2,213 messaging enquiries — about Rs14 ($0.05) apiece. Hannah wrote and designed the posts, built AI-assisted content, scheduled publishing, and sent the doctor an enquiry sheet and report every single day.",
    meta: "Meta Ads · AI content · Daily reporting — Freelance, 2026",
    img: "/work/post-clinic-health.jpg",
    alt: "Women's health services post designed for the clinic's page",
    imgClass: "aspect-[4/3]",
  },
  {
    index: "02",
    client: "Austrak Immigration & Education",
    headline: "323 leads.",
    accent: "Twenty-nine cents each.",
    body: "Three Meta lead campaigns in a single month — October 2026 — produced 323 study-abroad leads for Rs26,285. In the same role she recovered the company's suspended Facebook page, restarted its publishing, and now advises students from first enquiry to visa submission.",
    meta: "Meta Ads · Content · Case processing — Full-time, Karachi",
    img: "/work/poster-visa-success.jpg",
    alt: "Skilled visa success story poster designed for Austrak Immigration",
    imgClass: "aspect-[4/3]",
  },
  {
    index: "03",
    client: "Artimization — Pinterest",
    headline: "+139% in a month.",
    accent: "3.35M → 8.02M impressions.",
    body: "As sole manager of a Pinterest account promoting multiple client websites, Hannah designed every pin, wrote search-focused titles and descriptions, and scheduled the calendar. Monthly impressions grew from 3.35M to 8.02M; engagements climbed from 134K to 324K.",
    meta: "Pinterest SEO · Pin design · Scheduling — Part-time, Remote",
    img: "/work/pin-bob.jpg",
    alt: "Pinterest pin designed by Hannah — feathered choppy bob hairstyle feature",
    imgClass: "aspect-[4/3]",
  },
];

function StoryBlock({ story, flip }: { story: (typeof stories)[number]; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <div ref={ref} className={`grid items-center gap-10 lg:grid-cols-12 ${flip ? "" : ""}`}>
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Reveal>
          <p className="flex items-center gap-4">
            <span className="font-display text-6xl font-black text-cherry">{story.index}</span>
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
              <Image src={story.img} alt={story.alt} width={880} height={660} className={`${story.imgClass} w-full object-cover`} loading="lazy" />
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
          <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">Flagship results</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Three campaigns, <span className="italic">told properly</span>
          </h2>
        </Reveal>

        <div className="mt-20 space-y-28">
          {stories.map((s, i) => (
            <StoryBlock key={s.index} story={s} flip={i % 2 === 1} />
          ))}
        </div>

        <Reveal>
          <figure className="mx-auto mt-32 max-w-4xl text-center">
            <blockquote className="font-display text-4xl leading-tight font-medium tracking-tight italic sm:text-6xl">
              “Good marketing isn’t loud.
              <br />
              It’s <span className="text-rose">five cents</span> an enquiry.”
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold tracking-[0.18em] text-faint uppercase">
              The clinic campaigns · 2026
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
