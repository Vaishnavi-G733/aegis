import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full select-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`p-3.5 bg-white border border-gray-300 rounded shadow-lg text-slate-900 flex items-start space-x-3 transition-all transform animate-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-600" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-blue-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {toast.message}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
