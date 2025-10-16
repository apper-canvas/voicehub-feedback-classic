import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ChangelogWidget = ({ 
  onClick, 
  hasUnread = false, 
  position = "bottom-right",
  className 
}) => {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6"
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 group",
        positionClasses[position],
        "bg-gradient-to-r from-primary-500 to-secondary-500",
        "hover:from-primary-600 hover:to-secondary-600",
        "text-white rounded-full shadow-lg hover:shadow-xl",
        "transition-all duration-200",
        "flex items-center gap-2 px-4 py-3",
        "btn-press",
        className
      )}
      aria-label="What's New"
    >
      {/* Icon */}
      <ApperIcon name="Sparkles" size={20} />
      
      {/* Text - Hidden on mobile */}
      <span className="hidden sm:inline font-medium text-sm">
        What's New
      </span>

      {/* Unread Indicator */}
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      )}
    </button>
  );
};

export default ChangelogWidget;