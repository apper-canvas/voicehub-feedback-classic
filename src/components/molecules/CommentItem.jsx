import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import CommentInput from "@/components/molecules/CommentInput";

const CommentItem = ({ 
  comment, 
  currentUserId = "user-1",
  onVote,
  onReply,
  onEdit,
  onDelete,
  depth = 0
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voted, setVoted] = useState(comment.hasVoted);
  const [voteCount, setVoteCount] = useState(comment.votes);

  const isAuthor = comment.authorId === currentUserId;
  const isPostAuthor = comment.authorId === "1"; // Mock - would check against post author
  const maxDepth = 3;
  const canReply = depth < maxDepth;

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    const newVoted = !voted;
    const newVoteCount = newVoted ? voteCount + 1 : Math.max(0, voteCount - 1);
    
    // Optimistic update
    setVoted(newVoted);
    setVoteCount(newVoteCount);
    
    try {
      await onVote(comment.Id, newVoted);
      toast.success(newVoted ? "Vote added!" : "Vote removed", { autoClose: 1500 });
    } catch (error) {
      // Revert on error
      setVoted(!newVoted);
      setVoteCount(newVoted ? voteCount : voteCount + 1);
      toast.error("Failed to update vote");
    } finally {
      setIsVoting(false);
    }
  };

  const handleReply = async (content) => {
    try {
      await onReply(comment.Id, content);
      setShowReplyInput(false);
      toast.success("Reply posted successfully");
    } catch (error) {
      toast.error("Failed to post reply");
      throw error;
    }
  };

  const handleEdit = async (content) => {
    try {
      await onEdit(comment.Id, content);
      setIsEditing(false);
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to update comment");
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }
    
    try {
      await onDelete(comment.Id);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div className={cn(
      "group",
      depth > 0 && "ml-8 md:ml-12 pl-4 border-l-2 border-gray-200"
    )}>
      <div className="flex gap-3 md:gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.author?.charAt(0) || "U"}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-medium text-gray-900">{comment.author}</span>
            
            {isPostAuthor && (
              <Badge variant="primary" size="sm">Author</Badge>
            )}
            
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {/* Comment Body */}
          {isEditing ? (
            <div className="mb-3">
              <CommentInput
                initialValue={comment.content}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                submitLabel="Save"
                showCancel={true}
                autoFocus={true}
                placeholder="Edit your comment..."
              />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none mb-3 text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {comment.content}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleVote}
              disabled={isVoting}
              className={cn(
                "inline-flex items-center gap-1 font-medium transition-colors",
                voted ? "text-primary-600" : "text-gray-500 hover:text-primary-600",
                isVoting && "opacity-50"
              )}
            >
              <ApperIcon 
                name="ChevronUp" 
                className={cn(
                  "w-4 h-4",
                  isVoting && "animate-pulse"
                )} 
              />
              {voteCount}
            </button>

            {canReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600 font-medium transition-colors"
              >
                <ApperIcon name="Reply" className="w-4 h-4" />
                Reply
              </button>
            )}

            {isAuthor && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600 font-medium transition-colors"
                >
                  <ApperIcon name="Edit2" className="w-4 h-4" />
                  Edit
                </button>
                
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-red-600 font-medium transition-colors"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-4">
              <CommentInput
                onSubmit={handleReply}
                onCancel={() => setShowReplyInput(false)}
                submitLabel="Reply"
                showCancel={true}
                placeholder="Write your reply..."
              />
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.Id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onVote={onVote}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;