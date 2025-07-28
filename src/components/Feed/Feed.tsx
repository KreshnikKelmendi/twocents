import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, TwoCentsFilter, Post, useVoteState } from '../../utils/api';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 15;
  const navigate = useNavigate();
  const { isUpvoted, isDownvoted, isViewed } = useVoteState();

  const fetchPostsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiPosts = await fetchPosts(TwoCentsFilter.TOP_ALL_TIME);
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

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
    // Scroll to top when navigating to post detail
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="container max-w-6xl mx-auto px-6 lg:px-0">
      {/* Header */}
     



      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-8">
          <p className="font-semibold">Error loading posts:</p>
          <p>{error}</p>
          <button 
            onClick={() => fetchPostsData()}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 max-w-7xl mx-auto items-start">
        {currentPosts.map((post, index) => {
          const voteStatus = getVoteStatus(post.uuid);
          return (
            <div
              key={post.uuid}
              onClick={() => handlePostClick(post.uuid)}
              className={`group bg-[#191f2a] border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-[#1f2633] transition-all duration-300 h-80 flex flex-col ${
                voteStatus.isViewed ? 'border-orange-500/30 bg-[#1f2633]' : ''
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start gap-3 mb-3 flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black ${getNetWorthColor(post.author_meta?.balance || 0)} flex-shrink-0`}>
                  {getInitials(post.author_meta?.username || 'Anonymous')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-base">{post.author_meta?.username || 'Anonymous'}</h3>
                    <span className="text-white">✓</span>
                    <span className="text-white/60 text-sm">@{post.author_meta?.username?.toLowerCase().replace(/\s+/g, '') || 'anonymous'}</span>
                    {voteStatus.isViewed && (
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                        Viewed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span>8:16 AM · Dec 7, 2024</span>
                    <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">i</span>
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
              <div className="flex items-center gap-8 pl-15 flex-shrink-0">
                <div className="flex items-center gap-2 text-white/60 hover:text-pink-400 transition-colors">
                  <span className="text-xl">❤️</span>
                  <span className="text-sm">{(post.upvote_count || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors">
                  <span className="text-xl">💬</span>
                  <span className="text-sm">{(post.comment_count || 0).toLocaleString()} Comments</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 hover:text-green-400 transition-colors">
                  <span className="text-xl">🔗</span>
                  <span className="text-sm">Copy link</span>
                </div>
              </div>



              {/* Read more button */}
              <div className="mt-4 pl-15 flex-shrink-0">
                <button className="w-full bg-[#1f2633] border border-white/20 rounded-lg py-3 text-white font-medium hover:bg-[#2a3441] transition-colors">
                  Read more on TwoCents
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