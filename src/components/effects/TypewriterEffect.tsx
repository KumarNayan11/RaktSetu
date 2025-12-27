'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function TypewriterEffect({ text, speed = 100, className }: { text: string; speed?: number, className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let ticker: NodeJS.Timeout;
    const handleTyping = () => {
      setDisplayedText(text.substring(0, displayedText.length + 1));
    };

    ticker = setTimeout(handleTyping, speed);

    return () => clearTimeout(ticker);
  }, [displayedText, isDeleting, speed, text]);

  return (
    <span className={cn("relative font-mono text-lg text-foreground/80", className)}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
