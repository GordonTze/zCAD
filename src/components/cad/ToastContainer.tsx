'use client';

import { useCADStore } from '@/store/useCADStore';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const toasts = useCADStore((s) => s.toasts);
  const dismiss = useCADStore((s) => s.dismissToast);

  return (
    <div className="fixed bottom-10 right-4 z-[200] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-2 p-3 rounded-lg border bg-card shadow-lg animate-slide-in-right"
        >
          {t.variant === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />}
          {t.variant === 'error' && <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />}
          {t.variant === 'info' && <Info className="w-4 h-4 text-blue-500 mt-0.5" />}
          {t.variant === 'default' && <div className="w-4 h-4 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium">{t.title}</div>
            {t.description && (
              <div className="text-[11px] text-muted-foreground mt-0.5">{t.description}</div>
            )}
          </div>
          <button
            onClick={() => dismiss(t.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
