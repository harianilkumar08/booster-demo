import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Instrument_Serif, Manrope } from "next/font/google";
import { PageView } from "@/components/PageView";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--nf-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--nf-manrope", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--nf-cormorant",
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--nf-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Booster · within-the-hour delivery at checkout",
  description: "Concept demo of Booster, a flat £25 within-the-hour delivery option for luxury boutiques in central London.",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${manrope.variable} ${cormorant.variable} ${instrument.variable}`}
    >
      <body>
        <PageView />
        {children}
      </body>
    </html>
  );
}
