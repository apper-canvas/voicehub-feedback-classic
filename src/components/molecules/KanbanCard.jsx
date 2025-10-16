import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast } from 'date-fns';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const KanbanCard = ({ item, isDragging, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.Id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': 'text-red-600 bg-red-50',
      'high': 'text-orange-600 bg-orange-50',
      'medium': 'text-yellow-600 bg-yellow-50',
      'low': 'text-green-600 bg-green-50'
    };
    return colors[priority] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityEmoji = (priority) => {
    const emojis = {
      'critical': '🔴',
      'high': '🟠',
      'medium': '🟡',
      'low': '🟢'
    };
    return emojis[priority] || '⚪';
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOverdue = item.dueDate && isPast(new Date(item.dueDate)) && item.progress < 100;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move',
        isDragging && 'opacity-50 cursor-grabbing',
        'card-hover'
      )}
      {...attributes}
      {...listeners}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg" title={`${item.priority} Priority`}>
              {getPriorityEmoji(item.priority)}
            </span>
            <Badge 
              variant="secondary" 
              className={cn('text-xs font-medium', getPriorityColor(item.priority))}
            >
              {item.priority}
            </Badge>
          </div>
          
          {/* Quick Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Actions"
            >
              <ApperIcon name="MoreVertical" size={16} className="text-gray-600" />
            </button>
            
            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(false);
                      onEdit(item);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <ApperIcon name="Edit2" size={14} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(false);
                      onDelete(item.Id);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <ApperIcon name="Trash2" size={14} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
          {item.title}
        </h4>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-600">Progress</span>
            <span className="text-xs font-semibold text-gray-900">{item.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full transition-all', getProgressColor(item.progress))}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="space-y-2">
          {/* Assignee */}
          {item.assignee && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(item.assignee)}
              </div>
              <span className="text-xs text-gray-600 truncate">{item.assignee}</span>
            </div>
          )}

          {/* Due Date */}
          {item.dueDate && (
            <div className={cn(
              'flex items-center gap-2 text-xs',
              isOverdue ? 'text-red-600' : 'text-gray-600'
            )}>
              <ApperIcon 
                name={isOverdue ? 'AlertCircle' : 'Calendar'} 
                size={14} 
              />
              <span>
                {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                {isOverdue && ' (Overdue)'}
              </span>
            </div>
          )}

          {/* Category */}
          {item.category && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {item.category}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;