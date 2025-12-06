import React from 'react';
import { Navbar } from './Navbar';
import { ArrowLeft, Mail, MapPin, Phone, Shield, FileText, Info } from 'lucide-react';
import { Card } from './Card';

interface StaticPageProps {
  onBack: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function PageLayout({ onBack, title, icon, children }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar showSearch={false} showProfile={false} onLoginClick={onBack} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-[#10B981] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <Card className="bg-white dark:bg-slate-800 p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-slate-700 pb-6">
            <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center text-[#10B981]">
              {icon}
            </div>
            <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white">{title}</h1>
          </div>
          
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            {children}
          </div>
        </Card>
      </main>
    </div>
  );
}

export function About({ onBack }: { onBack: () => void }) {
  return (
    <PageLayout title="About Us" icon={<Info className="w-6 h-6" />} onBack={onBack}>
      <p className="text-lg mb-6">
        PAK Industry Insight is Pakistan's premier market intelligence platform, dedicated to providing investor-grade data and insights into the nation's corporate sector.
      </p>
      
      <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-4">Our Mission</h3>
      <p className="mb-6">
        To empower investors, analysts, and decision-makers with real-time data, accurate trend analysis, and comprehensive company profiles, fostering transparency and growth in Pakistan's economy.
      </p>

      <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-4">What We Do</h3>
      <ul className="space-y-3 list-disc pl-5 mb-6">
        <li>Aggregate real-time news from verified local sources like TechJuice and ProPakistani.</li>
        <li>Provide detailed financial and operational metrics for top companies.</li>
        <li>Analyze market trends using advanced data visualization.</li>
      </ul>
    </PageLayout>
  );
}

export function Contact({ onBack }: { onBack: () => void }) {
  return (
    <PageLayout title="Contact Us" icon={<Phone className="w-6 h-6" />} onBack={onBack}>
      <p className="text-lg mb-8">
        Have questions or need enterprise solutions? We'd love to hear from you. Reach out to our team directly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-5 h-5 text-[#10B981]" />
            <h4 className="font-semibold text-[#0F172A] dark:text-white">Email</h4>
          </div>
          <p>contact@pakinsight.com</p>
          <p>support@pakinsight.com</p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-[#10B981]" />
            <h4 className="font-semibold text-[#0F172A] dark:text-white">Office</h4>
          </div>
          <p>Software Technology Park,</p>
          <p>Karachi, Pakistan</p>
        </div>
      </div>
    </PageLayout>
  );
}

export function Terms({ onBack }: { onBack: () => void }) {
  return (
    <PageLayout title="Terms & Privacy" icon={<FileText className="w-6 h-6" />} onBack={onBack}>
      <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-4">Terms of Service</h3>
      <p className="mb-6">
        By accessing PAK Industry Insight, you agree to use the data for personal or internal business analysis only. Redistribution of our proprietary datasets is strictly prohibited without a commercial license.
      </p>

      <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-4">Privacy Policy</h3>
      <p className="mb-4">
        We value your privacy. We collect minimal data necessary to provide personalized experiences (such as your watchlist and settings).
      </p>
      <ul className="space-y-2 list-disc pl-5 mb-6">
        <li>We do not sell your personal data to third parties.</li>
        <li>Account data is encrypted and stored securely.</li>
        <li>You can request data deletion at any time via your Profile settings.</li>
      </ul>
    </PageLayout>
  );
}
