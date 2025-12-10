import Link from "next/link";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <Activity className="h-5 w-5 text-red-500" />
          <span className="font-bold tracking-tight">TriageX</span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/" 
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          About
        </Link>
      </div>
    </nav>
  );
}
