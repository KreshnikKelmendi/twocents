# TwoCents Social Media Platform

A modern React/TypeScript social media app built for TwoCents. Features a complete conversion from Swift to React with real-time data, interactive polls, and responsive design.

## Features

- **Social Feed**: Browse posts with filters (Top All Time, Top Today, New Today, Controversial)
- **Post Details**: View posts with comments, polls, and user info
- **User Profiles**: Explore user profiles with stats and recent posts
- **Interactive Polls**: Polls with animated results
- **Vote System**: Upvote/downvote posts with persistent state
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Scroll Memory**: Remembers position when navigating

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **API**: Axios with JSON-RPC
- **Animations**: Framer Motion

## Main Components

- **Header**: Navigation with mobile menu
- **Feed**: Post feed with filtering and pagination
- **PostCard**: Individual post display
- **PostDetail**: Full post view with comments
- **UserProfile**: User profile page
- **Poll**: Interactive poll component
- **VoteButtons**: Voting interface

## API Integration

Complete TypeScript conversion of the original Swift API client:

```typescript
// Supported endpoints:
- GET /v1/posts/arena - Fetch posts with filters
- GET /v1/posts/get - Get post details
- GET /v1/comments/get - Fetch comments
- GET /v1/polls/get - Get poll results
- GET /v1/users/get - Get user profile
```

**Key Features:**
- JSON-RPC protocol compatibility
- Global vote state management
- Error handling with retry logic
- Type-safe API responses


**Built with React, TypeScript, and Tailwind CSS**
