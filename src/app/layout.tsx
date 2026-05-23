import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Applies the saved theme before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('qsa-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}if(t==='light'){document.documentElement.classList.add('light');}document.documentElement.style.colorScheme=t;var l=localStorage.getItem('qsa-locale');if(l){document.documentElement.lang=l;}}catch(e){}})();`;

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
    <html lang="kk" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
