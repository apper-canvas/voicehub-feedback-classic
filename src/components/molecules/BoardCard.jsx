import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const BoardCard = ({ 
  board, 
  className,
  showActions = false,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('.board-actions')) return;
    navigate(`/boards/${board.Id}`);
  };

  const getBoardGradient = (color) => {
    const gradients = {
      blue: "from-blue-500 to-indigo-600",
      green: "from-emerald-500 to-teal-600",
      purple: "from-purple-500 to-violet-600",
      pink: "from-pink-500 to-rose-600",
      orange: "from-orange-500 to-amber-600",
      red: "from-red-500 to-rose-600"
    };
    return gradients[color] || "from-primary-500 to-secondary-500";
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-card hover:shadow-lg transition-all duration-200 card-hover cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Header with gradient background */}
      <div className={cn(
        "h-24 bg-gradient-to-br p-4 relative",
        getBoardGradient(board.color)
      )}>
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-2xl">
              {board.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg leading-tight">
                {board.name}
              </h3>
              <Badge 
                variant={board.visibility === "public" ? "default" : "accent"}
                size="sm"
                className="bg-white/20 text-white border-white/30 mt-1"
              >
                {board.visibility}
              </Badge>
            </div>
          </div>

          {showActions && (
            <div className="board-actions flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(board);
                }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(board);
                }}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/50 transition-all duration-200"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {board.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ApperIcon name="FileText" className="w-4 h-4" />
              <span className="font-medium">{board.postCount || 0}</span>
              <span>posts</span>
            </div>
            
            <div className="flex items-center gap-1">
              <ApperIcon name="Activity" className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>

          <span>
            {formatDistanceToNow(new Date(board.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;