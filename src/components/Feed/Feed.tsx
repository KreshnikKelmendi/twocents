import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, TwoCentsFilter, Post, useVoteState } from '../../utils/api';
import PostCard from './PostCard';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoadingSpinner, setShowLoadingSpinner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState<TwoCentsFilter>(TwoCentsFilter.TOP_ALL_TIME);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isRestoringState, setIsRestoringState] = useState(false);
  const postsPerPage = 15;
  const navigate = useNavigate();
  const { isUpvoted, isDownvoted, isViewed } = useVoteState();

  // Scroll position memory
  const saveScrollPosition = () => {
    const scrollData = {
      scrollY: window.scrollY,
      currentPage,
      currentFilter,
      timestamp: Date.now()
    };
    localStorage.setItem('feedScrollPosition', JSON.stringify(scrollData));
  };



  // scroll to top function
  const scrollToTop = () => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fetchPostsData = async (filter: TwoCentsFilter = currentFilter, resetPage: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      
      // Show loading spinner after 500ms delay
      const loadingTimer = setTimeout(() => {
        setShowLoadingSpinner(true);
      }, 500);
      
      const apiPosts = await fetchPosts(filter);
      setPosts(apiPosts.slice(0, 100));
      if (resetPage) {
        setCurrentPage(1);
      }
      
      // Clear the timer and hide spinner if data loads quickly
      clearTimeout(loadingTimer);
      setShowLoadingSpinner(false);
    } catch (err: any) {
      setError(`Failed to load posts: ${err.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
      setShowLoadingSpinner(false);
    }
  };

  useEffect(() => {
    // Check if we have saved data first
    const savedData = localStorage.getItem('feedScrollPosition');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (Date.now() - data.timestamp < 30 * 60 * 1000) {
          // We have valid saved data, restore it
          setIsRestoringState(true);
          const savedFilter = data.currentFilter || TwoCentsFilter.TOP_ALL_TIME;
          const savedPage = data.currentPage || 1;
          
          // Set the filter and page immediately
          setCurrentFilter(savedFilter);
          setCurrentPage(savedPage);
          
          // Fetch data with the restored filter
          fetchPostsData(savedFilter, false);
          
          // Restore scroll position after a delay to ensure DOM is ready
          setTimeout(() => {
            window.scrollTo({
              top: data.scrollY || 0,
              behavior: 'auto'
            });
            // Clear the saved data after restoration to prevent it from being used again
            localStorage.removeItem('feedScrollPosition');
            setIsRestoringState(false);
          }, 100);
          
          return; // Don't fetch default data
        }
      } catch (error) {
        // Error checking saved data - continue normally
      }
    }
    
    // No valid saved data, load default
    fetchPostsData();

    // Save scroll position when component unmounts
    return () => {
      saveScrollPosition();
    };
  }, []);

  // Fetch data when filter changes (but only if not restoring from saved state)
  useEffect(() => {
    // Skip this effect if we're currently restoring state
    if (isRestoringState) {
      return;
    }
    
    // Skip this effect on initial mount if we're restoring from saved state
    const savedData = localStorage.getItem('feedScrollPosition');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (Date.now() - data.timestamp < 30 * 60 * 1000) {
          // We're restoring from saved state, don't trigger this effect
          return;
        }
      } catch (error) {
        // Continue with normal behavior
      }
    }
    
    fetchPostsData(currentFilter, false);
  }, [currentFilter, isRestoringState]);

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
    // Clear saved scroll position when changing filters
    localStorage.removeItem('feedScrollPosition');
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

  const handlePostClick = (postId: string) => {
    // Save current scroll position and state before navigating
    saveScrollPosition();
    navigate(`/post/${postId}`);
    // Scroll to top when navigating to post detail - iOS compatible
    scrollToTop();
  };

  // Pagination calculations
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Clear saved scroll position when manually changing pages
    localStorage.removeItem('feedScrollPosition');
    // Scroll to filters section when changing pages
    const filtersSection = document.getElementById('filters-section');
    if (filtersSection) {
      filtersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback to top if filters section not found
      scrollToTop();
    }
  };

  if (loading && showLoadingSpinner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (isRestoringState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white/70">Restoring your previous view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-6 lg:px-0 lg:mt-20">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-8">
          <p className="font-semibold">Error loading posts:</p>
          <p>{error}</p>
          <button 
            onClick={() => {
              fetchPostsData();
              // Save current scroll position before retrying
              saveScrollPosition();
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
      <div id="filters-section" className="mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8 max-w-7xl mx-auto items-start">
        {currentPosts.map((post, index) => (
          <PostCard
            key={post.uuid}
            post={post}
            index={index}
            onPostClick={handlePostClick}
          />
        ))}
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
              const maxVisiblePages = window.innerWidth < 640 ? 5 : 10; 
              
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