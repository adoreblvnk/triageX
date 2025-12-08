import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Fira_Code } from "next/font/google";
import "./globals.css";
import { TriageProvider } from "./providers/triage-provider";
import { cn } from "@/lib/utils";

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
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          firaCode.variable
        )}
      >
        <TriageProvider>
            {children}
        </TriageProvider>
      </body>
    </html>
  );
}