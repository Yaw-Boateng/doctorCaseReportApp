import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export const Toast = ({ 
  id, 
  type = 'info', 
  title, 
  description, 
  actionLabel, 
  onAction, 
  onClose, 
  duration = 5000 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!duration) return;

    const exitTimeout = setTimeout(() => {
      setIsExiting(true);
    }, duration - 280);

    const removeTimeout = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      clearTimeout(exitTimeout);
      clearTimeout(removeTimeout);
    };
  }, [duration, id, onClose]);

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 250);
  };

  const semanticConfigs = {
    success: {
      border: 'border-l-4 border-l-emerald-500',
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      progressBar: 'bg-emerald-500',
      actionText: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300'
    },
    error: {
      border: 'border-l-4 border-l-rose-500',
      iconBg: 'bg-rose-500/10 dark:bg-rose-500/15',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
      progressBar: 'bg-rose-500',
      actionText: 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300'
    },
    warning: {
      border: 'border-l-4 border-l-amber-500',
      iconBg: 'bg-amber-500/10 dark:bg-amber-500/15',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      progressBar: 'bg-amber-500',
      actionText: 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300'
    },
    info: {
      border: 'border-l-4 border-l-sky-500',
      iconBg: 'bg-sky-500/10 dark:bg-sky-500/15',
      icon: <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />,
      progressBar: 'bg-sky-500',
      actionText: 'text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300'
    }
  };

  const currentStyle = semanticConfigs[type] || semanticConfigs.info;

  return (
    <div
      className={`
        pointer-events-auto relative flex w-full max-w-[320px] md:max-w-[340px] flex-col overflow-hidden rounded-xl 
        bg-white dark:bg-[#18181B] p-3
        border-y border-r border-[#E5E7EB] dark:border-[#3F3F46]
        shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.3)]
        transition-all duration-300 ease-out transform
        ${currentStyle.border}
        ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
      `}
      role="alert"
    >
      {/* Inline Content Row */}
      <div className="flex items-start gap-2.5 w-full">
        {/* Compact Circular Badge */}
        <div className={`flex items-center justify-center w-7 h-7 rounded-full flex-shrink-0 ${currentStyle.iconBg}`}>
          {currentStyle.icon}
        </div>

        {/* Narrative Block */}
        <div className="flex-1 min-w-0 mt-0.5">
          {title && (
            <h3 className="text-[14px] font-semibold tracking-tight text-[#111827] dark:text-[#FAFAFA] leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-0.5 text-[13px] leading-relaxed text-[#6B7280] dark:text-[#A1A1AA] break-words line-clamp-2">
              {description}
            </p>
          )}
          
          {/* Action Button inside content stream to save vertical height */}
          {actionLabel && onAction && (
            <div className="mt-1.5 flex items-center">
              <button
                onClick={() => { onAction(); handleManualClose(); }}
                className={`text-[11px] font-semibold tracking-wide underline underline-offset-2 transition-colors focus:outline-none ${currentStyle.actionText}`}
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>

        {/* Small Close Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleManualClose}
            className="rounded-md p-1 text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#F3F4F6] dark:hover:bg-[#27272A] hover:text-[#111827] dark:hover:text-[#FAFAFA] transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-zinc-700"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tiny Progress Indicator Track */}
      {duration && (
        <div className="absolute bottom-0 left-0 h-[2px] bg-gray-100 dark:bg-zinc-800/60 w-full">
          <div 
            className={`h-full transition-all linear ${currentStyle.progressBar}`}
            style={{ 
              animation: `shrinkWidth ${duration}ms linear forwards` 
            }}
          />
        </div>
      )}
    </div>
  );
};