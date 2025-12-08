import React, { useEffect, useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Card } from './Card';
import { ExternalLink, RefreshCw, Calendar, Filter } from 'lucide-react';
import { newsService } from '../services/api';

interface NewsInsightsProps {
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function NewsInsights({ onNavigate, onLogout }: NewsInsightsProps) {
  const [activeItem] = React.useState('news');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  // State for articles
  const [articles, setArticles] = useState<any[]>([]); // Store all fetched articles (for random mode)
  const [visibleArticles, setVisibleArticles] = useState<any[]>([]); // Articles currently shown
  const [stats, setStats] = useState<any>(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination & Filters
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSource, setSelectedSource] = useState('All Sources');
  const [sortMode, setSortMode] = useState('random'); // 'random' or 'latest'

  const LIMIT = 10;
  const RANDOM_FETCH_LIMIT = 100; // Fetch 100 items for client-side random shuffle

  const fetchStats = async () => {
    try {
      const data = await newsService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Fisher-Yates Shuffle
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const loadNews = async (isRefresh: boolean = false, mode: string = sortMode) => {
    if (isRefresh) setLoading(true);

    try {
      if (mode === 'random') {
        // --- RANDOM MODE ---
        if (isRefresh) {
          const data = await newsService.getAll(0, RANDOM_FETCH_LIMIT, 'latest');

          if (Array.isArray(data)) {
            const shuffled = shuffleArray(data);
            setArticles(shuffled);
            setVisibleArticles(shuffled.slice(0, LIMIT));
            setPage(1);
            setHasMore(shuffled.length > LIMIT);
          }
        } else {
          // Load next slice from local
          const nextSliceEnd = (page + 1) * LIMIT;
          const nextSlice = articles.slice(0, nextSliceEnd);
          setVisibleArticles(nextSlice);
          setPage(prev => prev + 1);
          if (nextSlice.length >= articles.length) setHasMore(false);
        }
      } else {
        // --- LATEST MODE ---
        const serverPage = isRefresh ? 0 : page;
        const skip = serverPage * LIMIT;
        const data = await newsService.getAll(skip, LIMIT, 'latest');

        if (Array.isArray(data)) {
          if (isRefresh) {
            setArticles(data);
            setVisibleArticles(data);
            setPage(1);
          } else {
            setVisibleArticles(prev => {
              const existingIds = new Set(prev.map(p => p.link));
              const newUnique = data.filter(d => !existingIds.has(d.link));
              return [...prev, ...newUnique];
            });
            setPage(prev => prev + 1);
          }
          if (data.length < LIMIT) setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to load news:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setSortMode('random');
    setSelectedSource('All Sources');
    setHasMore(true);

    try {
      await newsService.fetchLatest();
      await fetchStats();
      await loadNews(true, 'random');
    } catch (error) {
      console.error("Failed to refresh:", error);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    loadNews(false, sortMode);
  };

  const handleSortChange = (mode: string) => {
    setSortMode(mode);
    setHasMore(true);
    loadNews(true, mode);
  };

  useEffect(() => {
    fetchStats();
    loadNews(true, 'random'); // Initial load
  }, []);

  // Filter visible articles by source ONLY
  const filteredArticles = selectedSource === 'All Sources'
    ? visibleArticles
    : visibleArticles.filter(article => article.source.toLowerCase().includes(selectedSource.toLowerCase()));

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
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl text-[#0F172A] dark:text-white mb-2">News & Insights</h1>
                <p className="text-sm sm:text-base text-[#1E293B] dark:text-gray-400">Latest updates from Pakistan's business and tech sectors</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden px-4 py-2 bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white border border-[#E5E7EB] dark:border-slate-700 rounded-lg flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filters</span>
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-4 py-2 bg-[#10B981] text-white rounded-lg flex items-center gap-2 hover:bg-[#059669] transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>{refreshing ? 'Refreshing...' : 'Refresh News'}</span>
                </button>
              </div>
            </div>

            {/* Mini Dashboard */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">Total Sources</div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.total_sources}</div>
                </Card>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30">
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium mb-1">Total Articles</div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-200">{stats.total_articles}</div>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30">
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium mb-1">Top Source</div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-200">
                    {Object.entries(stats.source_counts).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'}
                  </div>
                </Card>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Advanced Filters Sidebar (Hidden on mobile by default) */}
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72`}>
                <Card className="bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-[#0F172A] dark:text-white" />
                    <h3 className="text-[#0F172A] dark:text-white">Filters</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Sort Order</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSortChange('random')}
                          className={`flex-1 py-2 text-sm rounded-lg border ${sortMode === 'random' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                        >
                          Random
                        </button>
                        <button
                          onClick={() => handleSortChange('latest')}
                          className={`flex-1 py-2 text-sm rounded-lg border ${sortMode === 'latest' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                        >
                          Latest
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Source</label>
                      <select
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                        className="w-full p-2 border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-[#10B981]"
                      >
                        <option>All Sources</option>
                        {stats && Object.keys(stats.source_counts).map(source => (
                          <option key={source} value={source}>{source} ({stats.source_counts[source]})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>
              </div>

              {/* News List */}
              <div className="flex-1">
                {loading && page === 1 ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading news...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {filteredArticles.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                          No news articles found. Click "Refresh News" to fetch the latest updates.
                        </div>
                      ) : (
                        filteredArticles.map((article, index) => (
                          <Card key={index} hover className="flex flex-col h-full bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700">
                            <div className="flex flex-col h-full space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full w-fit">
                                    {article.source}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(article.published).toLocaleDateString()}
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white line-clamp-2">
                                {article.title}
                              </h3>

                              <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1" dangerouslySetInnerHTML={{ __html: article.summary }} />

                              <div className="pt-4 mt-auto border-t border-gray-100 dark:border-slate-700">
                                <a
                                  href={article.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between text-sm font-medium text-[#10B981] hover:text-[#059669] transition-colors group"
                                >
                                  Read Full Article
                                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>

                    {hasMore && filteredArticles.length > 0 && (
                      <div className="text-center pb-8">
                        <button
                          onClick={handleLoadMore}
                          disabled={loading}
                          className="px-6 py-2 bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#0F172A] dark:text-white rounded-lg hover:border-[#10B981] hover:text-[#10B981] transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Loading...' : 'Load More News'}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
