import { Award, Github, Users } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-black py-8 mt-auto">
      <div className="container mx-auto px-6 text-center">
        {/* Team Name & Event */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-4 text-zinc-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-zinc-200">Participation Mark</span>
          </div>
          <span className="hidden md:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">
              HackRift 2025 Finalist Project (of course)
            </span>
          </div>
          <span className="hidden md:inline text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              <a
                href="https://github.com/adoreblvnk/triageX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-zinc-400 hover:text-white underline decoration-zinc-800 underline-offset-4 transition-colors"
              >
                <Github className="w-3 h-3" />
                Source Code (more stuff here)
              </a>
            </span>
          </div>
        </div>

        {/* Credits */}
        <p className="text-zinc-600 text-sm font-mono flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <span>
            With <span className="text-red-900">♥</span> by
          </span>

          <a
            href="https://github.com/adoreblvnk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-white underline decoration-zinc-800 underline-offset-4 transition-colors"
          >
            <Github className="w-3 h-3" />
            @adoreblvnk
          </a>

          <span className="text-zinc-800">/</span>

          <a
            href="https://github.com/driedwater"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-white underline decoration-zinc-800 underline-offset-4 transition-colors"
          >
            <Github className="w-3 h-3" />
            @driedwater
          </a>

          <span className="text-zinc-800">/</span>

          <a
            href="https://github.com/zayn3lee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-white underline decoration-zinc-800 underline-offset-4 transition-colors"
          >
            <Github className="w-3 h-3" />
            @zayn3lee
          </a>
        </p>
      </div>
    </footer>
  );
}
