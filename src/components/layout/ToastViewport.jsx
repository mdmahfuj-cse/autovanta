import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useToastStore } from '../../stores/toastStore.js';

const AUTO_DISMISS_MS = 3800;

const VARIANTS = {
  info: { icon: Info, iconClass: 'text-info' },
  success: { icon: CircleCheck, iconClass: 'text-success' },
  error: { icon: CircleAlert, iconClass: 'text-error' },
};

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    if (!toasts.length) return undefined;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), AUTO_DISMISS_MS));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  return (
    <div
      className="pointer-events-none fixed right-4 top-20 z-[90] flex w-[min(92vw,22rem)] flex-col gap-2"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const variant = VARIANTS[t.variant] ?? VARIANTS.info;
          const Icon = variant.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex items-start gap-3 rounded-lg border border-white/10 bg-base-200/95 px-4 py-3 shadow-2xl backdrop-blur"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${variant.iconClass}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs leading-relaxed text-muted">{t.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="btn btn-ghost btn-square btn-xs -mr-1 -mt-1"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
