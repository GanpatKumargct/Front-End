import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

export function BackButton({ onClick, label, className = '' }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3 group ${className}`}
    >
      <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </button>
  );
}
