import React from 'react';
import { Search, Layers, Building2, TrendingUp, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';
import { Navbar } from './Navbar';
import { Button } from './Button';
import { Highlight } from './ui/hero-highlight';
import { FlipWords } from './ui/flip-words';
import { ShootingStars } from './ui/shooting-stars';
import { StarsBackground } from './ui/stars-background';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onNavigate: (page: string) => void;
}

export function LandingPage({ onGetStarted, onLoginClick, onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden flex flex-col font-sans">
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-emerald-500/30">
                <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PAK Industry Insight</span>
          </div>
          <button 
            onClick={onLoginClick}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-md text-white rounded-full font-medium transition-all duration-200"
          >
            Login
          </button>
      </div>
      
      {/* 
         ==========================================
         BACKGROUND ANIMATION LAYER
         ==========================================
         We use two overlapping animations to create the "Aurora" effect:
         1. StarsBackground: A static or slowly twinkling field of stars.
         2. ShootingStars: Dynamic meteors that streak across every few seconds.
         
         The 'fixed inset-0' class ensures this covers the entire screen behind the content.
      */}
      <div className="fixed inset-0 z-0">
        <StarsBackground 
            starDensity={0.0002} // Controls how many stars appear
            allStarsTwinkle={true}
            twinkleProbability={0.8}
            minTwinkleSpeed={0.8}
            maxTwinkleSpeed={1.2}
        />
        <ShootingStars 
            starColor="#10B981" // Emerald Green shooting stars
            trailColor="#34D399" 
            minSpeed={15} 
            maxSpeed={35} 
            minDelay={1000} 
            maxDelay={3000} 
        />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 sm:px-6 relative z-10 pt-24 pb-12">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-200 to-neutral-500 py-4 leading-tight tracking-tight">
            Discover Pakistan's Industries <br />
            <span className="text-white drop-shadow-2xl">With Real-Time Intelligence.</span>
          </h1>
          
          <div className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed font-light">
             One platform to track
             <FlipWords words={["Market Trends", "Top Companies", "Investments", "Growth Sectors"]} className="text-emerald-400 font-semibold px-2" />
             across the entire PSX ecosystem.
          </div>

          {/* Search Bar - Fixed "Out of Box" Issue */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 max-w-xl mx-auto relative group"
          >
             {/* Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition duration-500"></div>
             
             <div className="relative bg-black/80 backdrop-blur-md rounded-full flex items-center p-1.5 border border-white/10 group-hover:border-emerald-500/50 transition-colors shadow-2xl">
                <Search className="ml-4 text-emerald-500 w-5 h-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search (e.g. Systems, Engro)..."
                  className="w-full pl-3 pr-2 py-3 bg-transparent border-none focus:outline-none text-base text-white placeholder-neutral-500"
                />
                
                {/* Explore Button - Snug Fit */}
                <button 
                  onClick={onGetStarted} 
                  className="shrink-0 rounded-full px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all shadow-lg hover:shadow-emerald-500/25"
                >
                  Explore
                </button>
            </div>
          </motion.div>
        
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-center gap-4"
          >
             <div className="flex flex-col items-center gap-2 cursor-pointer animate-bounce text-neutral-500 hover:text-emerald-400 transition-colors">
                <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                <ArrowDown className="w-4 h-4" />
             </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Feature Section - Reduced Gap */}
      <section className="relative z-10 py-12 bg-black/50 border-t border-white/5 backdrop-blur-sm">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">Why <span className="text-emerald-500">PAK Insight?</span></h2>
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
                <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all hover:bg-white/10 group cursor-default">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            ))}
            </div>
         </div>
      </section>
      
      {/* Footer - Enhanced Visibility */}
      <footer className="relative z-10 py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-8 text-white font-bold text-xl tracking-tight">
                <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-400" /> 
                </div>
                PAK Industry Insight
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-neutral-400 text-sm mb-8 font-medium">
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">About Us</button>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition-colors">Contact Support</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-emerald-400 transition-colors">Privacy Policy</button>
                <button onClick={() => onNavigate('terms')} className="hover:text-emerald-400 transition-colors">Terms of Service</button>
            </div>
            
            <div className="text-neutral-600 text-xs uppercase tracking-wider">
                © 2025 PAK Industry Insight. Built for Pakistan's Future.
            </div>
        </div>
      </footer>
    </div>
  );
}
