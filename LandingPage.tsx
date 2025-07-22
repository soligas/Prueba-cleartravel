import React, { useState } from 'react';
import { SparklesIcon, ShieldCheckIcon, TagIcon, ChevronDownIcon } from './IconComponents';

interface LandingPageProps {
  onGetStarted: () => void;
  t: (key: string) => string;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white/50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center transform hover:-translate-y-2 transition-transform duration-300 shadow-xl hover:shadow-indigo-500/20 backdrop-blur-sm">
    <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full mb-5 ring-4 ring-white dark:ring-slate-900 shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
  </div>
);

const FaqItem: React.FC<{ q: string, a: string, isOpen: boolean, onClick: () => void }> = ({ q, a, isOpen, onClick }) => (
  <div className="border-b border-slate-200/80 dark:border-slate-800">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center text-left py-5"
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-lg text-slate-800 dark:text-slate-100">{q}</span>
      <ChevronDownIcon className={`w-6 h-6 text-slate-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
    </button>
    <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
            <p className="pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                {a}
            </p>
        </div>
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, t }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const features = [
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: t('why_1_title'),
      description: t('why_1_desc'),
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: t('why_2_title'),
      description: t('why_2_desc'),
    },
    {
      icon: <TagIcon className="w-8 h-8" />,
      title: t('why_3_title'),
      description: t('why_3_desc'),
    },
  ];

  const faqs = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') },
    { q: t('faq_4_q'), a: t('faq_4_a') },
  ];

  return (
    <div className="animate-fade-in-long space-y-24 md:space-y-36 pb-24">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6">
            <span className="block text-slate-800 dark:text-slate-100">
              {t('landing_title').split(':')[0]}:
            </span>
            <span className="block text-gradient from-indigo-500 via-purple-500 to-pink-500 mt-2">
              {t('landing_title').split(':')[1]}
            </span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            {t('landing_subtitle')}
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-10 rounded-xl text-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {t('get_started')}
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">{t('why_choose_us_title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">{t('faq_title')}</h2>
        </div>
        <div className="max-w-3xl mx-auto bg-white/50 dark:bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm shadow-xl">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              q={faq.q}
              a={faq.a}
              isOpen={openFaq === index}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;