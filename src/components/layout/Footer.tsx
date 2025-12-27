'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} RaktSetu. All Rights Reserved.
          </p>
          
          {/* Update: Changed gap-2 to gap-4 to add more space */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with ❤️ by Team Setu</span>
            <Link href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link href="/privacy" className="text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}