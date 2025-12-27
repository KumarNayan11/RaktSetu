'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Live Requests' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/admin/hospitals', label: 'Admin' },
];

const brandElements = [
  <Image 
    key="english-logo"
    src="/images/rakt-setu-english.png" 
    alt="RaktSetu"
    width={120}
    height={32}
    sizes="100vw"
    priority
    style={{ width: 'auto', height: '32px' }} 
  />,
  <Image 
    key="hindi-logo"
    src="/images/rakt-setu-hindi.png" 
    alt="RaktSetu in Hindi"
    width={120}
    height={55}
    sizes="100vw"
    priority
    style={{ width: 'auto', height: '55px' }} 
  />
];

export function Header() {
  const pathname = usePathname();
  const [brandIndex, setBrandIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') { 
      if (window.scrollY > lastScrollY && window.scrollY > 100) { 
        setShow(false); 
      } else { 
        setShow(true);  
      }
      setLastScrollY(window.scrollY); 
    }
  };

  useEffect(() => {
    const brandInterval = setInterval(() => {
      setBrandIndex((prevIndex) => (prevIndex + 1) % brandElements.length);
    }, 6000); 

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
        clearInterval(brandInterval);
      };
    }
    
    return () => clearInterval(brandInterval);
  }, [lastScrollY]);

  return (
    <header className={cn(
        "bg-gradient-to-b from-card to-muted/20 border-b sticky top-0 z-50 transition-transform duration-300",
        show ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" className="inline-block flex items-center justify-center">
              <div className="animate-fade-in-out">
                {brandElements[brandIndex]}
              </div>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-center">
             <Image 
                src="/images/logo.png" 
                alt="Logo"
                width={0} 
                height={0}
                sizes="100vw"
                priority
                style={{ width: 'auto', height: '60px' }} 
            />
          </div>

          <nav className="flex-1 flex items-center justify-end space-x-2">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant={pathname === link.href ? 'default' : 'ghost'}
                className={cn(
                  'font-medium',
                  pathname !== link.href && 'text-foreground/80'
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
