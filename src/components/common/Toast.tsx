import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    alert: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800',
    info: 'bg-white border-sky-200 text-slate-800',
    warning: 'bg-white border-amber-200 text-slate-800',
    alert: 'bg-white border-rose-200 text-slate-800'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 ${bgStyles[toastMessage.type || 'info']}`}>
        {icons[toastMessage.type || 'info']}
        <div className="flex-1 text-left">
          <h5 className="text-sm font-semibold text-slate-900">{toastMessage.title}</h5>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toastMessage.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = Toast;

