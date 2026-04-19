import React from 'react';
import { Settings } from 'lucide-react';
import { LookerDateRangePicker, DateRangeValue } from './LookerDateRangePicker';

interface HeaderProps {
  onOpenSettings?: () => void;
  onDateChange?: (value: DateRangeValue) => void;
  dateValue?: DateRangeValue;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onDateChange, dateValue }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-lg shadow-slate-200/80 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
          Dashboard Quan Tri
        </h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Tong quan so lieu kinh doanh theo thoi gian thuc</p>
      </div>
      <div className="flex items-center gap-3">
        <LookerDateRangePicker
          value={dateValue} 
          onChange={(val) => onDateChange?.(val)} 
        />

        <button
          onClick={onOpenSettings}
          className="group rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md cursor-pointer"
          title="Cài đặt hệ thống"
        >
          <Settings size={20} className="transition-transform duration-200 group-hover:rotate-45" />
        </button>
      </div>
    </div>
  );
};
