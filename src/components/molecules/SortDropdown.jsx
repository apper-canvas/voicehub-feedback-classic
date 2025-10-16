import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SortDropdown = ({ 
  className,
  value = "trending",
  onSortChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { key: "trending", label: "Trending", icon: "TrendingUp" },
    { key: "top", label: "Top Voted", icon: "ArrowUp" },
    { key: "newest", label: "Newest", icon: "Clock" },
    { key: "oldest", label: "Oldest", icon: "Calendar" },
    { key: "most-discussed", label: "Most Discussed", icon: "MessageSquare" }
  ];

  const selectedOption = sortOptions.find(option => option.key === value);

  const handleSelect = (option) => {
    onSortChange(option.key);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <ApperIcon name={selectedOption?.icon || "TrendingUp"} className="w-4 h-4" />
        <span className="font-medium">{selectedOption?.label || "Trending"}</span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="py-2">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150",
                    option.key === value && "bg-primary-50 text-primary-600"
                  )}
                >
                  <ApperIcon name={option.icon} className="w-4 h-4" />
                  <span className="font-medium">{option.label}</span>
                  {option.key === value && (
                    <ApperIcon name="Check" className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortDropdown;