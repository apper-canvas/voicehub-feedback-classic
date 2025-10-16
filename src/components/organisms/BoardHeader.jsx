import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const BoardHeader = ({ 
  board, 
  className,
  onSubmitFeedback,
  showActions = true
}) => {
  if (!board) return null;

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
    <div className={cn(
      "rounded-xl overflow-hidden shadow-lg",
      className
    )}>
      <div className={cn(
        "bg-gradient-to-br p-8 relative",
        getBoardGradient(board.color)
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Board Icon */}
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl border border-white/30">
                {board.icon}
              </div>
              
              {/* Board Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">
                    {board.name}
                  </h1>
                  <Badge 
                    variant={board.visibility === "public" ? "default" : "accent"}
                    size="md"
                    className="bg-white/20 text-white border-white/30"
                  >
                    <ApperIcon 
                      name={board.visibility === "public" ? "Globe" : "Lock"} 
                      className="w-3 h-3" 
                    />
                    {board.visibility}
                  </Badge>
                </div>
                
                <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                  {board.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex gap-3">
                <Button
                  onClick={onSubmitFeedback}
                  variant="accent"
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                >
                  <ApperIcon name="Plus" className="w-5 h-5" />
                  Submit Feedback
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/90">
              <ApperIcon name="FileText" className="w-5 h-5" />
              <span className="font-medium">{board.postCount || 0}</span>
              <span className="text-white/70">posts</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/90">
              <ApperIcon name="Users" className="w-5 h-5" />
              <span className="font-medium">{board.memberCount || 0}</span>
              <span className="text-white/70">contributors</span>
            </div>
            
            <div className="flex items-center gap-2 text-white/90">
              <ApperIcon name="Activity" className="w-5 h-5" />
              <span className="text-white/70">Last active:</span>
              <span className="font-medium">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;