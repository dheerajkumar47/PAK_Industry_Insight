import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { DataWidget } from './DataWidget';
import { Building2, Users, TrendingUp, Calendar, MapPin, Globe, Sparkles, ExternalLink, Youtube, Newspaper } from 'lucide-react';

interface CompanyDetailProps {
  onNavigate: (page: string) => void;
}

export function CompanyDetail({ onNavigate }: CompanyDetailProps) {
  const [activeItem] = React.useState('companies');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const newsItems = [
    {
      title: 'Systems Limited Reports Record Q4 Revenue',
      summary: 'The company announced a 32% increase in quarterly revenue, driven by expansion in international markets.',
      source: 'Business Recorder',
      type: 'news',
      date: '2 days ago',
      sentiment: 'positive'
    },
    {
      title: 'New Office Opening in Dubai',
      summary: 'Systems Limited expands Middle East operations with new regional headquarters.',
      source: 'Dawn',
      type: 'news',
      date: '1 week ago',
      sentiment: 'positive'
    },
    {
      title: 'CEO Interview: Future of Pakistan\'s IT Industry',
      summary: 'Discussion on digital transformation and export growth strategies.',
      source: 'Tech Radar Pakistan',
      type: 'youtube',
      date: '2 weeks ago',
      sentiment: 'neutral'
    }
  ];

  const sources = [
    { type: 'website', label: 'Official Website', url: 'systemsltd.com' },
    { type: 'news', label: 'Business Recorder', url: 'brecorder.com' },
    { type: 'news', label: 'Dawn Business', url: 'dawn.com' },
    { type: 'youtube', label: 'Tech Talks Pakistan', url: 'youtube.com' }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar showSearch={true} showProfile={true} />
      
      <div className="flex">
        <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
        
        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Company Header */}
            <Card className="mb-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-[#0F172A] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl">S</span>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl text-[#0F172A] mb-2">Systems Limited</h1>
                  <div className="flex flex-wrap items-center gap-4 text-[#1E293B] mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>Information Technology</span>
                    </div>
                    <span className="text-[#E5E7EB]">•</span>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Lahore, Pakistan</span>
                    </div>
                    <span className="text-[#E5E7EB]">•</span>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a href="#" className="text-[#10B981] hover:underline">systemsltd.com</a>
                    </div>
                  </div>
                  <p className="text-[#1E293B]">
                    Leading provider of IT services, business process outsourcing, and technology solutions serving clients across North America, Europe, Middle East, and Asia Pacific.
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Data Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <DataWidget
                icon={<Users className="w-6 h-6" />}
                label="Employees"
                value="4,500+"
                trend="up"
              />
              <DataWidget
                icon={<TrendingUp className="w-6 h-6" />}
                label="Growth Rate"
                value="+32%"
                trend="up"
              />
              <DataWidget
                icon={<Calendar className="w-6 h-6" />}
                label="Founded"
                value="1977"
                trend="neutral"
              />
              <DataWidget
                icon={<Building2 className="w-6 h-6" />}
                label="Credibility Score"
                value="9.2/10"
                trend="up"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Insights */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <h2 className="text-xl text-[#0F172A] mb-4">Market Performance Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Revenue Growth</span>
                        <span className="text-[#10B981]">+32%</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                        <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Market Share</span>
                        <span className="text-[#10B981]">18%</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                        <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Client Satisfaction</span>
                        <span className="text-[#10B981]">94%</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                        <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#10B981]" />
                    <h2 className="text-xl text-[#0F172A]">AI-Generated Summary</h2>
                  </div>
                  <div className="p-4 bg-[#10B981]/5 rounded-lg border border-[#10B981]/20">
                    <p className="text-[#0F172A] mb-3">
                      Systems Limited is a high-performing IT services company demonstrating exceptional growth in the Pakistani technology sector. Key highlights include:
                    </p>
                    <ul className="space-y-2 text-[#0F172A]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#10B981] mt-1">•</span>
                        <span>32% revenue growth YoY, significantly above industry average</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10B981] mt-1">•</span>
                        <span>Strong international presence with clients in 20+ countries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10B981] mt-1">•</span>
                        <span>Recent expansion into Middle East market with Dubai office</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#10B981] mt-1">•</span>
                        <span>Focus on digital transformation and cloud solutions</span>
                      </li>
                    </ul>
                  </div>
                </Card>
                
                <Card>
                  <h2 className="text-xl text-[#0F172A] mb-4">Latest News & Updates</h2>
                  <div className="space-y-4">
                    {newsItems.map((item, index) => (
                      <div key={index} className="p-4 border border-[#E5E7EB] rounded-lg hover:border-[#10B981] cursor-pointer transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.type === 'youtube' ? (
                              <Youtube className="w-5 h-5 text-[#10B981]" />
                            ) : (
                              <Newspaper className="w-5 h-5 text-[#10B981]" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-[#0F172A] mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{item.source}</span>
                                <span>•</span>
                                <span>{item.date}</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs ${
                                item.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                                item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.sentiment}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              {/* Right Column - Sources */}
              <div className="space-y-6">
                <Card>
                  <h2 className="text-xl text-[#0F172A] mb-4">Key Metrics</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-gray-600">Annual Revenue</span>
                      <span className="text-[#0F172A]">$85M+</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-gray-600">Offices</span>
                      <span className="text-[#0F172A]">8 Global</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                      <span className="text-gray-600">Certifications</span>
                      <span className="text-[#0F172A]">ISO, CMMI</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-600">Stock Listed</span>
                      <span className="text-[#0F172A]">PSX</span>
                    </div>
                  </div>
                </Card>
                
                <Card>
                  <h2 className="text-xl text-[#0F172A] mb-4">Sources</h2>
                  <div className="space-y-3">
                    {sources.map((source, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#E5E7EB] transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          {source.type === 'website' ? (
                            <Globe className="w-5 h-5 text-[#10B981]" />
                          ) : source.type === 'youtube' ? (
                            <Youtube className="w-5 h-5 text-[#10B981]" />
                          ) : (
                            <Newspaper className="w-5 h-5 text-[#10B981]" />
                          )}
                          <div>
                            <div className="text-sm text-[#0F172A]">{source.label}</div>
                            <div className="text-xs text-gray-500">{source.url}</div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#10B981]" />
                      </a>
                    ))}
                  </div>
                </Card>
                
                <Card>
                  <h2 className="text-xl text-[#0F172A] mb-4">Related Companies</h2>
                  <div className="space-y-3">
                    {['NetSol Technologies', 'TRG Pakistan', 'Inbox Business Tech'].map((company, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#E5E7EB] cursor-pointer transition-colors">
                        <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">{company.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-[#0F172A]">{company}</div>
                          <div className="text-xs text-gray-500">IT Services</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
