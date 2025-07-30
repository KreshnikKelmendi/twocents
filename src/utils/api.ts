import axios from 'axios';
import React from 'react';

// API
const BASE_API_URL = 'https://api.twocents.money/prod';

export enum TwoCentsFilter {
  NEW_TODAY = "newToday",
  TOP_TODAY = "topToday", 
  TOP_ALL_TIME = "topAllTime",
  CONTROVERSIAL = "controversial"
}

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
  post_meta?: {
    poll?: string[];
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
  text: string;
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

export interface User {
  uuid: string;
  username: string;
  bio: string;
  age: number;
  gender: string;
  balance: number;
  arena: string;
  subscription_type: number;
  created_at: string;
  updated_at: string;
  recentPosts?: Post[]; // Add recentPosts field
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

export interface VoteState {
  upvotedUUIDs: Set<string>;
  downvotedUUIDs: Set<string>;
  viewedUUIDs: Set<string>;
}

let globalVoteState: VoteState = {
  upvotedUUIDs: new Set(),
  downvotedUUIDs: new Set(),
  viewedUUIDs: new Set()
};

const stateListeners: Set<() => void> = new Set();

const notifyStateChange = () => {
  stateListeners.forEach(listener => listener());
};

export class TwoCentsAPI {
  private uuid: string | null = null;
  private secretKey: string | null = null;

  constructor(uuid?: string, secretKey?: string) {
    this.uuid = uuid || null;
    this.secretKey = secretKey || null;
  }

  getVoteState(): VoteState {
    return globalVoteState;
  }

  isUpvoted(uuid: string): boolean {
    return globalVoteState.upvotedUUIDs.has(uuid);
  }

  isDownvoted(uuid: string): boolean {
    return globalVoteState.downvotedUUIDs.has(uuid);
  }

  isViewed(uuid: string): boolean {
    return globalVoteState.viewedUUIDs.has(uuid);
  }

  markAsViewed(uuid: string): void {
    globalVoteState.viewedUUIDs.add(uuid);
    notifyStateChange();
  }

  markAsUpvoted(uuid: string): void {
    globalVoteState.upvotedUUIDs.add(uuid);
    globalVoteState.downvotedUUIDs.delete(uuid);
    notifyStateChange();
  }

  markAsDownvoted(uuid: string): void {
    globalVoteState.downvotedUUIDs.add(uuid);
    globalVoteState.upvotedUUIDs.delete(uuid);
    notifyStateChange();
  }

  async getPosts(filter: TwoCentsFilter = TwoCentsFilter.TOP_ALL_TIME): Promise<PostsFeedResponse> {
    const filterString = String(filter);
    
    const attempts = [
      () => this.call<PostsFeedResponse>('/v1/posts/arena', { filter: filterString }),
      () => this.call<PostsFeedResponse>('/v1/posts/arena', {}),
      () => this.call<PostsFeedResponse>('/v1/posts', { filter: filterString }),
      () => this.call<PostsFeedResponse>('/v1/posts/arena', { filter_type: filterString }),
      () => this.call<PostsFeedResponse>('/v1/posts/arena', { sort: filterString })
    ];

    let lastError: Error | null = null;
    
    for (const attempt of attempts) {
      try {
        const response = await attempt();
        
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
    
    throw lastError || new Error('All API attempts failed');
  }

  async getPost(uuid: string): Promise<PostGetResponse> {
    return this.call<PostGetResponse>('/v1/posts/get', { post_uuid: uuid });
  }

  async getPoll(postUUID: string): Promise<PollResponse> {
    return this.call<PollResponse>('/v1/polls/get', { post_uuid: postUUID });
  }

  async getComments(postUUID: string): Promise<{ comments: Comment[] }> {
    return this.call<{ comments: Comment[] }>('/v1/comments/get', { post_uuid: postUUID });
  }

  async votePoll(pollUUID: string, optionUUID: string): Promise<void> {
    return this.call<void>('/v1/polls/vote', { poll_uuid: pollUUID, option_uuid: optionUUID });
  }

  async getUser(userUUID: string): Promise<{ user: User; recentPosts?: Post[]; totalUpvotes?: number; recentCommentsEnriched?: any[]; recentPostsEnriched?: any[]; aliasesGiven?: any[]; aliasesReceived?: any[] }> {
    return this.call<{ user: User; recentPosts?: Post[]; totalUpvotes?: number; recentCommentsEnriched?: any[]; recentPostsEnriched?: any[]; aliasesGiven?: any[]; aliasesReceived?: any[] }>('/v1/users/get', { user_uuid: userUUID });
  }

  async getUserPosts(userUUID: string): Promise<{ posts: Post[] }> {
    return this.call<{ posts: Post[] }>('/v1/users/posts', { user_uuid: userUUID });
  }

  private async call<T>(method: string, parameters: Record<string, any> = {}): Promise<T> {
    const mutableParams = { ...parameters };
    
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

export const api = new TwoCentsAPI();

export const fetchPosts = async (filter: TwoCentsFilter = TwoCentsFilter.TOP_ALL_TIME): Promise<Post[]> => {
  try {
    const response = await api.getPosts(filter);
    return response.posts || [];
  } catch (error) {
    throw error;
  }
};

export const fetchPost = async (uuid: string): Promise<Post> => {
  try {
    const response = await api.getPost(uuid);
    return response.post;
  } catch (error) {
    throw error;
  }
};

export const fetchPoll = async (postUUID: string): Promise<Poll> => {
  try {
    const response = await api.getPoll(postUUID);
    return response.poll;
  } catch (error) {
    throw error;
  }
};

export const fetchComments = async (postUUID: string): Promise<Comment[]> => {
  try {
    const response = await api.getComments(postUUID);
    return response.comments || [];
  } catch (error) {
    throw error;
  }
};

export const votePoll = async (pollUUID: string, optionUUID: string): Promise<void> => {
  try {
    await api.votePoll(pollUUID, optionUUID);
  } catch (error) {
    throw error;
  }
};

export const fetchUser = async (userUUID: string): Promise<User> => {
  try {
    const response = await api.getUser(userUUID);
    return response.user;
  } catch (error) {
    throw error;
  }
};

export const fetchUserPosts = async (userUUID: string): Promise<Post[]> => {
  try {
    const response = await api.getUserPosts(userUUID);
    return response.posts || [];
  } catch (error) {
    throw error;
  }
};

export const fetchUserWithRecentPosts = async (userUUID: string): Promise<{ user: User; recentPosts?: Post[] }> => {
  try {
    const response = await api.getUser(userUUID);
    return { user: response.user, recentPosts: response.recentPosts };
  } catch (error) {
    throw error;
  }
};

export const getVoteState = (): VoteState => api.getVoteState();
export const isUpvoted = (uuid: string): boolean => api.isUpvoted(uuid);
export const isDownvoted = (uuid: string): boolean => api.isDownvoted(uuid);
export const isViewed = (uuid: string): boolean => api.isViewed(uuid);
export const markAsViewed = (uuid: string): void => api.markAsViewed(uuid);
export const markAsUpvoted = (uuid: string): void => api.markAsUpvoted(uuid);
export const markAsDownvoted = (uuid: string): void => api.markAsDownvoted(uuid);

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