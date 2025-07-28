import axios from 'axios';
import React from 'react';

// API Configuration
const BASE_API_URL = 'https://api.twocents.money/prod';

// Filter options matching the Swift enum
export enum TwoCentsFilter {
  NEW_TODAY = "newToday",
  TOP_TODAY = "topToday", 
  TOP_ALL_TIME = "topAllTime",
  CONTROVERSIAL = "controversial"
}

// TypeScript interfaces for API responses
export interface Post {
  uuid: string;
  created_at: string;
  updated_at: string;
  author_uuid: string;
  upvote_count: number;
  comment_count: number;
  view_count: number;
  report_count: number;
  title: string;
  text: string;
  topic: string;
  author_meta: {
    bio: string;
    age: number;
    gender: string;
    balance: number;
    arena: string;
    subscription?: string;
    username?: string;
  };
  comments?: Comment[];
}

export interface PollOption {
  uuid: string;
  text: string;
  vote_count: number;
  percentage: number;
}

export interface Poll {
  uuid: string;
  question: string;
  options: PollOption[];
  total_votes: number;
  user_vote?: string;
}

export interface PollResponse {
  poll: Poll;
}

export interface Comment {
  uuid: string;
  author_uuid: string;
  content: string;
  upvote_count: number;
  created_at: string;
  author_meta: {
    username?: string;
    balance: number;
    age?: number;
    gender?: string;
    arena?: string;
  };
  replies?: Comment[];
}

export interface PostsFeedResponse {
  posts: Post[];
  views?: Array<{ content_uuid: string }>;
  votes?: Array<{ content_uuid: string; vote_type: number }>;
}

export interface PostGetResponse {
  post: Post;
}

export interface JSONRPCResponse<T> {
  jsonrpc: string;
  id: string;
  result?: T;
  error?: {
    code: number;
    message: string;
  };
}

export interface APIError {
  code: number;
  message: string;
}

// Vote tracking state
export interface VoteState {
  upvotedUUIDs: Set<string>;
  downvotedUUIDs: Set<string>;
  viewedUUIDs: Set<string>;
}

// Global vote state for reactive updates
let globalVoteState: VoteState = {
  upvotedUUIDs: new Set(),
  downvotedUUIDs: new Set(),
  viewedUUIDs: new Set()
};

// Listeners for state changes
const stateListeners: Set<() => void> = new Set();

// Notify all listeners of state changes
const notifyStateChange = () => {
  stateListeners.forEach(listener => listener());
};

// API Client class
export class TwoCentsAPI {
  private uuid: string | null = null;
  private secretKey: string | null = null;

  constructor(uuid?: string, secretKey?: string) {
    this.uuid = uuid || null;
    this.secretKey = secretKey || null;
  }

  // Get vote state
  getVoteState(): VoteState {
    return globalVoteState;
  }

  // Check if a post is upvoted
  isUpvoted(uuid: string): boolean {
    return globalVoteState.upvotedUUIDs.has(uuid);
  }

  // Check if a post is downvoted
  isDownvoted(uuid: string): boolean {
    return globalVoteState.downvotedUUIDs.has(uuid);
  }

  // Check if a post is viewed
  isViewed(uuid: string): boolean {
    return globalVoteState.viewedUUIDs.has(uuid);
  }

  // Mark post as viewed
  markAsViewed(uuid: string): void {
    globalVoteState.viewedUUIDs.add(uuid);
    notifyStateChange();
  }

  // Mark post as upvoted
  markAsUpvoted(uuid: string): void {
    globalVoteState.upvotedUUIDs.add(uuid);
    globalVoteState.downvotedUUIDs.delete(uuid);
    notifyStateChange();
  }

  // Mark post as downvoted
  markAsDownvoted(uuid: string): void {
    globalVoteState.downvotedUUIDs.add(uuid);
    globalVoteState.upvotedUUIDs.delete(uuid);
    notifyStateChange();
  }

  // Get posts feed with fallback logic
  async getPosts(filter: TwoCentsFilter = TwoCentsFilter.TOP_ALL_TIME): Promise<PostsFeedResponse> {
    const filterString = String(filter);
    
    // Try different approaches to get posts
    const attempts = [
      // Attempt 1: Standard approach
      () => this.call<PostsFeedResponse>('/v1/posts/arena', { filter: filterString }),
      
      // Attempt 2: Try without parameters
      () => this.call<PostsFeedResponse>('/v1/posts/arena', {}),
      
      // Attempt 3: Try different endpoint
      () => this.call<PostsFeedResponse>('/v1/posts', { filter: filterString }),
      
      // Attempt 4: Try with different parameter name
      () => this.call<PostsFeedResponse>('/v1/posts/arena', { filter_type: filterString }),
      
      // Attempt 5: Try with sort parameter
      () => this.call<PostsFeedResponse>('/v1/posts/arena', { sort: filterString })
    ];

    let lastError: Error | null = null;
    
    for (const attempt of attempts) {
      try {
        const response = await attempt();
        
        // Update vote state from response
        if (response.views) {
          response.views.forEach(view => {
            globalVoteState.viewedUUIDs.add(view.content_uuid);
          });
        }
        
        if (response.votes) {
          response.votes.forEach(vote => {
            if (vote.vote_type === 1) {
              globalVoteState.upvotedUUIDs.add(vote.content_uuid);
            }
            if (vote.vote_type === -1) {
              globalVoteState.downvotedUUIDs.add(vote.content_uuid);
            }
          });
        }
        
        notifyStateChange();
        return response;
      } catch (error: any) {
        lastError = error;
        continue;
      }
    }
    
    // If all attempts failed, throw the last error
    throw lastError || new Error('All API attempts failed');
  }

  // Get single post
  async getPost(uuid: string): Promise<PostGetResponse> {
    return this.call<PostGetResponse>('/v1/posts/get', { post_uuid: uuid });
  }

  // Get poll for a post
  async getPoll(postUUID: string): Promise<PollResponse> {
    return this.call<PollResponse>('/v1/polls/get', { post_uuid: postUUID });
  }

  async getComments(postUUID: string): Promise<{ comments: Comment[] }> {
    return this.call<{ comments: Comment[] }>('/v1/comments/get', { post_uuid: postUUID });
  }

  // Generic JSON-RPC call method
  private async call<T>(method: string, parameters: Record<string, any> = {}): Promise<T> {
    const mutableParams = { ...parameters };
    
    // Add secret key if available
    if (this.uuid && this.secretKey) {
      mutableParams.secret_key = this.secretKey;
    }

    const body = {
      jsonrpc: '2.0',
      id: this.uuid || 'anon',
      method: method,
      params: mutableParams,
    };

    try {
      const response = await axios.post(BASE_API_URL, body, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });

      const decodedResponse: JSONRPCResponse<T> = response.data;

      if (decodedResponse.error) {
        throw new Error(`API Error ${decodedResponse.error.code}: ${decodedResponse.error.message}`);
      }

      if (decodedResponse.result) {
        return decodedResponse.result;
      }

      throw new Error('Unknown error, missing both result and error');
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(`API Error ${error.response.data.error.code}: ${error.response.data.error.message}`);
      }
      throw error;
    }
  }
}

// Create default API instance
export const api = new TwoCentsAPI();

// Helper functions for components
export const fetchPosts = async (filter: TwoCentsFilter = TwoCentsFilter.TOP_ALL_TIME): Promise<Post[]> => {
  try {
    const response = await api.getPosts(filter);
    return response.posts || [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

export const fetchPost = async (uuid: string): Promise<Post> => {
  try {
    const response = await api.getPost(uuid);
    console.log('Post API response:', response);
    return response.post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    throw error;
  }
};

export const fetchPoll = async (postUUID: string): Promise<Poll> => {
  try {
    const response = await api.getPoll(postUUID);
    return response.poll;
  } catch (error) {
    console.error('Failed to fetch poll:', error);
    throw error;
  }
};

export const fetchComments = async (postUUID: string): Promise<Comment[]> => {
  try {
    const response = await api.getComments(postUUID);
    console.log('Comments API response:', response);
    return response.comments || [];
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw error;
  }
};

// Vote tracking helpers
export const getVoteState = (): VoteState => api.getVoteState();
export const isUpvoted = (uuid: string): boolean => api.isUpvoted(uuid);
export const isDownvoted = (uuid: string): boolean => api.isDownvoted(uuid);
export const isViewed = (uuid: string): boolean => api.isViewed(uuid);
export const markAsViewed = (uuid: string): void => api.markAsViewed(uuid);
export const markAsUpvoted = (uuid: string): void => api.markAsUpvoted(uuid);
export const markAsDownvoted = (uuid: string): void => api.markAsDownvoted(uuid);

// Custom hook for reactive vote state
export const useVoteState = () => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  React.useEffect(() => {
    const listener = () => forceUpdate();
    stateListeners.add(listener);
    return () => {
      stateListeners.delete(listener);
    };
  }, []);

  return {
    voteState: globalVoteState,
    isUpvoted: (uuid: string) => globalVoteState.upvotedUUIDs.has(uuid),
    isDownvoted: (uuid: string) => globalVoteState.downvotedUUIDs.has(uuid),
    isViewed: (uuid: string) => globalVoteState.viewedUUIDs.has(uuid),
    markAsViewed,
    markAsUpvoted,
    markAsDownvoted
  };
}; 