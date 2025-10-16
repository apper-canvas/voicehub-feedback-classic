import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FeedbackWidget = ({ config, onClick, hasUnread = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "center-right": "top-1/2 -translate-y-1/2 right-6",
    "center-left": "top-1/2 -translate-y-1/2 left-6"
  };

  const sizeClasses = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-5 py-4 text-lg"
  };

  const iconSizes = {
    small: 16,
    medium: 20,
    large: 24
  };

  return (
    <div className="fixed z-50">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "fixed z-50 group",
          positionClasses[config.position],
          "text-white rounded-full shadow-lg hover:shadow-xl",
          "transition-all duration-200",
          "flex items-center gap-2",
          "btn-press animate-pulse-scale",
          sizeClasses[config.size]
        )}
        style={{ backgroundColor: config.buttonColor }}
        aria-label={config.buttonText}
      >
        {/* Icon */}
        <ApperIcon name={config.iconName} size={iconSizes[config.size]} />
        
        {/* Text - Hidden on mobile */}
        <span className="hidden sm:inline font-medium">
          {config.buttonText}
        </span>

        {/* Unread Indicator */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={cn(
            "fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg",
            "whitespace-nowrap pointer-events-none",
            config.position.includes("right") ? "right-20" : "left-20",
            config.position.includes("top") ? "top-6" : "bottom-6"
          )}
        >
          {config.buttonText}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 transform rotate-45",
              config.position.includes("right") ? "right-[-4px]" : "left-[-4px]",
              "top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;