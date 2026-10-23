export const profile = {
  name: "Hannah Iqbal",
  firstName: "Hannah",
  role: "Digital Marketer",
  tagline: "Meta Ads · Short-Form Video · AI Content",
  location: "Karachi, Pakistan",
  email: "hannahiqbal01@gmail.com",
  phone: "+92 308 3034353",
  phoneHref: "tel:+923083034353",
  linkedin: "https://www.linkedin.com/in/hannah-iqbal",
  about:
    "Digital marketer combining Meta Ads, short-form video and AI tools to generate leads at unusually low cost — 323 form leads at about $0.29 each for a study-abroad consultancy, and 2,213 messaging enquiries at about $0.05 each for a clinic. Background in international sales and HR recruitment; currently developing deeper skills in AI automation and marketing strategy.",
};

export type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
  hero?: boolean;
};

export const stats: Stat[] = [
  { value: 2213, label: "Messaging enquiries", sub: "Homeopathic clinic campaigns, Mar–Sep 2026", hero: true },
  { value: 0.05, decimals: 2, prefix: "$", label: "Cost per enquiry", sub: "Rs14 average across two Meta campaigns" },
  { value: 323, label: "Study-abroad leads", sub: "Three Meta campaigns in a single month" },
  { value: 0.29, decimals: 2, prefix: "$", label: "Cost per lead", sub: "Rs81 average on Rs26,285 spend" },
  { value: 8.02, decimals: 2, suffix: "M", label: "Pinterest impressions", sub: "Up from 3.35M — a 139% jump in one month" },
  { value: 58.1, decimals: 1, suffix: "K", label: "YouTube views in 90 days", sub: "SEO-led growth on a family-run channel" },
];

export type WorkItem = {
  src: string;
  title: string;
  client: string;
  category: "Campaigns" | "Social" | "AI Content" | "Pinterest" | "Web";
  note: string;
};

export const work: WorkItem[] = [
  { src: "/work/poster-career-connect.jpg", title: "Career Connect ’26", client: "Austrak Immigration", category: "Campaigns", note: "Event poster for UBIT, University of Karachi" },
  { src: "/work/poster-visa-success.jpg", title: "Skilled Visa Success Story", client: "Austrak Immigration", category: "Campaigns", note: "AI-assisted success-story creative" },
  { src: "/work/poster-germany.jpg", title: "Germany Opportunity Card", client: "Austrak Immigration", category: "Campaigns", note: "Consultancy campaign poster" },
  { src: "/work/poster-meet-greet.jpg", title: "Meet & Greet — Study Abroad", client: "Austrak Immigration", category: "Campaigns", note: "Event creative and promotion" },
  { src: "/work/post-it-1.jpg", title: "Study in Italy", client: "Study Abroad", category: "Social", note: "Social post design" },
  { src: "/work/post-study.jpg", title: "Study Abroad Creative", client: "Superior Consulting", category: "Social", note: "Feed post design and copy" },
  { src: "/work/post-poster.jpg", title: "Campaign Poster", client: "Superior Consulting", category: "Social", note: "Promotional poster design" },
  { src: "/work/post-clinic-health.jpg", title: "Women’s Health Services", client: "Homeopathic Clinic", category: "Social", note: "Service post for the clinic’s page" },
  { src: "/work/post-study-abroad.jpg", title: "Admissions Open", client: "Study Abroad", category: "Social", note: "Enrolment campaign creative" },
  { src: "/work/case-offer-letter.jpg", title: "Offer Letter — Pakistan to Finland", client: "Superior Consulting", category: "Social", note: "Results post: client admitted to SEAMK, Finland" },
  { src: "/work/ai-cinematic.jpg", title: "Golden Hour", client: "AI Portrait Series", category: "AI Content", note: "AI-generated editorial portrait" },
  { src: "/work/ai-beauty.jpg", title: "Beauty Editorial", client: "AI Portrait Series", category: "AI Content", note: "AI-generated beauty visual" },
  { src: "/work/ai-bridal.jpg", title: "Bridal Editorial", client: "AI Portrait Series", category: "AI Content", note: "AI-generated bridal portrait" },
  { src: "/work/ai-fashion-man.jpg", title: "Menswear Editorial", client: "AI Portrait Series", category: "AI Content", note: "AI-generated fashion visual" },
  { src: "/work/pin-bob.jpg", title: "Feathered Choppy Bob", client: "Pinterest — Hair Content", category: "Pinterest", note: "Search-optimised pin design" },
  { src: "/work/pin-men.jpg", title: "13 Clean Hairstyles for Men", client: "Pinterest — Hair Content", category: "Pinterest", note: "Search-optimised pin design" },
  { src: "/work/pin-women.jpg", title: "Medium-Length Hairstyles, 30+", client: "Pinterest — Hair Content", category: "Pinterest", note: "Search-optimised pin design" },
  { src: "/work/pin-wolfcut.jpg", title: "Black & Red Wolf Cut", client: "Pinterest — Hair Content", category: "Pinterest", note: "Search-optimised pin design" },
  { src: "/work/web-omnifood.jpg", title: "Omnifood", client: "Website Design", category: "Web", note: "Landing page design" },
  { src: "/work/web-fastcuisine.jpg", title: "FastCuisine", client: "Website Design", category: "Web", note: "Restaurant site design" },
];

export const proof = [
  {
    title: "Pinterest growth",
    metric: "+139%",
    detail: "Monthly impressions 3.35M → 8.02M; engagements 134K → 324K while sole manager of the account.",
    before: "/work/pin-growth-before.jpg",
    after: "/work/pin-growth-after.jpg",
  },
  {
    title: "YouTube SEO",
    metric: "58.1K views",
    detail: "Titles, descriptions and keyword work took a family-run channel to 58.1K views and 123.4 watch hours in 90 days.",
    before: "/work/yt-before.jpg",
    after: "/work/yt-after.jpg",
  },
];

export const reports = [
  { src: "/work/report-study-abroad.jpg", title: "Study Abroad campaign report", detail: "323 leads at Rs81 each" },
  { src: "/work/report-sweden-finland.jpg", title: "Sweden & Finland report", detail: "Destination campaign results" },
  { src: "/work/report-immigration.jpg", title: "Immigration campaign report", detail: "Lead campaign performance" },
];

export type Role = {
  company: string;
  title: string;
  period: string;
  type: string;
  points: string[];
};

export const roles: Role[] = [
  {
    company: "Austrak Immigration & Education Consultancy",
    title: "Digital Marketing Manager & Case Processing Officer",
    period: "Sep 2026 — Present",
    type: "Full-time · Onsite, Karachi",
    points: [
      "Ran three Meta Ads lead campaigns in Oct 2026: 323 leads for Rs26,285 — about Rs81 ($0.29) per lead.",
      "Own content creation, scheduling and posting; recovered a suspended company Facebook page and restarted publishing.",
      "Handle university and agent enquiries, partnership proposals and follow-up with management.",
      "Advise students from first enquiry to visa submission, and designed the company profile and marketing collateral.",
    ],
  },
  {
    company: "Homeopathic Clinic",
    title: "Meta Ads Manager",
    period: "Mar 2026 — Present",
    type: "Freelance",
    points: [
      "Two Meta lead campaigns produced 2,213 messaging conversations on Rs30,877 — about Rs14 ($0.05) each.",
      "Create posts and AI-assisted content, schedule publishing, and send the doctor daily reports with enquiry sheets.",
    ],
  },
  {
    company: "Artimization Limited",
    title: "HR & Internship Coordinator",
    period: "Aug 2026 — Present",
    type: "Part-time · Remote",
    points: [
      "Run recruitment end to end: job posts on LinkedIn and Indeed, screening, shortlisting and interview scheduling.",
      "Maintain the candidate database and monthly HR reporting.",
      "Earlier, as Social Media Intern: sole manager of a multi-client Pinterest account — impressions grew 3.35M → 8.02M (+139%).",
    ],
  },
  {
    company: "Superior Consulting Pvt. Ltd",
    title: "Case Processing Officer — Study Abroad",
    period: "Apr — Aug 2026",
    type: "Full-time · Onsite, Karachi",
    points: [
      "Handled student applications from university selection to visa submission, including motivation letters and SOPs.",
      "Advised students and parents at seminars, by phone and on WhatsApp; managed B2B partner correspondence.",
      "Started as Social Media & Digital Marketing Intern: wrote, shot and edited Reels, ran Meta Ads, designed the company profile.",
    ],
  },
  {
    company: "Earlier roles",
    title: "International Sales · Support · Lead Generation",
    period: "2023 — 2025",
    type: "Remote & Onsite",
    points: [
      "Canadian distributor (remote): rebuilt a 239-entry prospect database of US Indigenous-owned retailers; B2B email and outbound calls.",
      "Callion Solutions: outbound calls to US prospects and CRM lead qualification.",
      "Safa Worldwide: outbound sales calls to UK clients with follow-ups and records.",
    ],
  },
];

export const skillGroups = [
  {
    title: "Paid & Social Marketing",
    items: ["Meta Ads Manager", "Meta Business Suite", "Content calendars", "Copywriting", "Short-form scripting, voiceover & editing", "Pinterest & Facebook page management", "YouTube & Pinterest SEO"],
  },
  {
    title: "AI & Creative Tools",
    items: ["Claude", "ChatGPT", "Gemini", "Grok", "Midjourney", "Google Flow", "Prompt writing", "Canva", "CapCut"],
  },
  {
    title: "Operations & Outreach",
    items: ["B2B & B2C email outreach", "Google Sheets databases", "CRM software", "Reporting", "Recruitment & interview coordination", "Candidate sourcing — LinkedIn, Indeed"],
  },
];

export const packages = [
  {
    name: "Pearl",
    price: "35,000",
    tag: "Posting & Management",
    line: "You create it, we run your page.",
    features: ["12 posts per month", "Captions & hashtags", "Content calendar", "Basic account handling", "Monthly performance summary"],
  },
  {
    name: "Amethyst",
    price: "55,000",
    tag: "Edit & Manage",
    line: "You shoot it, we shape and grow it.",
    features: ["16 posts per month", "Up to 8 edited videos", "Up to 8 content ideas & scripts", "1 paid campaign", "Full account handling", "Bi-weekly check-in call"],
  },
  {
    name: "Sapphire",
    price: "75,000",
    tag: "Create & Manage",
    line: "We help you create it too.",
    features: ["20 posts per month", "Up to 12 edited videos", "Up to 12 content ideas & scripts", "1 shoot session (Sunday, 4 hrs)", "Up to 6 female voiceovers", "Up to 2 paid campaigns"],
  },
  {
    name: "Diamond",
    price: "100,000",
    tag: "Full Service",
    line: "Everything handled, end to end.",
    features: ["30 posts per month", "Up to 16 edited videos", "Up to 16 content ideas & scripts", "2 shoot sessions (Sundays)", "Faceless female actor on shoot days", "Up to 10 female voiceovers", "Up to 4 paid campaigns", "Weekly strategy call & report"],
    primary: true,
  },
];

export const marqueeItems = [
  "Meta Ads",
  "Short-Form Video",
  "AI Content",
  "Pinterest SEO",
  "Lead Generation",
  "Content Calendars",
  "Copywriting",
  "Creator Management",
  "B2B Outreach",
  "YouTube SEO",
];
