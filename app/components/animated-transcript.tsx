'use client';

import { useState, useEffect } from 'react';

interface AnimatedTranscriptProps {
  text: string;
}

export function AnimatedTranscript({ text }: AnimatedTranscriptProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    if (text) {
      const splitWords = text.split(/\s+/);
      setWords(splitWords);
      setDisplayedText(''); // Reset on new text
    }
  }, [text]);

  useEffect(() => {
    if (words.length > 0) {
      const interval = setInterval(() => {
        setDisplayedText((prev) => {
          const nextWordIndex = prev.split(/\s+/).filter(Boolean).length;
          if (nextWordIndex < words.length) {
            return prev + (prev ? ' ' : '') + words[nextWordIndex];
          }
          clearInterval(interval);
          return prev;
        });
      }, 150); // Adjust speed as needed

      return () => clearInterval(interval);
    }
  }, [words]);

  return (
    <div className="text-center h-48 flex items-center justify-center">
      <p className="text-3xl text-zinc-100 font-medium leading-relaxed">
        {displayedText}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  );
}
