'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Layout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate all reveal elements
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            onEnter: () => element.classList.add('active'),
          },
        });
      });

      // Magnetic button effect
      document.querySelectorAll('.magnetic-button').forEach((button) => {
        const handleMouseMove = (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (button as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left;
          const y = mouseEvent.clientY - rect.top;
          
          gsap.to(button, {
            duration: 0.3,
            x: (x - rect.width / 2) * 0.2,
            y: (y - rect.height / 2) * 0.2,
            ease: 'power2.out',
          });
        };

        button.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            duration: 0.3,
            x: 0,
            y: 0,
            ease: 'power2.out',
          });
        });

        return () => {
          button.removeEventListener('mousemove', handleMouseMove);
        };
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen">
      {/* Noise overlay */}
      <div className="noise" />
      
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg opacity-20" />
      
      {/* Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
} 