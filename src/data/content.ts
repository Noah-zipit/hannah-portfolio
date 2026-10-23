// Single source of truth: src/content/site.json — every word and image on the
// site lives there and is editable from /admin. Components import from here.
import site from "@/content/site.json";

export type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  hero?: boolean;
};

export type WorkItem = {
  src: string;
  w: number;
  h: number;
  title: string;
  client: string;
  category: string;
  note: string;
};

export type Role = {
  company: string;
  title: string;
  period: string;
  type: string;
  points: string[];
};

export type Story = {
  client: string;
  headline: string;
  accent: string;
  body: string;
  meta: string;
  img: string;
  alt: string;
};

export type Package = {
  name: string;
  price: string;
  tag: string;
  line: string;
  features: string[];
  primary?: boolean;
};

const c = site as unknown as {
  seo: typeof site.seo;
  profile: typeof site.profile;
  nav: typeof site.nav;
  hero: typeof site.hero;
  marquee: string[];
  stats: { heroNote: string; extra: { value: string; label: string; sub: string }; items: Stat[] };
  stories: { eyebrow: string; headingLead: string; headingAccent: string; items: Story[]; quote: { line1: string; line2Before: string; accent: string; line2After: string; cite: string } };
  about: Record<string, string>;
  workSection: Record<string, string>;
  work: WorkItem[];
  proofSection: Record<string, string>;
  proof: { title: string; metric: string; detail: string; before: string; after: string }[];
  reports: { src: string; title: string; detail: string }[];
  experience: Record<string, string>;
  roles: Role[];
  skills: Record<string, string>;
  skillGroups: { title: string; items: string[] }[];
  packagesSection: Record<string, string>;
  packages: Package[];
  contact: Record<string, string>;
};

export const seo = c.seo;
export const profile = c.profile;
export const navContent = c.nav;
export const hero = c.hero;
export const marqueeItems = c.marquee;
export const stats: Stat[] = c.stats.items;
export const statsExtra = c.stats.extra;
export const statsHeroNote = c.stats.heroNote;
export const storiesSection = c.stories;
export const stories: Story[] = c.stories.items;
export const aboutSection = c.about;
export const workSection = c.workSection;
export const work: WorkItem[] = c.work;
export const proofSection = c.proofSection;
export const proof = c.proof;
export const reports = c.reports;
export const experienceSection = c.experience;
export const roles: Role[] = c.roles;
export const skillsSection = c.skills;
export const skillGroups = c.skillGroups;
export const packagesSection = c.packagesSection;
export const packages: Package[] = c.packages;
export const contactSection = c.contact;
