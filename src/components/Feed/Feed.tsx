import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, TwoCentsFilter, Post, useVoteState } from '../../utils/api';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<TwoCentsFilter>(TwoCentsFilter.TOP_ALL_TIME);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const postsPerPage = 15;
  const navigate = useNavigate();
  const { isUpvoted, isDownvoted, isViewed } = useVoteState();

  // iOS-compatible scroll to top function
  const scrollToTop = () => {
    // For iOS Safari compatibility
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Fallback for other browsers
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Animated Counter Component
  const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      const element = document.querySelector('.animated-counter');
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (isVisible) {
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 steps for smooth animation
        const increment = value / steps;
        const stepDuration = duration / steps;

        let currentCount = 0;
        const timer = setInterval(() => {
          currentCount += increment;
          if (currentCount >= value) {
            setCount(value);
            clearInterval(timer);
          } else {
            setCount(Math.floor(currentCount));
          }
        }, stepDuration);

        return () => clearInterval(timer);
      }
    }, [value, isVisible]);

    return <span className="animated-counter">{count.toLocaleString()}</span>;
  };

  const fetchPostsData = async (filter: TwoCentsFilter = currentFilter) => {
    try {
      setLoading(true);
      setError(null);
      const apiPosts = await fetchPosts(filter);
      setPosts(apiPosts.slice(0, 100));
      setCurrentPage(1);
    } catch (err: any) {
      setError(`Failed to load posts: ${err.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  // Close mobile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMobileFilters && !target.closest('.mobile-filter-dropdown')) {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileFilters]);

  const handleFilterChange = async (filter: TwoCentsFilter) => {
    setCurrentFilter(filter);
    setShowMobileFilters(false); // Close mobile dropdown when filter is selected
    await fetchPostsData(filter);
    // No scroll to top - stay in current position
  };

  const getFilterDisplayName = (filter: TwoCentsFilter) => {
    switch (filter) {
      case TwoCentsFilter.TOP_ALL_TIME:
        return 'Top All Time';
      case TwoCentsFilter.TOP_TODAY:
        return 'Top Today';
      case TwoCentsFilter.NEW_TODAY:
        return 'New Today';
      case TwoCentsFilter.CONTROVERSIAL:
        return 'Controversial';
      default:
        return 'Top All Time';
    }
  };

  const formatDate = (dateString?: string) => {
    if (dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
      
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    }
    
    // Fallback to current date if no date provided
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    const month = now.toLocaleDateString('en-US', { month: 'short' });
    const day = now.getDate();
    const year = now.getFullYear();
    
    return `${displayHours}:${displayMinutes} ${ampm} · ${month} ${day}, ${year}`;
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    // Scroll to top when navigating to post detail - iOS compatible
    scrollToTop();
  };



  const getInitials = (username: string) => {
    if (!username || typeof username !== 'string') {
      return '??';
    }
    return username.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const getNetWorthColor = (netWorth: number) => {
    const worth = netWorth || 0;
    if (worth >= 1000000) return 'bg-gradient-to-br from-green-400 to-blue-500';
    if (worth >= 100000) return 'bg-gradient-to-br from-orange-400 to-yellow-500';
    if (worth >= 10000) return 'bg-gradient-to-br from-yellow-400 to-orange-500';
    if (worth >= 1000) return 'bg-gradient-to-br from-blue-400 to-purple-500';
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  };

  const formatNetWorth = (netWorth: number) => {
    const worth = netWorth || 0;
    if (worth >= 1000000) return `$${(worth / 1000000).toFixed(1)}M`;
    if (worth >= 1000) return `$${(worth / 1000).toFixed(1)}K`;
    return `$${worth.toLocaleString()}`;
  };

  const getVoteStatus = (postId: string) => {
    return {
      isUpvoted: isUpvoted(postId),
      isDownvoted: isDownvoted(postId),
      isViewed: isViewed(postId)
    };
  };

  const truncateText = (text: string, maxWords: number = 250) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Pagination calculations
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages - iOS compatible
    scrollToTop();
  };

  if (loading) {
    return (
      <div className="container max-w-7 mx-auto px-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-6 lg:px-0 lg:mt-6">
      {/* Header */}
     



      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-8">
          <p className="font-semibold">Error loading posts:</p>
          <p>{error}</p>
          <button 
            onClick={() => {
              fetchPostsData();
              // Scroll to top when retrying - iOS compatible
              scrollToTop();
            }}
            className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filter Section */}
      <div className="mb-6">
        {/* Mobile Filter Dropdown */}
        <div className="sm:hidden mobile-filter-dropdown">
          <div className="relative">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-white/10 text-white px-4 py-3 rounded-lg flex items-center justify-between hover:bg-white/20 transition-all duration-200"
            >
              <span className="font-medium">{getFilterDisplayName(currentFilter)}</span>
              <span className={`transition-transform duration-200 ${showMobileFilters ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {/* Dropdown Menu */}
            {showMobileFilters && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#191f2a] border border-white/20 rounded-lg shadow-xl z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleFilterChange(TwoCentsFilter.TOP_ALL_TIME)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                      currentFilter === TwoCentsFilter.TOP_ALL_TIME ? 'bg-orange-500/20 text-orange-300' : 'text-white'
                    }`}
                  >
                    Top All Time
                  </button>
                  <button
                    onClick={() => handleFilterChange(TwoCentsFilter.TOP_TODAY)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                      currentFilter === TwoCentsFilter.TOP_TODAY ? 'bg-orange-500/20 text-orange-300' : 'text-white'
                    }`}
                  >
                    Top Today
                  </button>
                  <button
                    onClick={() => handleFilterChange(TwoCentsFilter.NEW_TODAY)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                      currentFilter === TwoCentsFilter.NEW_TODAY ? 'bg-orange-500/20 text-orange-300' : 'text-white'
                    }`}
                  >
                    New Today
                  </button>
                  <button
                    onClick={() => handleFilterChange(TwoCentsFilter.CONTROVERSIAL)}
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${
                      currentFilter === TwoCentsFilter.CONTROVERSIAL ? 'bg-orange-500/20 text-orange-300' : 'text-white'
                    }`}
                  >
                    Controversial
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Filter Tabs */}
        <div className="hidden sm:flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleFilterChange(TwoCentsFilter.TOP_ALL_TIME)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
              currentFilter === TwoCentsFilter.TOP_ALL_TIME
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Top All Time
          </button>
          <button
            onClick={() => handleFilterChange(TwoCentsFilter.TOP_TODAY)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
              currentFilter === TwoCentsFilter.TOP_TODAY
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Top Today
          </button>
          <button
            onClick={() => handleFilterChange(TwoCentsFilter.NEW_TODAY)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
              currentFilter === TwoCentsFilter.NEW_TODAY
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            New Today
          </button>
          <button
            onClick={() => handleFilterChange(TwoCentsFilter.CONTROVERSIAL)}
            className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
              currentFilter === TwoCentsFilter.CONTROVERSIAL
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            Controversial
          </button>
        </div>
      </div>

      {/* Posts Count */}
      <div className="text-center mb-6">
        <p className="text-white/60">
          Showing {startIndex + 1}-{Math.min(endIndex, posts.length)} of {posts.length} posts
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 max-w-7xl mx-auto items-start">
        {currentPosts.map((post, index) => {
          const voteStatus = getVoteStatus(post.uuid);
          return (
            <div
              key={post.uuid}
              onClick={() => handlePostClick(post.uuid)}
              className={`group bg-[#191f2a] border border-white/10 rounded-xl p-3 sm:p-4 cursor-pointer hover:bg-[#1f2633] transition-all duration-300 h-72 sm:h-80 flex flex-col ${
                voteStatus.isViewed ? 'border-orange-500/30 bg-[#1f2633]' : ''
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3 flex-shrink-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-black ${getNetWorthColor(post.author_meta?.balance || 0)} flex-shrink-0`}>
                  {getInitials(post.author_meta?.username || 'Anonymous')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm sm:text-base">{post.author_meta?.username || 'Anonymous'}</h3>
                    <span className="text-white text-xs sm:text-sm">✓</span>
                    <span className="text-white/60 text-xs sm:text-sm hidden sm:inline">@{post.author_meta?.username?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}</span>
                    {post.author_uuid && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${post.author_uuid}`);
                          // Scroll to top when navigating to user profile - iOS compatible
                          scrollToTop();
                        }}
                        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold shadow-md ${getNetWorthColor(post.author_meta?.balance || 0)} text-black hover:scale-105 transition-transform duration-200 cursor-pointer`}
                      >
                        {formatNetWorth(post.author_meta?.balance || 0)}
                      </button>
                    )}
                    {voteStatus.isViewed && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        <span className="hidden sm:inline">Viewed</span>
                        <span className="sm:hidden">👁️</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-white/60 text-xs sm:text-sm">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">i</span>
                  </div>
                </div>

              </div>
              
              {/* Post Content */}
              <div className="mb-4 pl-15 flex-1 overflow-hidden">
                <p className="text-white text-lg leading-relaxed line-clamp-6">
                  {truncateText(post.text || post.title || 'No content available')}
                </p>
              </div>

              {/* Interaction Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 pl-15 flex-shrink-0">
                <div className="flex items-center gap-1 sm:gap-2 text-white/60 hover:text-orange-400 transition-colors">
                  <span className="text-sm sm:text-lg">↑</span>
                  <span className="text-xs sm:text-sm">
                    <AnimatedCounter value={post.upvote_count || 0} />
                  </span>
                  <span className="text-xs text-white/40 hidden sm:inline">upvotes</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-white/60 hover:text-blue-400 transition-colors">
                  <span className="text-sm sm:text-lg">💬</span>
                  <span className="text-xs sm:text-sm">
                    <AnimatedCounter value={post.comment_count || 0} />
                  </span>
                  <span className="text-xs text-white/40 hidden sm:inline">comments</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-white/60 hover:text-green-400 transition-colors">
                  <span className="text-sm sm:text-lg">👁️</span>
                  <span className="text-xs sm:text-sm">
                    <AnimatedCounter value={post.view_count || 0} />
                  </span>
                  <span className="text-xs text-white/40 hidden sm:inline">views</span>
                </div>
              </div>



              {/* Read more button */}
              <div className="mt-4 flex-shrink-0">
                <button className="w-full bg-[#1f2633] border border-white/20 rounded-lg py-3 text-white font-medium hover:bg-[#2a3441] transition-colors">
                  Read more
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-12">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentPage === 1
                ? 'text-white/30 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            ← Previous
          </button>

          {/* Page Numbers - Responsive */}
          <div className="flex gap-1 flex-wrap justify-center">
            {(() => {
              const pages = [];
              const maxVisiblePages = window.innerWidth < 640 ? 5 : 10; // Show fewer pages on mobile
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Show smart pagination with ellipsis
                if (currentPage <= 3) {
                  // Near start: show first 3 + ellipsis + last 2
                  for (let i = 1; i <= 3; i++) pages.push(i);
                  pages.push('...');
                  for (let i = totalPages - 1; i <= totalPages; i++) pages.push(i);
                } else if (currentPage >= totalPages - 2) {
                  // Near end: show first 2 + ellipsis + last 3
                  for (let i = 1; i <= 2; i++) pages.push(i);
                  pages.push('...');
                  for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
                } else {
                  // Middle: show first + ellipsis + current-1, current, current+1 + ellipsis + last
                  pages.push(1);
                  pages.push('...');
                  for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                  pages.push('...');
                  pages.push(totalPages);
                }
              }
              
              return pages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                  disabled={typeof page !== 'number'}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    typeof page === 'number'
                      ? currentPage === page
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-white/40 cursor-default'
                  }`}
                >
                  {page}
                </button>
              ));
            })()}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentPage === totalPages
                ? 'text-white/30 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed; 