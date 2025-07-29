import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPost, fetchPoll, fetchComments, votePoll, Post, Comment, Poll, useVoteState } from '../../utils/api';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { markAsViewed } = useVoteState();

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

  const loadPost = useCallback(async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch post, poll, and comments in parallel
      const [postData, pollData, commentsData] = await Promise.allSettled([
        fetchPost(postId),
        fetchPoll(postId),
        fetchComments(postId)
      ]);
      
      if (postData.status === 'fulfilled') {
        setPost(postData.value);
        markAsViewed(postId);
      } else {
        // Handle specific error cases
        const error = postData.reason;
        if (error.message?.includes('404') || error.message?.includes('not found')) {
          throw new Error('Post not found');
        } else if (error.message?.includes('unsupported') || error.message?.includes('type')) {
          throw new Error('This post type is not supported');
        } else {
          throw error;
        }
      }
      
      if (pollData.status === 'fulfilled') {
        setPoll(pollData.value);
      } else {
        // Poll is optional, so we just log the warning
        console.warn('Failed to fetch poll:', pollData.reason);
      }
      
      if (commentsData.status === 'fulfilled') {
        console.log('Comments data:', commentsData.value);
        setComments(commentsData.value);
      } else {
        console.warn('Failed to fetch comments:', commentsData.reason);
        setComments([]);
      }
      // Comments are optional, so we don't throw if it fails
      
    } catch (err: any) {
      setError(`Failed to load post: ${err.message}`);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId, markAsViewed]);

  useEffect(() => {
    loadPost();
  }, [postId, loadPost]);

  const formatNetWorth = (netWorth: number) => {
    const worth = netWorth || 0;
    if (worth >= 1000000) return `$${(worth / 1000000).toFixed(1)}M`;
    if (worth >= 1000) return `$${(worth / 1000).toFixed(1)}K`;
    return `$${worth.toLocaleString()}`;
  };

  const getInitials = (username: string) => {
    if (!username || typeof username !== 'string') return '??';
    return username.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const getNetWorthColor = (netWorth: number) => {
    const worth = netWorth || 0;
    if (worth >= 1000000) return 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500';
    if (worth >= 100000) return 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-500';
    if (worth >= 10000) return 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500';
    if (worth >= 1000) return 'bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-500';
    return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getGenderIcon = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return '👨';
      case 'female': return '👩';
      case 'non-binary': return '⚧';
      default: return '👤';
    }
  };

  const AuthorInfo: React.FC<{ author: any; size?: 'sm' | 'md' | 'lg' }> = ({ author, size = 'md' }) => {
    const sizeClasses = {
      sm: { avatar: 'w-8 h-8 text-xs', name: 'text-sm', info: 'text-xs' },
      md: { avatar: 'w-12 h-12 text-sm', name: 'text-base', info: 'text-xs' },
      lg: { avatar: 'w-20 h-20 text-xl', name: 'text-2xl', info: 'text-sm' }
    };
    
    const classes = sizeClasses[size];
    
    return (
      <div className="flex items-start gap-4">
        <div className={`${classes.avatar} rounded-full flex items-center justify-center font-bold text-black shadow-lg ${getNetWorthColor(author?.balance || 0)}`}>
          {getInitials(author?.username || 'Anonymous')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className={`text-white font-semibold ${classes.name}`}>
              {author?.username || 'Anonymous'}
            </h4>
            {author?.author_uuid && (
              <button
                onClick={() => {
                  navigate(`/user/${author.author_uuid}`);
                  // Scroll to top when navigating to user profile - iOS compatible
                  scrollToTop();
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getNetWorthColor(author?.balance || 0)} text-black hover:scale-105 transition-transform duration-200 cursor-pointer`}
              >
                {formatNetWorth(author?.balance || 0)}
              </button>
            )}
            {!author?.author_uuid && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getNetWorthColor(author?.balance || 0)} text-black`}>
                {formatNetWorth(author?.balance || 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-white/60">
            {author?.age && (
              <span className={`${classes.info} flex items-center gap-1`}>
                🎂 {author.age} years
              </span>
            )}
            {author?.gender && (
              <span className={`${classes.info} flex items-center gap-1`}>
                {getGenderIcon(author.gender)} {author.gender}
              </span>
            )}
            {author?.arena && (
              <span className={`${classes.info} flex items-center gap-1`}>
                📍 {author.arena}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const PollComponent: React.FC<{ poll: Poll }> = ({ poll }) => {
    const [localPoll, setLocalPoll] = useState<Poll>(poll);
    const [voting, setVoting] = useState<string | null>(null);
    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
      setLocalPoll(poll);
      // Trigger animation after a short delay
      const timer = setTimeout(() => setShowAnimation(true), 100);
      return () => clearTimeout(timer);
    }, [poll]);

    const handleVote = async (optionUUID: string) => {
      if (voting || localPoll.user_vote) return; // Prevent double voting

      try {
        setVoting(optionUUID);
        await votePoll(poll.uuid, optionUUID);
        
        // Update local state optimistically
        const updatedOptions = localPoll.options.map(option => {
          if (option.uuid === optionUUID) {
            return { ...option, vote_count: option.vote_count + 1 };
          }
          return option;
        });

        // Recalculate percentages
        const totalVotes = updatedOptions.reduce((sum, option) => sum + option.vote_count, 0);
        const updatedOptionsWithPercentages = updatedOptions.map(option => ({
          ...option,
          percentage: totalVotes > 0 ? (option.vote_count / totalVotes) * 100 : 0
        }));

        setLocalPoll({
          ...localPoll,
          options: updatedOptionsWithPercentages,
          user_vote: optionUUID,
          total_votes: totalVotes
        });
      } catch (error) {
        console.error('Failed to vote:', error);
        // You could show a toast notification here
      } finally {
        setVoting(null);
      }
    };

    return (
      <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6 shadow-lg">
        <h4 className="text-white font-bold text-lg mb-4">📊 {localPoll.question}</h4>
        <div className="space-y-3">
          {localPoll.options.map((option, index) => (
            <div key={option.uuid} className="relative">
              <button
                onClick={() => handleVote(option.uuid)}
                disabled={voting !== null || !!localPoll.user_vote}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  localPoll.user_vote === option.uuid
                    ? 'bg-green-500/20 border border-green-500/50'
                    : voting === option.uuid
                    ? 'bg-orange-500/20 border border-orange-500/50'
                    : 'hover:bg-white/10 border border-transparent'
                } ${voting !== null || !!localPoll.user_vote ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90 text-sm font-medium">{option.text}</span>
                  <span className="text-white/70 text-sm">
                    {option.vote_count} votes ({option.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`bg-gradient-to-r from-orange-400 to-yellow-400 h-3 rounded-full transition-all duration-1500 ease-out ${
                      showAnimation ? 'animate-pulse' : ''
                    }`}
                    style={{ 
                      width: showAnimation ? `${option.percentage}%` : '0%',
                      transitionDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
                {localPoll.user_vote === option.uuid && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {voting === option.uuid && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-white/50 text-sm">
          Total votes: {localPoll.total_votes}
          {localPoll.user_vote && (
            <span className="ml-2 text-green-400">✓ You voted</span>
          )}
        </div>
      </div>
    );
  };

  const CommentComponent: React.FC<{ comment: Comment; level?: number }> = ({ comment, level = 0 }) => (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gradient-to-b from-orange-500/30 to-yellow-500/30 pl-6' : ''}`}>
      <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/20 rounded-xl p-5 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <AuthorInfo author={comment.author_meta} size="sm" />
        <div className="mt-4">
          <p className="text-white/90 text-sm mb-4 leading-relaxed">{comment.text}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 py-1 rounded-lg">
                <span className="text-orange-400 text-xs sm:text-sm">↑</span>
                <span className="text-white font-medium text-xs sm:text-sm">
                  <AnimatedCounter value={comment.upvote_count || 0} />
                </span>
                <span className="text-white/60 text-xs hidden sm:inline">upvotes</span>
                <span className="text-white/60 text-xs sm:hidden">↑</span>
              </div>
            </div>
            <span className="text-white/50 text-xs bg-white/10 px-2 py-1 rounded-full self-start sm:self-auto">
              {formatDate(comment.created_at)}
            </span>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.uuid} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-white/70 text-lg">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl max-w-md backdrop-blur-sm">
          <p className="font-semibold text-lg mb-2">Error loading post:</p>
          <p>{error || 'Post not found'}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-lg"
        >
          ← Back to Feed
        </button>
      </div>
    );
  }

  console.log('Comments state:', comments);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-medium"
          >
            ← Back to Feed
          </button>
          <h1 className="text-white font-bold text-xl">
            Post Details
          </h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Main Post */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl">
            <AuthorInfo author={post.author_meta} size="lg" />
            <div className="mt-6">
              <h3 className="text-white font-bold text-3xl mb-4 leading-tight">{post.title || 'No title'}</h3>
              <p className="text-white/90 text-lg mb-6 leading-relaxed">{post.text || 'No content available'}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/70 text-sm sm:text-base">
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <span className="text-orange-400 text-sm sm:text-base">↑</span>
                  <span className="text-white font-medium text-xs sm:text-sm">
                    <AnimatedCounter value={post.upvote_count || 0} />
                  </span>
                  <span className="text-white/60 text-xs sm:text-sm hidden sm:inline">upvotes</span>
                  <span className="text-white/60 text-xs sm:inline">↑</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <span className="text-blue-400 text-sm sm:text-base">💬</span>
                  <span className="text-white font-medium text-xs sm:text-sm">
                    <AnimatedCounter value={post.comment_count || 0} />
                  </span>
                  <span className="text-white/60 text-xs sm:text-sm hidden sm:inline">comments</span>
                  <span className="text-white/60 text-xs sm:inline">💬</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <span className="text-green-400 text-sm sm:text-base">👁️</span>
                  <span className="text-white font-medium text-xs sm:text-sm">
                    <AnimatedCounter value={post.view_count || 0} />
                  </span>
                  <span className="text-white/60 text-xs sm:text-sm hidden sm:inline">views</span>
                  <span className="text-white/60 text-xs sm:inline">👁️</span>
                </div>
              </div>
            </div>
          </div>

          {/* Poll */}
          {poll && <PollComponent poll={poll} />}

          {/* Comments */}
          <div>
            <h3 className="text-white text-2xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Comments ({(post.comment_count || 0)})
            </h3>
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentComponent key={comment.uuid} comment={comment} />
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 py-16">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                  <p className="text-xl mb-2">No comments yet</p>
                  <p className="text-white/40">Be the first to share your thoughts!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 