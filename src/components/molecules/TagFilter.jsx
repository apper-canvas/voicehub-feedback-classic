import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const TagFilter = ({ 
  className,
  tags = [],
  selectedTags = [],
  onTagToggle,
  maxVisible = 8
}) => {
  const visibleTags = tags.slice(0, maxVisible);
  const hasMore = tags.length > maxVisible;

  const isSelected = (tag) => selectedTags.includes(tag);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visibleTags.map((tag) => {
        const selected = isSelected(tag);
        
        return (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105",
              selected 
                ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 hover:border-gray-400"
            )}
          >
            <span>{tag}</span>
            {selected && (
              <ApperIcon name="X" className="w-3 h-3" />
            )}
          </button>
        );
      })}
      
      {hasMore && (
        <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-200">
          <ApperIcon name="Plus" className="w-3 h-3" />
          +{tags.length - maxVisible} more
        </button>
      )}
      
      {selectedTags.length > 0 && (
        <button
          onClick={() => onTagToggle(null)} // Clear all
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-all duration-200"
        >
          <ApperIcon name="X" className="w-3 h-3" />
          Clear all
        </button>
      )}
    </div>
  );
};

export default TagFilter;