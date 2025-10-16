import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const CategoryFilter = ({ 
  className, 
  categories = [], 
  selectedCategories = [], 
  onChange 
}) => {
  const isSelected = (category) => selectedCategories.includes(category);

  const getCategoryColor = (category) => {
    const colors = {
      'New Feature': 'bg-blue-100 text-blue-700 border-blue-200',
      'Improvement': 'bg-purple-100 text-purple-700 border-purple-200',
      'Bug Fix': 'bg-red-100 text-red-700 border-red-200',
      'Technical': 'bg-gray-100 text-gray-700 border-gray-200',
      'Breaking Change': 'bg-orange-100 text-orange-700 border-orange-200',
      'Removed': 'bg-amber-100 text-amber-700 border-amber-200',
      'Documentation': 'bg-green-100 text-green-700 border-green-200',
      'Security': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'New Feature': 'Sparkles',
      'Improvement': 'Zap',
      'Bug Fix': 'Bug',
      'Technical': 'Wrench',
      'Breaking Change': 'AlertTriangle',
      'Removed': 'Trash2',
      'Documentation': 'FileText',
      'Security': 'Shield'
    };
    return icons[category] || 'Tag';
  };

  const handleToggle = (category) => {
    if (isSelected(category)) {
      onChange(selectedCategories.filter(c => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
        {selectedCategories.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleToggle(category)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              isSelected(category) 
                ? getCategoryColor(category)
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            )}
          >
            <ApperIcon name={getCategoryIcon(category)} size={14} />
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;