import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  uuid: string;
  username: string;
  net_worth: number;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  replies?: Comment[];
}

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
  comments?: Comment[];
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== FETCHING POST DETAIL ===');
      console.log('Post ID:', postId);
      
      // Try direct API call first
      try {
        console.log('🔄 Making direct API call...');
        const response = await axios.post('https://api.twocents.money', {
          jsonrpc: '2.0',
          id: 'anon',
          method: '/v1/posts/get',
          params: {
            post_uuid: postId
          }
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        });
        
        console.log('✅ Direct API response status:', response.status);
        console.log('✅ Direct API response data:', response.data);
        
        if (response.data.result && response.data.result.post) {
          console.log('✅ SUCCESS: Post data received');
          setPost(response.data.result.post);
        } else if (response.data.error) {
          console.log('❌ API returned error:', response.data.error);
          throw new Error(`API Error: ${response.data.error.message || 'Unknown error'}`);
        } else {
          console.log('❌ Unexpected response structure:', response.data);
          throw new Error('API returned unexpected response structure');
        }
        
      } catch (apiError: any) {
        console.log('❌ Direct API call failed:', apiError.message);
        if (apiError.response) {
          console.log('Error response:', apiError.response.data);
          console.log('Error status:', apiError.response.status);
        }
        
        // Try alternative endpoint format
        try {
          console.log('🔄 Trying alternative endpoint format...');
          const altResponse = await axios.post('https://api.twocents.money', {
            jsonrpc: '2.0',
            id: 'anon',
            method: 'posts.get',
            params: {
              post_uuid: postId
            }
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          console.log('✅ Alternative endpoint response:', altResponse.data);
          
          if (altResponse.data.result && altResponse.data.result.post) {
            console.log('✅ SUCCESS: Alternative endpoint returned post data');
            setPost(altResponse.data.result.post);
          } else {
            throw new Error('Alternative endpoint also failed');
          }
          
        } catch (altError: any) {
          console.log('❌ Alternative endpoint failed:', altError.message);
          throw new Error(`Failed to fetch post from API. The API may not be accessible or the endpoint may be incorrect.`);
        }
      }
      
    } catch (err: any) {
      console.error('❌ FINAL ERROR:', err);
      setError(`Failed to load post: ${err.message}`);
      setPost(null);
    } finally {
      setLoading(false);
      console.log('=== POST FETCHING COMPLETED ===');
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const CommentComponent: React.FC<{ comment: Comment; level?: number }> = ({ comment, level = 0 }) => (
    <div className={`${level > 0 ? 'ml-8 border-l border-white/10 pl-4' : ''}`}>
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black ${getNetWorthColor(comment.net_worth)}`}>
            {getInitials(comment.username)}
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-white font-medium text-sm">{comment.username}</h4>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getNetWorthColor(comment.net_worth)} text-black`}>
                {formatNetWorth(comment.net_worth)}
              </span>
              <span className="text-white/40 text-xs">{formatDate(comment.created_at)}</span>
            </div>
            
            <p className="text-white/80 text-sm mb-3 leading-relaxed">
              {comment.content}
            </p>

            {/* Comment Stats */}
            <div className="flex items-center gap-4 text-white/60 text-xs">
              <div className="flex items-center gap-1">
                <span>↗</span>
                <span>{comment.upvotes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>↘</span>
                <span>{comment.downvotes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.uuid} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 mt-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error loading post:</p>
          <p>{error || 'Post not found'}</p>
          <p className="text-sm mt-2">The API at https://api.twocents.money may not be accessible or the endpoint may be incorrect.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200"
        >
          ← Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 mt-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2"
      >
        ← Back to Feed
      </button>

      {/* Main Post */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-black ${getNetWorthColor(post.net_worth)}`}>
            {getInitials(post.username)}
          </div>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-white font-semibold text-xl">{post.username}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getNetWorthColor(post.net_worth)} text-black`}>
                {formatNetWorth(post.net_worth)}
              </span>
              <span className="text-white/40 text-sm">{formatDate(post.created_at)}</span>
            </div>
            
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              {post.content}
            </p>

            {/* Post Stats */}
            <div className="flex items-center justify-between text-white/60 text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg">↗</span>
                  <span>{post.upvotes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">↘</span>
                  <span>{post.downvotes.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💬</span>
                  <span>{post.comments_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">👁️</span>
                  <span>{post.views_count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-white text-xl font-semibold mb-6">
          Comments ({post.comments_count})
        </h2>
        
        {post.comments && post.comments.length > 0 ? (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <CommentComponent key={comment.uuid} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 py-12">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail; 