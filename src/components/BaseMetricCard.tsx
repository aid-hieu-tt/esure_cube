import React from 'react';
import { cn } from '../lib/utils';
import { useSmoothTransition } from '../hooks/useSmoothTransition';

interface BaseMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
  logo?: string;
  onClick?: () => void;
}

export const BaseMetricCard: React.FC<BaseMetricCardProps> = ({
  title,
  value,
  subtitle,
  bgColor = 'bg-white',
  textColor = 'text-gray-900',
  logo,
  onClick,
}) => {
  // Split title if it contains newlines to create heading hierarchy
  const lines = title.split('\n');
  const heading1 = lines[0] || '';
  const heading2 = lines.slice(1).join(' ') || subtitle;

  const { data: smoothValue, transitioning } = useSmoothTransition(value, 200);

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 p-3.5 text-center shadow-sm',
        'transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/80',
        onClick && 'cursor-pointer active:scale-95',
        bgColor
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-16 rounded-b-full bg-gradient-to-b from-blue-50 to-transparent"></div>
      <h3 className="text-[13px] font-bold tracking-tight text-slate-800 md:text-sm">
        {heading1}
      </h3>
      
      {heading2 && (
        <h4 className="mt-0.5 text-[10px] font-semibold text-slate-500 md:text-[11px]">
          {heading2}
        </h4>
      )}
      
      <div className="mt-2.5 flex flex-grow flex-col items-center justify-end">
        <p className={cn(
          'text-2xl font-extrabold tracking-tight lg:text-[26px]', 
          textColor,
          'transition-opacity duration-200',
          transitioning ? 'opacity-50' : 'opacity-100'
        )}>
          {smoothValue !== null ? smoothValue : value}
        </p>
      </div>
    </div>
  );
};
