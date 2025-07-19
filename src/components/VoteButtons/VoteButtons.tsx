import React from 'react';
import { useVoteState } from '../../utils/api';

interface VoteButtonsProps {
  postId: string;
  upvotes: number;
  downvotes: number;
  onVoteChange?: (upvotes: number, downvotes: number) => void;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ 
  postId, 
  upvotes, 
  downvotes, 
  onVoteChange 
}) => {
  const { isUpvoted, isDownvoted, markAsUpvoted, markAsDownvoted } = useVoteState();

  const handleUpvote = () => {
    markAsUpvoted(postId);
    // In a real app, you would also call the API to update the vote
    if (onVoteChange) {
      const newUpvotes = isUpvoted(postId) ? upvotes - 1 : upvotes + 1;
      const newDownvotes = isDownvoted(postId) ? downvotes - 1 : downvotes;
      onVoteChange(newUpvotes, newDownvotes);
    }
  };

  const handleDownvote = () => {
    markAsDownvoted(postId);
    // In a real app, you would also call the API to update the vote
    if (onVoteChange) {
      const newUpvotes = isUpvoted(postId) ? upvotes - 1 : upvotes;
      const newDownvotes = isDownvoted(postId) ? downvotes - 1 : downvotes + 1;
      onVoteChange(newUpvotes, newDownvotes);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleUpvote}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isUpvoted(postId)
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
        }`}
      >
        <span className="text-lg">↗</span>
        <span className="font-medium">{upvotes.toLocaleString()}</span>
      </button>

      <button
        onClick={handleDownvote}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isDownvoted(postId)
            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
        }`}
      >
        <span className="text-lg">↘</span>
        <span className="font-medium">{downvotes.toLocaleString()}</span>
      </button>
    </div>
  );
};

export default VoteButtons; 