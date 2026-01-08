import React from 'react';
import { Search, Layers, Building2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from './Navbar';
import { Button } from './Button';
import { Highlight } from './ui/hero-highlight';
import { FlipWords } from './ui/flip-words';
import { BackgroundBeams } from './ui/background-beams';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onNavigate: (page: string) => void;
}

export function LandingPage({ onGetStarted, onLoginClick, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      <div className="z-50 relative">
        <Navbar showSearch={false} showProfile={false} onLoginClick={onLoginClick} />
      </div>
      
      {/* Background Beams */}
      <BackgroundBeams className="opacity-20" />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 sm:px-6 relative z-10 pt-20 pb-32">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8 leading-tight">
            Discover Pakistan's Industries <br />
            <span className="text-white">With Real-Time Intelligence.</span>
          </h1>
          
          <div className="mt-4 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
             One platform to track
             <FlipWords words={["Market Trends", "Top Companies", "Investments", "Growth Sectors"]} className="text-emerald-400 font-semibold px-2" />
             across the entire PSX ecosystem.
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 max-w-xl mx-auto relative group"
          >
             <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
             <div className="relative bg-slate-900 rounded-full flex items-center p-1.5 border border-slate-800">
                <Search className="ml-4 text-emerald-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search engaged companies (e.g. Systems)..."
                  className="w-full pl-3 pr-4 py-3 bg-transparent border-none focus:outline-none text-base text-white placeholder-slate-500"
                />
                <Button variant="primary" onClick={onGetStarted} className="rounded-full px-6 py-2 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
                  Explore
                </Button>
            </div>
          </motion.div>
        
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="px-8 py-3 rounded-full bg-slate-800 text-white text-sm font-semibold border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Feature Section */}
      <section className="relative z-10 py-24 bg-slate-950/50 border-t border-slate-900">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 text-white">Why <span className="text-emerald-500">PAK Insight?</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                {
                    title: "Live Market Data",
                    description: "Real-time feeds from PSX for over 100+ listed companies.",
                    icon: <TrendingUp className="w-6 h-6 text-emerald-400" />
                },
                {
                    title: "AI Analysis",
                    description: "Automated SWOT analysis and daily market summaries powered by Gemini.",
                    icon: <Sparkles className="w-6 h-6 text-emerald-400" />
                },
                {
                    title: "Sector Deep Dives",
                    description: "Compare performance across 20+ industries like Tech, Cement, and Banks.",
                    icon: <Layers className="w-6 h-6 text-emerald-400" />
                }
            ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-900/20">
                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            ))}
            </div>
         </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm">
        <p>© 2025 PAK Industry Insight</p>
      </footer>
    </div>
  );
}
