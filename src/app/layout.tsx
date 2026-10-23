import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { seo } from "@/data/content";
import Script from "next/script";
import IdentityRedirect from "@/components/IdentityRedirect";

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
  metadataBase: new URL("https://hannahiqbal.netlify.app"),
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.ogTitle,
    description: seo.ogDescription,
    type: "website",
    images: [seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        {children}
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
        <IdentityRedirect />
      </body>
    </html>
  );
}
