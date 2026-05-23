import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Qazaq Students Association — Diaspora network for Kazakh talent",
    template: "%s · QSA",
  },
  description:
    "A modern platform uniting Kazakh students and alumni across the United States: networking, events, mentorship, and student crowdfunding.",
  keywords: ["Kazakh students", "diaspora", "alumni network", "crowdfunding", "events"],
  openGraph: {
    title: "Qazaq Students Association",
    description:
      "Digital infrastructure for the future generation of globally connected Kazakh talent.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
