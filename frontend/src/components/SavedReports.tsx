import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { BookmarkCheck, FileText, Download, Trash2 } from 'lucide-react';

interface SavedReportsProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function SavedReports({ onNavigate, onLogout }: SavedReportsProps) {
  const [activeItem] = React.useState('saved');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-900 pb-20 lg:pb-0 transition-colors duration-200">
      <Navbar 
        showSearch={true} 
        showProfile={true}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        onLogout={onLogout}
        onProfileClick={() => onNavigate('profile')}
        onSettingsClick={() => onNavigate('settings')}
      />
      
      <div className="flex">
        <Sidebar 
          activeItem={activeItem} 
          onNavigate={onNavigate}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl text-[#0F172A] dark:text-white mb-2">Saved Reports</h1>
              <p className="text-[#1E293B] dark:text-gray-400">Access your bookmarked industry reports and analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Q4 2024 IT Sector Analysis', date: 'Nov 28, 2025', size: '2.4 MB' },
                { title: 'Textile Export Trends Report', date: 'Nov 25, 2025', size: '1.8 MB' },
                { title: 'Pharmaceutical Industry Outlook', date: 'Nov 20, 2025', size: '3.1 MB' },
                { title: 'Construction Sector Growth Forecast', date: 'Nov 15, 2025', size: '1.5 MB' }
              ].map((report, index) => (
                <Card key={index} hover className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#10B981]/10 rounded-lg">
                      <FileText className="w-6 h-6 text-[#10B981]" />
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg text-[#0F172A] dark:text-white font-medium mb-2">{report.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                  
                  <button className="w-full py-2 border border-[#E5E7EB] dark:border-slate-700 rounded-lg flex items-center justify-center gap-2 text-[#0F172A] dark:text-white hover:bg-[#F9FAFB] dark:hover:bg-slate-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </Card>
              ))}
            </div>
            
            {/* Empty state commented out for later use
            <div className="text-center py-20">
               <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <BookmarkCheck className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg text-[#0F172A] dark:text-white mb-2">No saved reports yet</h3>
               <p className="text-gray-500 dark:text-gray-400">Reports you bookmark will appear here for easy access.</p>
            </div>
            */}
          </div>
        </main>
      </div>
    </div>
  );
}
