import React from 'react';
import { InstagramIcon, PinterestIcon, TikTokIcon } from './IconComponents';

interface FooterProps {
    t: (key: string) => string;
}

const SocialLink: React.FC<{ href: string; children: React.ReactNode; 'aria-label': string }> = ({ href, children, 'aria-label': ariaLabel }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
        {children}
    </a>
);

export const Footer: React.FC<FooterProps> = ({ t }) => {
    return (
        <footer className="bg-slate-100/50 dark:bg-slate-900/50 mt-16 border-t border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <div className="container mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center gap-x-6 gap-y-2">
                        <span>{t('footer_text')}</span>
                        <div className="flex gap-x-6">
                            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('terms_of_service')}</a>
                            <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{t('privacy_policy')}</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{t('footer_find_us')}</span>
                        <div className="flex items-center gap-5">
                             <SocialLink href="https://instagram.com/google" aria-label="Follow us on Instagram">
                                <InstagramIcon className="w-6 h-6" />
                            </SocialLink>
                             <SocialLink href="https://pinterest.com/google" aria-label="Follow us on Pinterest">
                                <PinterestIcon className="w-6 h-6" />
                            </SocialLink>
                             <SocialLink href="https://tiktok.com/@google" aria-label="Follow us on TikTok">
                                <TikTokIcon className="w-6 h-6" />
                            </SocialLink>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};