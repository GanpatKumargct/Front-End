import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleId = Date.now();
    setRipples(prev => [...prev, { x, y, id: rippleId }]);
    setIsTransitioning(true);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1000);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);

    setTimeout(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }, 150);
  };

  return (
    <button
      onClick={handleToggle}
      className="relative p-2 hover:bg-accent/10 rounded-lg transition-all duration-200 overflow-hidden group"
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)',
            animation: 'ripple 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      ))}
      <div className={`transition-all duration-300 ${isTransitioning ? 'scale-90 opacity-50' : 'scale-100 opacity-100'}`}>
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 transition-transform group-hover:rotate-45 duration-300" />
        ) : (
          <Moon className="w-5 h-5 transition-transform group-hover:-rotate-12 duration-300" />
        )}
      </div>
      <style>{`
        @keyframes ripple {
          to {
            width: 600px;
            height: 600px;
            margin-left: -300px;
            margin-top: -300px;
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
