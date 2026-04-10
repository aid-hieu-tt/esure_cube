import React from 'react';
import { cn } from '../lib/utils';

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
  return (
    <div
      onClick={onClick}
      className={cn(
        'border border-gray-200 rounded-sm p-3 flex flex-col items-center justify-center text-center',
        'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg',
        onClick && 'cursor-pointer',
        bgColor
      )}
    >
      <h3 className="text-sm font-bold mb-1 text-gray-800 whitespace-pre-line">
        {title}
      </h3>
      
      {subtitle && (
        <div className="text-[10px] font-medium text-gray-700 mb-2">
          {subtitle}
        </div>
      )}
      
      <p className={cn('text-2xl font-bold mt-auto', textColor)}>{value}</p>
    </div>
  );
};
