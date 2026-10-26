import Image from "next/image";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Stories from "@/components/Stories";
import Proof from "@/components/Proof";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import TiltCard from "@/components/TiltCard";
import { profile, stats, statsExtra, statsHeroNote, roles, skillGroups, marqueeItems, navContent, aboutSection, experienceSection, skillsSection, contactSection } from "@/data/content";

function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-xl font-bold tracking-tight">
          {profile.firstName}<span className="text-rose">.</span>
        </a>
        <div className="hidden items-center gap-8 text-sm font-semibold text-sand md:flex">
          {navContent.links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-rose">{l.label}</a>
          ))}
        </div>
        <a href={navContent.ctaHref} className="rounded-full bg-cherry px-5 py-2 text-sm font-bold text-cream transition-transform duration-300 hover:scale-105 active:scale-95">
          {navContent.ctaLabel}
        </a>
      </div>
    </nav>
  );
}

function Marquee() {
  const row = [...marqueeItems, ...marqueeItems];
  return (
    <div className="overflow-hidden border-y border-line bg-cherry py-3" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 text-sm font-extrabold tracking-[0.14em] whitespace-nowrap text-cream uppercase">
            {item}
            <span className="text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stats() {
  const hero = stats[0];
  const rest = stats.slice(1);
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="font-display text-7xl font-black text-rose sm:text-8xl">
            <Counter value={hero.value} />
          </p>
          <p className="mt-3 text-xl font-bold">{hero.label}</p>
          <p className="mt-1 max-w-xs text-sand">{hero.sub} {statsHeroNote}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8">
          {rest.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <p className="font-display text-4xl font-bold sm:text-5xl">
                <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 font-bold">{s.label}</p>
              <p className="mt-1 text-sm text-faint">{s.sub}</p>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <p className="font-display text-4xl font-bold sm:text-5xl">{statsExtra.value}</p>
            <p className="mt-2 font-bold">{statsExtra.label}</p>
            <p className="mt-1 text-sm text-faint">{statsExtra.sub}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <TiltCard max={6}>
            <Image
              src={aboutSection.image}
              alt={aboutSection.imageAlt}
              width={720}
              height={560}
              className="aspect-[5/4] w-full object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <p className="font-display text-lg font-semibold">{aboutSection.cardTitle}</p>
              <p className="mt-1 text-sm text-sand">{aboutSection.cardText}</p>
            </div>
          </TiltCard>
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">{aboutSection.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {aboutSection.headingLead} <span className="italic">{aboutSection.headingAccent}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand">{profile.about}</p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-coal p-5">
                <p className="font-bold text-rose">{aboutSection.currentlyTitle}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-sand">{aboutSection.currentlyText}</p>
              </div>
              <div className="rounded-2xl border border-line bg-coal p-5">
                <p className="font-bold text-rose">{aboutSection.educationTitle}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-sand">{aboutSection.educationText}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal>
        <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">{experienceSection.eyebrow}</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {experienceSection.headingLead} <span className="italic">{experienceSection.headingAccent}</span>
        </h2>
      </Reveal>

      <div className="relative mt-14">
        <div aria-hidden className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-1/2" />
        <div className="space-y-12">
          {roles.map((role, i) => (
            <Reveal key={role.company} delay={0.05}>
              <div className={`relative md:grid md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
                <span aria-hidden className="absolute top-2 left-0 h-[15px] w-[15px] rounded-full border-2 border-cherry bg-ink md:left-1/2 md:-translate-x-1/2" />
                <div className="pl-10 md:pl-0 md:[direction:ltr]">
                  <div className="rounded-3xl border border-line bg-coal p-6 transition-colors duration-300 hover:border-cherry/60 sm:p-7">
                    <p className="text-xs font-bold tracking-[0.16em] text-rose uppercase">{role.period}</p>
                    <h3 className="mt-2 font-display text-2xl leading-snug font-semibold">{role.title}</h3>
                    <p className="mt-1 font-semibold text-sand">{role.company}</p>
                    <p className="text-sm text-faint">{role.type}</p>
                    <ul className="mt-4 space-y-2.5">
                      {role.points.map((point) => (
                        <li key={point.slice(0, 32)} className="flex gap-2.5 text-sm leading-relaxed text-sand">
                          <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-cherry" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div aria-hidden className="hidden md:block" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="border-y border-line bg-coal py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">{skillsSection.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {skillsSection.headingLead} <span className="italic">{skillsSection.headingAccent}</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08} className="h-full">
              <div className={`h-full rounded-3xl border border-line bg-panel p-7 ${i === 0 ? "md:-translate-y-3" : ""}`}>
                <h3 className="font-display text-xl font-semibold">{group.title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-line bg-ink px-3.5 py-1.5 text-sm font-medium text-sand transition-colors duration-300 hover:border-cherry hover:text-cream">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="grain relative overflow-hidden border-t border-line bg-coal">
      <div className="relative mx-auto max-w-7xl px-6 py-24 text-center">
        <Reveal>
          <p className="text-xs font-bold tracking-[0.22em] text-rose uppercase">{contactSection.eyebrow}</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-tight font-bold tracking-tight sm:text-6xl">
            {contactSection.headingLead} <span className="text-rose italic">{contactSection.headingAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sand">
            {contactSection.text}
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href={`mailto:${profile.email}`} className="rounded-full bg-cherry px-7 py-3.5 text-sm font-bold text-cream transition-transform duration-300 hover:scale-105 active:scale-95">
              {profile.email}
            </a>
            <a href={profile.phoneHref} className="rounded-full border border-line px-7 py-3.5 text-sm font-bold transition-colors hover:border-cherry hover:text-rose">
              {profile.phone}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-line px-7 py-3.5 text-sm font-bold transition-colors hover:border-cherry hover:text-rose">
              {contactSection.linkedinLabel}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-16 text-sm text-faint">
            {contactSection.footerLine}
          </p>
        </Reveal>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main id="top">
      <Nav />
      <Hero />
      <Marquee />
      <Stats />
      <Stories />
      <About />
      <Work />
      <div id="results">
        <Proof />
      </div>
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
