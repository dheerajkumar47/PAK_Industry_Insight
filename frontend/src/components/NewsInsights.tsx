import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { Filter, Newspaper, Youtube, Globe, TrendingUp } from 'lucide-react';

interface NewsInsightsProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function NewsInsights({ onNavigate, onLogout }: NewsInsightsProps) {
  const [activeItem] = React.useState('news');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [showFilters, setShowFilters] = React.useState(false);

  const newsData = [
    {
      title: 'Pakistan\'s IT Exports Reach $3.2 Billion Mark',
      summary: 'The country\'s IT and IT-enabled services exports have shown remarkable growth, reaching a record $3.2 billion in FY2024, representing a 24% increase from the previous year.',
      industry: 'Technology',
      company: 'Industry-wide',
      source: 'Dawn Business',
      type: 'news',
      date: '2 hours ago',
      sentiment: 'positive',
      tags: ['IT', 'Exports', 'Growth']
    },
    {
      title: 'Textile Sector Shows Recovery with 15% Export Growth',
      summary: 'Pakistan\'s textile and apparel sector has demonstrated strong recovery signals with exports growing by 15% in the last quarter, driven by new orders from European markets.',
      industry: 'Textiles',
      company: 'Industry-wide',
      source: 'Business Recorder',
      type: 'news',
      date: '5 hours ago',
      sentiment: 'positive',
      tags: ['Textiles', 'Exports', 'Recovery']
    },
    {
      title: 'Understanding Pakistan\'s Pharmaceutical Industry Growth',
      summary: 'An in-depth video analysis of the pharmaceutical sector\'s expansion, covering key players, market dynamics, and future opportunities.',
      industry: 'Pharmaceuticals',
      company: 'Multiple',
      source: 'Business Insights TV',
      type: 'youtube',
      date: '1 day ago',
      sentiment: 'neutral',
      tags: ['Healthcare', 'Analysis', 'Market']
    },
    {
      title: 'Engro Corporation Announces Major Investment in Renewable Energy',
      summary: 'Engro Corporation has announced a $500 million investment in renewable energy projects, marking the company\'s strategic shift towards sustainable energy solutions.',
      industry: 'Energy',
      company: 'Engro Corporation',
      source: 'The News',
      type: 'news',
      date: '1 day ago',
      sentiment: 'positive',
      tags: ['Energy', 'Investment', 'Sustainability']
    },
    {
      title: 'Systems Limited Opens New Office in Dubai',
      summary: 'Leading IT services provider Systems Limited has expanded its Middle East operations with a new regional headquarters in Dubai, aiming to serve Gulf markets more effectively.',
      industry: 'Technology',
      company: 'Systems Limited',
      source: 'TechJuice',
      type: 'website',
      date: '2 days ago',
      sentiment: 'positive',
      tags: ['IT', 'Expansion', 'International']
    },
    {
      title: 'Lucky Cement Reports Strong Q4 Performance',
      summary: 'Lucky Cement has announced impressive quarterly results with an 18% increase in revenue, driven by major infrastructure projects and improved market conditions.',
      industry: 'Construction',
      company: 'Lucky Cement',
      source: 'ProPakistani',
      type: 'website',
      date: '3 days ago',
      sentiment: 'positive',
      tags: ['Construction', 'Earnings', 'Growth']
    },
    {
      title: 'Agriculture Sector Challenges and Opportunities',
      summary: 'A comprehensive video discussion on the current state of Pakistan\'s agriculture sector, covering challenges related to water management, technology adoption, and export potential.',
      industry: 'Agriculture',
      company: 'Industry-wide',
      source: 'Farm Tech Pakistan',
      type: 'youtube',
      date: '4 days ago',
      sentiment: 'neutral',
      tags: ['Agriculture', 'Technology', 'Policy']
    },
    {
      title: 'Bank Alfalah Launches Digital Banking Platform',
      summary: 'Bank Alfalah has introduced a new digital banking platform with AI-powered features, targeting the growing segment of digitally-savvy customers.',
      industry: 'Finance',
      company: 'Bank Alfalah',
      source: 'Dawn',
      type: 'news',
      date: '5 days ago',
      sentiment: 'positive',
      tags: ['Banking', 'Digital', 'Innovation']
    }
  ];

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500" />;
      case 'website':
        return <Globe className="w-5 h-5 text-blue-500" />;
      default:
        return <Newspaper className="w-5 h-5 text-[#10B981]" />;
    }
  };

  const filteredNews = activeFilter === 'all' 
    ? newsData 
    : newsData.filter(item => item.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar 
        showSearch={true} 
        showProfile={true} 
        onLogout={onLogout}
        onProfileClick={() => onNavigate('profile')}
        onSettingsClick={() => onNavigate('settings')}
      />
      
      <div className="flex">
        <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
        
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <h1 className="text-3xl text-[#0F172A]">News & Insights</h1>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-white text-[#0F172A] border border-[#E5E7EB] rounded-lg flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filters</span>
                </button>
              </div>
              <p className="text-[#1E293B] mb-8">Stay updated with the latest industry news and market insights</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-[#10B981] text-white' 
                    : 'bg-white text-[#0F172A] border border-[#E5E7EB] hover:border-[#10B981]'
                }`}
              >
                All Sources
              </button>
              <button
                onClick={() => setActiveFilter('news')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeFilter === 'news' 
                    ? 'bg-[#10B981] text-white' 
                    : 'bg-white text-[#0F172A] border border-[#E5E7EB] hover:border-[#10B981]'
                }`}
              >
                News Articles
              </button>
              <button
                onClick={() => setActiveFilter('youtube')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeFilter === 'youtube' 
                    ? 'bg-[#10B981] text-white' 
                    : 'bg-white text-[#0F172A] border border-[#E5E7EB] hover:border-[#10B981]'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveFilter('website')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeFilter === 'website' 
                    ? 'bg-[#10B981] text-white' 
                    : 'bg-white text-[#0F172A] border border-[#E5E7EB] hover:border-[#10B981]'
                }`}
              >
                Websites
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Advanced Filters Sidebar */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72`}>
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-[#0F172A]" />
                    <h3 className="text-[#0F172A]">Advanced Filters</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Industry</label>
                      <select className="w-full p-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981]">
                        <option>All Industries</option>
                        <option>Technology</option>
                        <option>Textiles</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Energy</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Company</label>
                      <select className="w-full p-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981]">
                        <option>All Companies</option>
                        <option>Industry-wide</option>
                        <option>Systems Limited</option>
                        <option>Lucky Cement</option>
                        <option>Engro Corporation</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Timeline</label>
                      <select className="w-full p-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#10B981]">
                        <option>All Time</option>
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Sentiment</label>
                      <div className="space-y-2">
                        {['Positive', 'Neutral', 'Negative'].map((sentiment) => (
                          <label key={sentiment} className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm text-[#0F172A]">{sentiment}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-colors">
                      Apply Filters
                    </button>
                  </div>
                </Card>
                
                <Card className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#10B981]" />
                    <h3 className="text-[#0F172A]">Trending Topics</h3>
                  </div>
                  <div className="space-y-2">
                    {['IT Exports', 'Textile Recovery', 'Digital Banking', 'Renewable Energy', 'Investment'].map((topic, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 bg-[#F9FAFB] rounded-lg hover:bg-[#10B981]/10 hover:text-[#10B981] transition-colors text-sm text-[#0F172A]"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
              
              {/* News List */}
              <div className="flex-1 space-y-6">
                {filteredNews.map((item, index) => (
                  <Card key={index} hover>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[#F9FAFB] rounded-lg flex items-center justify-center flex-shrink-0">
                        {getSourceIcon(item.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg text-[#0F172A] flex-1">{item.title}</h3>
                          <span className={`ml-4 px-3 py-1 rounded-full text-xs flex-shrink-0 ${
                            item.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                            item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.sentiment}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{item.summary}</p>
                        
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[#E5E7EB] text-xs rounded-full text-[#0F172A]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-gray-500">
                            <span>{item.source}</span>
                            <span>•</span>
                            <span>{item.industry}</span>
                            <span>•</span>
                            <span>{item.company}</span>
                          </div>
                          <span className="text-gray-400">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {/* Load More */}
                <div className="text-center py-8">
                  <button className="px-8 py-3 bg-white border-2 border-[#E5E7EB] text-[#0F172A] rounded-lg hover:border-[#10B981] hover:text-[#10B981] transition-colors">
                    Load More News
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
