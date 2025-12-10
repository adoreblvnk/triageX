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
  title: "TriageX",
  description: "Multi-AI Medical Triage System",
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
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          GeistSans.variable,
          firaCode.variable
        )}
      >
        <Navbar />
        <TriageProvider>
            <div className="flex-1 flex flex-col">
              {children}
            </div>
        </TriageProvider>
        <Footer />
      </body>
    </html>
  );
}
