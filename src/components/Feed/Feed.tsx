import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Post {
  uuid: string;
  username: string;
  net_worth: number;
  content: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
  views_count: number;
  created_at: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== TESTING API ACCESS ===');
      
      // First, let's test if the API is accessible at all
      try {
        console.log('🔄 Testing basic API connectivity...');
        const testResponse = await axios.get('https://api.twocents.money', {
          timeout: 5000
        });
        console.log('✅ API is accessible:', testResponse.status);
        console.log('API response:', testResponse.data);
      } catch (testError: any) {
        console.log('❌ API connectivity test failed:', testError.message);
      }
      
      // Now try the JSON-RPC call
      const requestData = {
        jsonrpc: '2.0',
        id: 'anon',
        method: '/v1/posts/arena',
        params: {
          filter: 'Top All Time'
        }
      };
      
      console.log('🔄 Making JSON-RPC request:', JSON.stringify(requestData, null, 2));
      
      try {
        const response = await axios.post('https://api.twocents.money', requestData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        });
        
        console.log('✅ JSON-RPC Response status:', response.status);
        console.log('✅ JSON-RPC Response data:', response.data);
        
        if (response.data.result && response.data.result.posts) {
          const apiPosts = response.data.result.posts;
          console.log(`✅ SUCCESS: API returned ${apiPosts.length} posts`);
          setPosts(apiPosts.slice(0, 100));
        } else if (response.data.error) {
          console.log('❌ API returned error:', response.data.error);
          setError(`API Error: ${response.data.error.message || 'Unknown error'}`);
          setPosts([]);
        } else {
          console.log('❌ Unexpected response structure:', response.data);
          setError('API returned unexpected response structure');
          setPosts([]);
        }
        
      } catch (apiError: any) {
        console.log('❌ JSON-RPC call failed:', apiError.message);
        if (apiError.response) {
          console.log('Error response:', apiError.response.data);
          console.log('Error status:', apiError.response.status);
        }
        
        // Try alternative endpoint
        try {
          console.log('🔄 Trying alternative endpoint...');
          const altRequestData = {
            jsonrpc: '2.0',
            id: 'anon',
            method: 'posts.arena',
            params: {
              filter: 'Top All Time'
            }
          };
          
          const altResponse = await axios.post('https://api.twocents.money', altRequestData, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          console.log('✅ Alternative endpoint response:', altResponse.data);
          
          if (altResponse.data.result && altResponse.data.result.posts) {
            const apiPosts = altResponse.data.result.posts;
            console.log(`✅ SUCCESS: Alternative endpoint returned ${apiPosts.length} posts`);
            setPosts(apiPosts.slice(0, 100));
          } else {
            throw new Error('Alternative endpoint also failed');
          }
          
        } catch (altError: any) {
          console.log('❌ Alternative endpoint failed:', altError.message);
          throw new Error(`API is not accessible. Please check if the API endpoint is correct and the service is running.`);
        }
      }
      
    } catch (err: any) {
      console.error('❌ FINAL ERROR:', err);
      setError(`Failed to load posts: ${err.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
      console.log('=== API TESTING COMPLETED ===');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const formatNetWorth = (netWorth: number) => {
    if (netWorth >= 1000000) {
      return `$${(netWorth / 1000000).toFixed(1)}M`;
    } else if (netWorth >= 1000) {
      return `$${(netWorth / 1000).toFixed(1)}K`;
    } else {
      return `$${netWorth.toLocaleString()}`;
    }
  };

  const getInitials = (username: string) => {
    return username.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
  };

  const getNetWorthColor = (netWorth: number) => {
    if (netWorth >= 1000000) return 'bg-gradient-to-r from-green-400 to-blue-500';
    if (netWorth >= 100000) return 'bg-gradient-to-r from-orange-400 to-yellow-500';
    if (netWorth >= 10000) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (netWorth >= 1000) return 'bg-gradient-to-r from-blue-400 to-purple-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 mt-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 mt-8">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Top 100 Posts</h2>
        <p className="text-white/60">The most popular posts from the twocents community</p>
        <p className="text-white/40 text-sm mt-2">Showing {posts.length} posts from API</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading posts:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">The API at https://api.twocents.money may not be accessible or the endpoint may be incorrect.</p>
          <button 
            onClick={fetchPosts}
            className="mt-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded hover:bg-red-500/30"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div
            key={post.uuid}
            onClick={() => handlePostClick(post.uuid)}
            className="bg-white/5 border border-white/10 rounded-lg p-6 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:border-white/20"
          >
            <div className="flex items-start gap-4">
              {/* Post Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-black">
                {index + 1}
              </div>

              {/* User Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black ${getNetWorthColor(post.net_worth)}`}>
                {getInitials(post.username)}
              </div>

              {/* Post Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-medium truncate">{post.username}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${getNetWorthColor(post.net_worth)} text-black`}>
                    {formatNetWorth(post.net_worth)}
                  </span>
                </div>
                
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {post.content}
                </p>

                {/* Post Stats */}
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      <span>↗</span>
                      <span>{post.upvotes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>💬</span>
                      <span>{post.comments_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>👁️</span>
                      <span>{post.views_count.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-white/40">Click to view →</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && !error && (
        <div className="text-center text-white/60 py-12">
          <p>No posts found from API.</p>
        </div>
      )}
    </div>
  );
};

export default Feed; 