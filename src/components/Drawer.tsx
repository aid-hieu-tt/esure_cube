import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function RightDrawer({ isOpen, onClose, title, children }: DrawerProps) {
  // Pattern: Đóng drawer khi bấm phím ESC (UX cực tốt)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-l-3xl border-l border-white/40 bg-white shadow-2xl shadow-slate-900/25 animate-slide-in-right">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/0 to-indigo-50/60" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-slate-200/80 bg-white/70 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25">
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Cấu hình</p>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="flex h-9 w-9 items-center justify-center rounded-2xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-y-auto bg-slate-50/55">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
