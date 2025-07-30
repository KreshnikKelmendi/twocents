import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, useVoteState } from '../../utils/api';

interface PostCardProps {
  post: Post;
  index: number;
  onPostClick: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, index, onPostClick }) => {
  const navigate = useNavigate();
  const { isUpvoted, isDownvoted, isViewed } = useVoteState();

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

  const truncateText = (text: string, maxWords: number = 250) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const getVoteStatus = (postId: string) => {
    return {
      isUpvoted: isUpvoted(postId),
      isDownvoted: isDownvoted(postId),
      isViewed: isViewed(postId)
    };
  };

  const handleUserProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Store the post's author_meta data for consistency
    if (post.author_meta) {
      localStorage.setItem('tempUserData', JSON.stringify({
        uuid: post.author_uuid,
        username: post.author_meta.username,
        balance: post.author_meta.balance,
        bio: post.author_meta.bio,
        age: post.author_meta.age,
        gender: post.author_meta.gender,
        arena: post.author_meta.arena
      }));
    }
    
    navigate(`/user/${post.author_uuid}`);
    // Scroll to top when navigating to user profile - iOS compatible
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const voteStatus = getVoteStatus(post.uuid);

  return (
    <div
      onClick={() => onPostClick(post.uuid)}
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
                onClick={handleUserProfileClick}
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
};

export default PostCard; 