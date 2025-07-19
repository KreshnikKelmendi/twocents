import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, TwoCentsFilter, Post, useVoteState } from '../../utils/api';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TwoCentsFilter>(TwoCentsFilter.TOP_ALL_TIME);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();
  const { isUpvoted, isDownvoted, isViewed } = useVoteState();

  const fetchPostsData = async (filter: TwoCentsFilter = TwoCentsFilter.TOP_ALL_TIME) => {
    try {
      setLoading(true);
      setError(null);
      const apiPosts = await fetchPosts(filter);
      setPosts(apiPosts.slice(0, 100));
      setCurrentPage(1); // Reset to first page when filter changes
    } catch (err: any) {
      setError(`Failed to load posts: ${err.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData(selectedFilter);
  }, [selectedFilter]);

  const handleFilterChange = (filter: TwoCentsFilter) => {
    setSelectedFilter(filter);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    // Scroll to top when navigating to post detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatNetWorth = (netWorth: number) => {
    const worth = netWorth || 0;
    if (worth >= 1000000) {
      return `$${(worth / 1000000).toFixed(1)}M`;
    } else if (worth >= 1000) {
      return `$${(worth / 1000).toFixed(1)}K`;
    } else {
      return `$${worth.toLocaleString()}`;
    }
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

  const getVoteStatus = (postId: string) => {
    return {
      isUpvoted: isUpvoted(postId),
      isDownvoted: isDownvoted(postId),
      isViewed: isViewed(postId)
    };
  };

  // Pagination calculations
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the TwoCents Feed header
    const headerElement = document.querySelector('h2');
    if (headerElement) {
      headerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    <div className="container max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-inter text-[#FEF4C8] mb-2">TwoCents Feed</h2>
        <p className="text-sm font-inter w-60 mx-auto lg:w-full text-[#FEF4C8]">Discover the most engaging posts from our community</p>
      </div>

      {/* Filter Selection */}
      <div className="flex justify-center mb-8">
        {/* Mobile Filter Button */}
        <div className="sm:hidden w-full max-w-xs">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
          >
            <span className="text-sm font-medium">
              {Object.entries({
                [TwoCentsFilter.NEW_TODAY]: "New Today",
                [TwoCentsFilter.TOP_TODAY]: "Top Today",
                [TwoCentsFilter.TOP_ALL_TIME]: "Top All Time",
                [TwoCentsFilter.CONTROVERSIAL]: "Controversial"
              }).find(([key]) => key === selectedFilter)?.[1] || "Select Filter"}
            </span>
            <span className={`transition-transform duration-300 ${showMobileFilters ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {/* Mobile Filter Dropdown */}
          {showMobileFilters && (
            <div className="absolute z-10 mt-2 w-full max-w-xs bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl">
              {Object.entries({
                [TwoCentsFilter.NEW_TODAY]: "New Today",
                [TwoCentsFilter.TOP_TODAY]: "Top Today",
                [TwoCentsFilter.TOP_ALL_TIME]: "Top All Time",
                [TwoCentsFilter.CONTROVERSIAL]: "Controversial"
              }).map(([filterValue, displayName]) => (
                <button
                  key={filterValue}
                  onClick={() => {
                    handleFilterChange(filterValue as TwoCentsFilter);
                    setShowMobileFilters(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-300 first:rounded-t-xl last:rounded-b-xl ${
                    selectedFilter === filterValue
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Filter Buttons */}
        <div className="hidden sm:flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 gap-2">
          {Object.entries({
            [TwoCentsFilter.NEW_TODAY]: "New Today",
            [TwoCentsFilter.TOP_TODAY]: "Top Today",
            [TwoCentsFilter.TOP_ALL_TIME]: "Top All Time",
            [TwoCentsFilter.CONTROVERSIAL]: "Controversial"
          }).map(([filterValue, displayName]) => (
            <button
              key={filterValue}
              onClick={() => handleFilterChange(filterValue as TwoCentsFilter)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedFilter === filterValue
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {displayName}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-8">
          <p className="font-semibold">Error loading posts:</p>
          <p>{error}</p>
          <button 
            onClick={() => fetchPostsData(selectedFilter)}
            className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Posts Count */}
      <div className="text-center mb-6">
        <p className="text-white/60">
          Showing {startIndex + 1}-{Math.min(endIndex, posts.length)} of {posts.length} posts
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {currentPosts.map((post, index) => {
          const voteStatus = getVoteStatus(post.uuid);
          return (
            <div
              key={post.uuid}
              onClick={() => handlePostClick(post.uuid)}
              className={`group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:scale-105 ${
                voteStatus.isViewed ? 'border-orange-500/30 bg-orange-500/5' : ''
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black ${getNetWorthColor(post.author_meta?.balance || 0)}`}>
                  {getInitials(post.author_meta?.username || 'Anonymous')}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{post.author_meta?.username || 'Anonymous'}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getNetWorthColor(post.author_meta?.balance || 0)} text-black`}>
                    {formatNetWorth(post.author_meta?.balance || 0)}
                  </span>
                </div>
                {voteStatus.isViewed && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Viewed
                  </span>
                )}
              </div>
              
              {/* Post Content */}
              <div className="mb-4">
                <h4 className="text-white font-semibold text-lg mb-2 line-clamp-2">{post.title || 'No title'}</h4>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                  {post.text || 'No content available'}
                </p>
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between text-white/60 text-sm">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 ${voteStatus.isUpvoted ? 'text-green-400' : ''}`}>
                    <span className="text-lg">↗</span>
                    <span>{(post.upvote_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{(post.comment_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span>{(post.view_count || 0).toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-white/40 group-hover:text-white/60 transition-colors">→</span>
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