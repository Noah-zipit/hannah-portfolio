import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "900"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prismatic-lily-2df05a.netlify.app"),
  title: "Hannah Iqbal — Digital Marketer | Meta Ads, Short-Form Video & AI Content",
  description:
    "Portfolio of Hannah Iqbal, a Karachi-based digital marketer. 323 study-abroad leads at $0.29 each, 2,213 clinic enquiries at $0.05 each, and Pinterest growth from 3.35M to 8.02M impressions.",
  openGraph: {
    title: "Hannah Iqbal — Digital Marketer",
    description:
      "Meta Ads, short-form video and AI content that turn small budgets into real enquiries. Based in Karachi, working worldwide.",
    type: "website",
    images: ["/work/ai-cinematic.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
