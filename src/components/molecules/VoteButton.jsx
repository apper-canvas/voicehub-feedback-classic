import { useState } from "react";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";

const VoteButton = ({ 
  postId, 
  votes = 0, 
  hasVoted = false, 
  onVote,
  className,
  size = "md",
  showCount = true
}) => {
  const [isVoting, setIsVoting] = useState(false);
  const [currentVotes, setCurrentVotes] = useState(votes);
  const [voted, setVoted] = useState(hasVoted);

const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    const previousVoted = voted;
    const previousVotes = currentVotes;
    
    try {
      // Optimistic update with animation
      const newVoted = !voted;
      const newVotes = newVoted ? currentVotes + 1 : Math.max(0, currentVotes - 1);
      
      setVoted(newVoted);
      setCurrentVotes(newVotes);
      
      if (onVote) {
        await onVote(postId, newVoted);
      }
      
      // Success feedback with confetti animation
      toast.success(newVoted ? "🎉 Vote added!" : "Vote removed", {
        autoClose: 1500,
        className: newVoted ? "animate-pulse-scale" : ""
      });
    } catch (error) {
      // Revert on error
      setVoted(previousVoted);
      setCurrentVotes(previousVotes);
      toast.error("Failed to update vote");
    } finally {
      setIsVoting(false);
    }
  };
const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base", 
    lg: "w-20 h-20 text-xl"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7"
  };

return (
    <button
      onClick={handleVote}
      disabled={isVoting}
      className={cn(
        "flex flex-col items-center justify-center rounded-full border-2 transition-all duration-300 group relative overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-95",
        voted 
          ? "bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30" 
          : "bg-white border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:shadow-lg hover:scale-105",
        sizeClasses[size],
        voted && "animate-pulse-scale",
        className
      )}
      aria-label={voted ? "Remove vote" : "Vote"}
      title={voted ? "Click to remove your vote" : "Click to vote"}
    >
      {/* Confetti Effect on Vote */}
      {voted && (
        <span className="absolute inset-0 animate-ping opacity-20 bg-white rounded-full"></span>
      )}
      
      <ApperIcon 
        name="ChevronUp"
        className={cn(
          iconSizes[size],
          "transition-transform duration-300",
          isVoting && "animate-pulse",
          voted && "scale-110",
          !voted && "group-hover:scale-110"
        )} 
      />
      
      {showCount && (
        <span className={cn(
          "font-bold leading-none mt-1",
          size === "sm" && "text-xs",
          size === "md" && "text-sm", 
          size === "lg" && "text-lg"
        )}>
          {currentVotes}
        </span>
      )}
    </button>
  );
};

export default VoteButton;