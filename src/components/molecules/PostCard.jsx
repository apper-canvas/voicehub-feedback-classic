import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import VoteButton from "@/components/molecules/VoteButton";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PostCard = ({ 
  post, 
  className,
  onVote,
  showBoard = false
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on vote button or other interactive elements
    if (e.target.closest('button')) return;
    navigate(`/posts/${post.Id}`);
  };

  const getStatusVariant = (status) => {
    const variants = {
      planned: "planned",
      "in-progress": "in-progress", 
      completed: "completed",
      cancelled: "cancelled"
    };
    return variants[status] || "default";
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-card hover:shadow-lg transition-all duration-200 card-hover cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex gap-4">
          {/* Vote Button */}
          <div className="flex-shrink-0">
            <VoteButton
              postId={post.Id}
              votes={post.votes}
              hasVoted={post.hasVoted}
              onVote={onVote}
              size="md"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                {post.title}
              </h3>
              
              <Badge 
                variant={getStatusVariant(post.status)}
                size="sm"
                className="flex-shrink-0"
              >
                {post.status}
              </Badge>
            </div>

            <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
              {post.description}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {post.author?.charAt(0) || "U"}
                  </div>
                  <span>{post.author}</span>
                </div>

                {showBoard && post.boardName && (
                  <div className="flex items-center gap-1">
                    <ApperIcon name="FolderOpen" className="w-4 h-4" />
                    <span>{post.boardName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <ApperIcon name="MessageSquare" className="w-4 h-4" />
                  <span>{post.commentCount || 0}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <ApperIcon name="Eye" className="w-4 h-4" />
                  <span>{post.viewCount || 0}</span>
                </div>
                
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;