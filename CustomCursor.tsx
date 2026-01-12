
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mainCursorRef = useRef<HTMLDivElement>(null);
  const secondaryCursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT';
      
      setIsHovering(!!isClickable);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  // Request Animation Frame for smooth trailing
  // Fix: Added initial value to useRef to satisfy TypeScript requirement (Expected 1 argument, but got 0)
  const requestRef = useRef<number>(0);
  const secondaryPos = useRef({ x: 0, y: 0 });

  const animate = () => {
    const ease = 0.15;
    secondaryPos.current.x += (position.x - secondaryPos.current.x) * ease;
    secondaryPos.current.y += (position.y - secondaryPos.current.y) * ease;

    if (secondaryCursorRef.current) {
      secondaryCursorRef.current.style.transform = `translate3d(${secondaryPos.current.x}px, ${secondaryPos.current.y}px, 0)`;
    }
    if (mainCursorRef.current) {
      mainCursorRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* Primary Dot */}
      <div 
        ref={mainCursorRef}
        className={`fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-blue-500 rounded-full transition-transform duration-75 ease-out shadow-[0_0_10px_#3b82f6] ${isHovering ? 'scale-150' : 'scale-100'}`}
      />
      {/* Secondary Trailing Glow */}
      <div 
        ref={secondaryCursorRef}
        className={`fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border border-blue-400/30 transition-all duration-300 ease-out flex items-center justify-center ${
          isHovering ? 'scale-[2] border-blue-400/60 bg-blue-400/5' : 'scale-100'
        }`}
      >
        <div className={`w-1 h-1 bg-blue-400/20 rounded-full ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </div>
  );
};

export default CustomCursor;
