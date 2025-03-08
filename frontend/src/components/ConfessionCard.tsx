
import React from 'react';
import { Confession } from '@/utils/storage';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface ConfessionCardProps {
  confession: string;
  date:string;
  className?: string;
}

export const ConfessionCard = ({ confession,date, className }: ConfessionCardProps) => {

  return (
    <div 
      className={cn(
        'glass-card rounded-xl p-6 transition-all animate-fade-in animate-slide-up',
        'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/10',
        className
      )}
      style={{ animationDelay: `${Math.random() * 0.5}s` }}
    >
      <p className="text-base leading-relaxed mb-4">{confession}</p>
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Anonymous</span>
        <div className="flex items-center gap-1">
       
          <Clock className="h-3 w-3" />
          <span> {date}</span>
        </div>
      </div>
    </div>
  );
};

export default ConfessionCard;
