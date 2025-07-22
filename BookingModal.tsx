import React, { useEffect, useState } from 'react';
import { XMarkIcon, ShieldCheckIcon, ArrowTopRightOnSquareIcon } from './IconComponents';

interface BookingModalProps {
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

export const BookingModal: React.FC<BookingModalProps> = ({ url, isOpen, onClose, t }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !url) {
    return null;
  }
  
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div 
        className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-2xl w-[95vw] h-[90vh] max-w-6xl flex flex-col transform animate-scale-in border border-slate-200 dark:border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex flex-col">
            <h2 id="booking-modal-title" className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t('complete_booking')}</h2>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:underline flex items-center gap-1">
              {new URL(url).hostname} <ArrowTopRightOnSquareIcon className="w-3 h-3"/>
            </a>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            aria-label={t('close_modal')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        <div className="bg-amber-400/10 p-3 border-b border-amber-400/20 flex-shrink-0">
            <div className="flex items-start gap-3">
                <ShieldCheckIcon className="w-8 h-8 md:w-6 md:h-6 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">{t('booking_warning_title')}</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-500">{t('booking_warning_desc')}</p>
                </div>
            </div>
        </div>

        <div className="flex-grow relative bg-white dark:bg-slate-950">
            {isLoading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading booking page...</p>
                    </div>
                </div>
            )}
            <iframe
                src={url}
                className={`w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
                title={t('complete_booking')}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={handleIframeLoad}
            ></iframe>
        </div>
      </div>
    </div>
  );
};