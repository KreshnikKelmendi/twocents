import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser, fetchUserPosts, fetchUserWithRecentPosts, User, Post, api } from '../../utils/api';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isShowingRecentPosts, setIsShowingRecentPosts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check if we have temporary user data from post click
        const tempUserData = localStorage.getItem('tempUserData');
        let userData;
        
        if (tempUserData) {
          try {
            const parsedTempData = JSON.parse(tempUserData);
            
            // Check if the temp data matches the current user
            if (parsedTempData.uuid === userId) {
              
              // Get the API data for recent posts
              const apiUserData = await fetchUserWithRecentPosts(userId);
              
              // Merge the temp data with API data
              const mergedUser = {
                ...apiUserData.user,
                username: parsedTempData.username,
                balance: parsedTempData.balance,
                bio: parsedTempData.bio,
                age: parsedTempData.age,
                gender: parsedTempData.gender,
                arena: parsedTempData.arena
              };
              
              userData = {
                user: mergedUser,
                recentPosts: apiUserData.recentPosts
              };
              
              // Clear the temporary data
              localStorage.removeItem('tempUserData');
            } else {
              // Temp data doesn't match, fetch normally
              userData = await fetchUserWithRecentPosts(userId);
            }
          } catch (error) {
            userData = await fetchUserWithRecentPosts(userId);
          }
        } else {
          // No temp data, fetch normally
          userData = await fetchUserWithRecentPosts(userId);
        }
        
        // Set the user data
        setUser(userData.user);
        
        // Check if recentPosts exist
        if (userData.recentPosts && userData.recentPosts.length > 0) {
          setPosts(userData.recentPosts);
          setIsShowingRecentPosts(true);
        } else {
          setPosts([]);
          setIsShowingRecentPosts(false);
        }
        
      } catch (err: any) {
        setError(`Failed to load user: ${err.message}`);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

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

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-white/70 text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-screen flex flex-col justify-center items-center px-6">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl max-w-md backdrop-blur-sm">
          <p className="font-semibold text-lg mb-2">Error loading user:</p>
          <p>{error || 'User not found'}</p>
        </div>
        <button
                      onClick={() => {
              sessionStorage.setItem('hasNavigated', 'true');
              navigate('/');
            }}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 font-semibold shadow-lg"
        >
          ← Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-3 sm:p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              sessionStorage.setItem('hasNavigated', 'true');
              navigate('/');
            }}
            className="px-3 sm:px-4 py-2 text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            ← Back to Feed
          </button>
          <h1 className="text-white font-bold text-lg sm:text-xl">
            User Profile
          </h1>
          <div className="w-24 sm:w-32"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-6 sm:px-0 py-4 sm:py-8">
          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-2xl">
            <div className="flex items-start gap-3 sm:gap-6">
              <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center font-bold text-black shadow-lg text-lg sm:text-2xl ${getNetWorthColor(user.balance)}`}>
                {getInitials(user.username)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <h2 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl break-words">{user.username}</h2>
                  <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-md ${getNetWorthColor(user.balance)} text-black self-start sm:self-auto`}>
                    {formatNetWorth(user.balance)}
                  </span>
                </div>
                <p className="text-white/80 text-sm sm:text-lg mb-3 sm:mb-4 break-words">{user.bio}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-white/60 text-xs sm:text-sm">
                  {user.age && (
                    <span className="flex items-center gap-1 sm:gap-2 bg-white/5 px-2 py-1 rounded-lg">
                      🎂 <span className="hidden sm:inline">{user.age} years</span><span className="sm:hidden">{user.age}y</span>
                    </span>
                  )}
                  {user.gender && (
                    <span className="flex items-center gap-1 sm:gap-2 bg-white/5 px-2 py-1 rounded-lg">
                      {getGenderIcon(user.gender)} <span className="hidden sm:inline">{user.gender}</span><span className="sm:hidden">{user.gender.charAt(0).toUpperCase()}</span>
                    </span>
                  )}
                  {user.arena && (
                    <span className="flex items-center gap-1 sm:gap-2 bg-white/5 px-2 py-1 rounded-lg">
                      📍 <span className="hidden sm:inline">{user.arena}</span><span className="sm:hidden">{user.arena}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Posts */}
          <div>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-white text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                {isShowingRecentPosts ? 'Recent Posts' : 'Posts'} ({posts.length})
              </h3>
              {isShowingRecentPosts && (
                <p className="text-white/60 text-xs sm:text-sm mt-2">
                  Showing the most recent posts from this user
                </p>
              )}
            </div>
            {posts.length > 0 ? (
              <div className="space-y-3 sm:space-y-6">
                {posts.map((post) => (
                  <div 
                    key={post.uuid}
                    className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    onClick={() => {
                      navigate(`/post/${post.uuid}`);
                      // Scroll to top on all devices
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                      if (window.scrollTo) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <h4 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 break-words">{post.title}</h4>
                    <p className="text-white/80 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3 break-words">{post.text}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-4 text-white/60 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                          <span className="text-orange-400 text-xs sm:text-sm">↗</span>
                          <span className="text-white font-medium text-xs sm:text-sm">{post.upvote_count.toLocaleString()}</span>
                          <span className="text-white/60 text-xs hidden sm:inline">upvotes</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                          <span className="text-blue-400 text-xs sm:text-sm">💬</span>
                          <span className="text-white font-medium text-xs sm:text-sm">{post.comment_count.toLocaleString()}</span>
                          <span className="text-white/60 text-xs hidden sm:inline">comments</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                          <span className="text-green-400 text-xs sm:text-sm">👁️</span>
                          <span className="text-white font-medium text-xs sm:text-sm">{post.view_count.toLocaleString()}</span>
                          <span className="text-white/60 text-xs hidden sm:inline">views</span>
                        </div>
                      </div>
                      <span className="text-white/50 text-xs sm:text-sm bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full self-start sm:self-auto">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 py-8 sm:py-16">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-8">
                  <p className="text-lg sm:text-xl mb-2">No posts yet</p>
                  <p className="text-white/40 text-sm sm:text-base">This user hasn't made any posts.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 