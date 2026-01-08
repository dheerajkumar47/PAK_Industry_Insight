import React from 'react';
import { Search, Layers, Building2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { Card } from './Card';
import { Button } from './Button';
import { HeroHighlight, Highlight } from './ui/hero-highlight';
import { FlipWords } from './ui/flip-words';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onNavigate: (page: string) => void;
}

export function LandingPage({ onGetStarted, onLoginClick, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <Navbar showSearch={false} showProfile={false} onLoginClick={onLoginClick} />
      
      {/* Hero Section */}
      <HeroHighlight>
        <div className="text-center px-4 max-w-4xl mx-auto relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -5, 0] }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
            className="text-3xl sm:text-4xl lg:text-7xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
          >
            Discover Pakistan's Industries <br />
            <Highlight className="text-black dark:text-white">at a Glance</Highlight>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto flex items-center justify-center gap-2"
          >
              Real-time insights for
              <FlipWords words={["Companies", "Industries", "Trends", "Investments"]} className="text-[#10B981] font-semibold" />
          </motion.div>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 max-w-2xl mx-auto relative group"
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center p-2 border border-slate-100 dark:border-slate-800">
                <Search className="ml-4 text-gray-400 w-6 h-6" />
                <input
                type="text"
                placeholder="Search industries, companies (e.g. Systems, Engro)..."
                className="w-full pl-4 pr-4 py-4 bg-transparent border-none focus:outline-none text-lg text-slate-800 dark:text-white placeholder-slate-400"
                />
                <Button variant="primary" size="large" onClick={onGetStarted} className="rounded-xl shadow-lg shadow-emerald-500/20">
                Search
                </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10"
          >
              <button 
                onClick={onGetStarted}
                className="inline-flex h-12 animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] dark:text-slate-300 dark:border-slate-800 text-white"
              >
               Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </button>
          </motion.div>
        </div>
      </HeroHighlight>
      
      {/* Feature Cards */}
      <section className="bg-white dark:bg-slate-900 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white">Why Choose <span className="text-[#10B981]">PAK Insight?</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                    title: "Industry Explorer",
                    description: "Deep dive into 20+ sectors with aggregated growth metrics and performance analysis.",
                    icon: <Layers className="w-8 h-8 text-[#10B981]" />
                },
                {
                    title: "Company Intelligence",
                    description: "Access real-time data for 100+ top companies coupled with AI-driven SWOT analysis.",
                    icon: <Building2 className="w-8 h-8 text-[#10B981]" />
                },
                {
                    title: "Market Pulse",
                    description: "Stay ahead with AI-curated daily summaries of market trends and moving stocks.",
                    icon: <TrendingUp className="w-8 h-8 text-[#10B981]" />
                }
            ].map((feature, i) => (
                <div key={i} className="group relative p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-[#10B981]/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                </div>
            ))}
            </div>
         </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6 text-slate-900 dark:text-white font-bold text-xl">
                <Sparkles className="w-5 h-5 text-[#10B981]" /> PAK Industry Insight
            </div>
            <div className="flex justify-center gap-8 text-slate-600 dark:text-slate-400 text-sm mb-8">
                <button onClick={() => onNavigate('about')} className="hover:text-[#10B981] transition-colors">About</button>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#10B981] transition-colors">Contact</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#10B981] transition-colors">Privacy & Terms</button>
            </div>
            <div className="text-slate-400 text-sm">
                © 2025 PAK Industry Insight. Built for Pakistan's Future.
            </div>
        </div>
      </footer>
    </div>
  );
}
