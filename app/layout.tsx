import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { TriageProvider } from "@/app/providers/triage-provider";
import { cn } from "@/lib/utils";
import { Navbar } from "@/app/components/navbar";
import { Footer } from "@/app/components/footer";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  // 1. Set the base URL for relative links (like images) to work
  metadataBase: new URL("https://triagex.vercel.app"), 

  title: "TriageX",
  description: "Multi-AI Medical Triage System",
  
  // Icons
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  // 2. Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  openGraph: {
    title: "TriageX",
    description: "Autonomous AI Medical Pre-Triage Kiosk",
    url: "https://triagex.vercel.app",
    siteName: "TriageX",
    images: [
      {
        url: "/homepage.png", // Points to public/homepage.png
        width: 1200,
        height: 630,
        alt: "TriageX Interface",
      },
    ],
    locale: "en_SG",
    type: "website",
  },

  // 3. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "TriageX",
    description: "Autonomous AI Medical Pre-Triage Kiosk",
    images: ["/homepage.png"], // Points to public/homepage.png
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={cn(
          "min-h-screen bg-black font-sans antialiased flex flex-col",
          GeistSans.variable,
          firaCode.variable
        )}
      >
        <Navbar />
        <TriageProvider>
            {/* 
              flex-1 here forces this div to grow and fill all available space 
              between the fixed Navbar (visually) and the Footer.
            */}
            <div className="flex-1 flex flex-col w-full">
              {children}
            </div>
        </TriageProvider>
        <Footer />
      </body>
    </html>
  );
}
