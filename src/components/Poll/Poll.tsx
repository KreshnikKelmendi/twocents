import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface PollResult {
  average_balance: number;
  votes: number;
}

export interface PollResults {
  results: PollResult[];
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

interface PollProps {
  postUUID: string;
  pollOptions?: string[];
}

const Poll: React.FC<PollProps> = ({ postUUID, pollOptions }) => {
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const requestBody = {
        jsonrpc: '2.0',
        id: 'anon',
        method: '/v1/polls/get',
        params: { post_uuid: postUUID }
      };
      
      const response = await axios.post(`https://api.twocents.money/prod`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      });
      
      if (response.data && response.data.result && response.data.result.results) {
        setPollResults(response.data.result);
        // Trigger animation after a short delay
        setTimeout(() => setShowAnimation(true), 100);
      } else if (response.data && response.data.error) {
        setError(`API Error: ${response.data.error.message}`);
      } else {
        setError('Unexpected response format from server');
      }
    } catch (err: any) {
      
      let errorMessage = 'Failed to load poll';
      
      if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error - please check your internet connection';
      } else if (err.response?.status === 404) {
        errorMessage = 'No poll found for this post';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied - poll not available';
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postUUID && postUUID.trim() !== '') {
      fetchPoll();
    } else {
      setPollResults(null);
    }
  }, [postUUID, pollOptions]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
          <span className="ml-3 text-white/70">Loading poll results...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 mb-6 shadow-lg">
        <div className="text-center text-red-300">
          <p className="font-semibold mb-2">Failed to load poll</p>
          <p className="text-sm text-red-200">{error}</p>
          <button
            onClick={fetchPoll}
            className="mt-3 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!pollResults && !loading && !error) {
    return (
      <div className="w-full flex justify-center my-2">
        <div className="text-xs text-white/50 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center shadow-sm">
          No poll results available for this post.
        </div>
      </div>
    );
  }

  if (!pollResults) {
    return null;
  }

  // Calculate total votes and percentages
  const totalVotes = Object.values(pollResults.results).reduce((sum, result) => sum + result.votes, 0);
  const resultsArray = Object.entries(pollResults.results)
    .map(([index, result]) => ({
      index: parseInt(index),
      ...result
    }))
    .filter(result => result.votes > 0); // Filter out options with zero votes
  


  const handleShowResults = () => {
    setShowResults(true);
    // Trigger animation after a short delay
    setTimeout(() => setShowAnimation(true), 100);
  };

  const handleHideResults = () => {
    setShowResults(false);
    setShowAnimation(false);
  };

  return (
    <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6 shadow-lg">
      <h4 className="text-white font-bold text-lg mb-4">📊 Poll Results</h4>
      
      {!showResults ? (
        <div className="text-center">
          <button
            onClick={handleShowResults}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Click to Show Poll Results
          </button>
        </div>
      ) : (
        <div>
          <div className="text-center mb-4">
            <button
              onClick={handleHideResults}
              className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Hide Results
            </button>
          </div>
          <div className="space-y-3">
            {resultsArray.map((result, index) => {
              const percentage = totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;
              const optionText = pollOptions && pollOptions[result.index] 
                ? pollOptions[result.index] 
                : `Option ${result.index + 1}`;
              return (
                <div key={result.index} className="relative">
                  <div className="w-full text-left p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/90 text-sm font-medium">{optionText}</span>
                      <span className="text-white/70 text-xs">
                        {result.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-1500 ease-out ${
                          showAnimation ? 'animate-pulse' : ''
                        }`}
                        style={{ 
                          width: showAnimation ? `${percentage}%` : '0%',
                          transitionDelay: `${index * 200}ms`
                        }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-white/60">
                      Average Balance: ${result.average_balance.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="mt-4 text-center text-white/50 text-xs">
              Total votes: {totalVotes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Poll; 