import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className,
  icon = "MessageSquare",
  title = "No feedback yet",
  message = "Be the first to share your thoughts and help shape the product.",
  actionLabel = "Submit Feedback",
  onAction,
  showAction = true
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 px-6 text-center", className)}>
      <div className="w-32 h-32 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full flex items-center justify-center mb-8 shadow-lg">
        <ApperIcon name={icon} className="w-16 h-16 text-primary-500" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4 gradient-text">
        {title}
      </h3>
      
      <p className="text-gray-600 max-w-lg mb-10 text-lg leading-relaxed">
        {message}
      </p>
      
      {showAction && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl btn-press"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;