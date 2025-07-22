
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './IconComponents';

interface ScrollToTopButtonProps {
  t: (key: string) => string;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ t }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 animate-fade-in"
          aria-label={t('back_to_top')}
        >
          <ArrowUpIcon className="w-6 h-6" />
        </button>
      )}
    </>
  );
};
