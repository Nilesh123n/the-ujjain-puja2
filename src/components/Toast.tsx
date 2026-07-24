import React from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-xs w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto p-3.5 rounded-xl shadow-xl border-l-4 text-xs font-medium flex items-center justify-between gap-3 animate-in slide-in-from-right duration-300 ${
            t.type === 'success'
              ? 'bg-[#5C3A1E] text-[#FDF6EC] border-emerald-500'
              : t.type === 'error'
              ? 'bg-rose-900 text-white border-rose-500'
              : 'bg-[#5C3A1E] text-white border-[#f7ae62]'
          }`}
        >
          <div className="flex items-center gap-2">
            <i
              className={`fas ${
                t.type === 'success'
                  ? 'fa-check-circle text-emerald-400'
                  : t.type === 'error'
                  ? 'fa-exclamation-circle text-rose-400'
                  : 'fa-info-circle text-[#f7ae62]'
              } text-base`}
            ></i>
            <span>{t.text}</span>
          </div>
          <button
            onClick={() => onRemove(t.id)}
            className="text-white/60 hover:text-white font-bold text-sm cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
