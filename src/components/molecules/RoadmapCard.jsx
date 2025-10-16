import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const RoadmapCard = ({ item, className, onClick }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Planned': 'bg-gray-500',
      'In Progress': 'bg-blue-500',
      'Completed': 'bg-green-500',
      'On Hold': 'bg-yellow-500',
      'Research': 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityEmoji = (priority) => {
    const emojis = {
      'High': '🔥',
      'Medium': '⭐',
      'Low': '💡'
    };
    return emojis[priority] || '⭐';
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer card-hover",
        "min-w-[280px] max-w-[320px]",
        className
      )}
    >
      {/* Header with status and priority */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", getStatusColor(item.status))} />
          <Badge variant="secondary" className="text-xs">
            {item.status}
          </Badge>
        </div>
        <span className="text-xl" title={`${item.priority} Priority`}>
          {getPriorityEmoji(item.priority)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {item.title}
      </h3>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-medium">{item.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              getProgressColor(item.progress)
            )}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        {/* Due date */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" size={14} />
          <span>Due {format(new Date(item.dueDate), 'MMM d, yyyy')}</span>
        </div>

        {/* Assignee */}
        {item.assignee && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="User" size={14} />
            <span>{item.assignee}</span>
          </div>
        )}

        {/* Linked feedback count */}
        {item.linkedFeedbackCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <ApperIcon name="MessageSquare" size={12} className="mr-1" />
              {item.linkedFeedbackCount} feedback
            </Badge>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Category badge */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <Badge variant="secondary" className="text-xs">
          {item.category}
        </Badge>
      </div>
    </div>
  );
};

export default RoadmapCard;