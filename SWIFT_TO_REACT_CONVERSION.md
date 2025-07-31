# Swift to React/TypeScript Conversion

This document explains the conversion of the Swift TwoCents API client to React/TypeScript.

## Overview

The original Swift code has been converted to a React/TypeScript implementation that maintains the same functionality while adapting to React's component-based architecture.

## Key Conversions

### 1. Enum Conversion

**Swift:**
```swift
enum TwoCentsFilter: String, CaseIterable {
  case newToday = "New Today"
  case topToday = "Top Today"
  case topAllTime = "Top All Time"
  case controversial = "Controversial All Time"
}
```

**TypeScript:**
```typescript
export enum TwoCentsFilter {
  NEW_TODAY = "newToday",
  TOP_TODAY = "topToday", 
  TOP_ALL_TIME = "topAllTime",
  CONTROVERSIAL = "controversial"
}
```

### 2. Vote State Management

**Swift:**
```swift
var upvotedUUIDs: Set<String> = []
var downvotedUUIDs: Set<String> = []
var viewedUUIDs: Set<String> = []

// In getPosts method:
await MainActor.run {
  if case let .success(data) = res {
    upvotedUUIDs = []
    downvotedUUIDs = []
    data.views?.forEach { view in self.viewedUUIDs.insert(view.content_uuid) }
    data.votes?.forEach { vote in
      if vote.vote_type == 1 { self.upvotedUUIDs.insert(vote.content_uuid) }
      if vote.vote_type == -1 { self.downvotedUUIDs.insert(vote.content_uuid) }
    }
  }
}
```

**TypeScript:**
```typescript
// Global vote state with reactive updates
let globalVoteState: VoteState = {
  upvotedUUIDs: new Set(),
  downvotedUUIDs: new Set(),
  viewedUUIDs: new Set()
};

// In getPosts method:
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
```

### 3. API Call Method

**Swift:**
```swift
func call<T: Decodable>(_ method: String, _ parameters: [String: Any] = [:])
  async -> Result<T, APIError>
{
  var mutableParams = parameters
  if uuid != nil {
    mutableParams["secret_key"] = self.secretKey
  }
  var request = URLRequest(url: BASE_API_URL, cachePolicy: .reloadIgnoringLocalCacheData)
  request.httpMethod = "POST"
  request.setValue("application/json", forHTTPHeaderField: "accept")
  request.setValue("application/json", forHTTPHeaderField: "content-type")
  let body: [String: Any] = [
    "jsonrpc": "2.0",
    "id": uuid ?? "anon",
    "method": method,
    "params": mutableParams,
  ]
  request.httpBody = try! JSONSerialization.data(withJSONObject: body, options: .prettyPrinted)
  // ... rest of implementation
}
```

**TypeScript:**
```typescript
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

  const response = await axios.post(BASE_API_URL, body, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    timeout: 10000,
  });
  // ... rest of implementation
}
```

## Usage Examples

### 1. Fetching Posts with Filter

```typescript
import { fetchPosts, TwoCentsFilter } from '../utils/api';

const MyComponent = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await fetchPosts(TwoCentsFilter.TOP_ALL_TIME);
        setPosts(posts);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };
    
    loadPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.uuid}>{post.content}</div>
      ))}
    </div>
  );
};
```

### 2. Using Vote State

```typescript
import { useVoteState } from '../utils/api';

const PostComponent = ({ postId }) => {
  const { isUpvoted, isDownvoted, isViewed, markAsUpvoted, markAsDownvoted } = useVoteState();

  return (
    <div>
      <button 
        onClick={() => markAsUpvoted(postId)}
        className={isUpvoted(postId) ? 'voted' : ''}
      >
        Upvote
      </button>
      <button 
        onClick={() => markAsDownvoted(postId)}
        className={isDownvoted(postId) ? 'voted' : ''}
      >
        Downvote
      </button>
      {isViewed(postId) && <span>Viewed</span>}
    </div>
  );
};
```

### 3. Fetching Individual Post

```typescript
import { fetchPost } from '../utils/api';

const PostDetail = ({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPost(postId);
        setPost(postData);
      } catch (error) {
        console.error('Failed to load post:', error);
      }
    };
    
    loadPost();
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.username}</h1>
      <p>{post.content}</p>
      <div>Upvotes: {post.upvotes}</div>
      <div>Downvotes: {post.downvotes}</div>
    </div>
  );
};
```

## Key Features

1. **Reactive Vote State**: The vote state is globally managed and reactive across all components
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Error Handling**: Comprehensive error handling with try-catch blocks
4. **Filter Support**: All four filter options from the original Swift enum
5. **JSON-RPC**: Maintains the same JSON-RPC protocol as the original
6. **Vote Tracking**: Tracks upvotes, downvotes, and, viewed posts

## API Endpoints

- **Base URL**: `https://api.twocents.money/prod`
- **Get Posts**: `/v1/posts/arena` with filter parameter
- **Get Post**: `/v1/posts/get` with post_uuid parameter

## Dependencies

- `axios`: For HTTP requests
- `react`: For React hooks and components
- `typescript`: For type safety

The conversion maintains the same functionality as the original Swift code while adapting to React's component-based architecture and TypeScript's type system. 