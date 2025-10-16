import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import KanbanCard from '@/components/molecules/KanbanCard';

const KanbanColumn = ({ status, items, onEditItem, onDeleteItem }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { setNodeRef } = useDroppable({ id: status });

  const getStatusColor = (status) => {
    const colors = {
      'Backlog': 'bg-gray-100 border-gray-300',
      'Planned': 'bg-yellow-50 border-yellow-300',
      'In Progress': 'bg-blue-50 border-blue-300',
      'Shipped': 'bg-green-50 border-green-300'
    };
    return colors[status] || 'bg-gray-100 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Backlog': 'Inbox',
      'Planned': 'Calendar',
      'In Progress': 'Zap',
      'Shipped': 'CheckCircle2'
    };
    return icons[status] || 'Circle';
  };

  return (
    <div className={cn(
      'bg-white rounded-xl border-2 transition-all',
      getStatusColor(status)
    )}>
      {/* Column Header */}
      <div className="p-4 border-b border-current/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ApperIcon name={getStatusIcon(status)} size={18} className="text-gray-700" />
            <h3 className="font-semibold text-gray-900">{status}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-gray-700">
              {items.length}
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-white/50 rounded-md transition-colors"
              aria-label={isCollapsed ? 'Expand column' : 'Collapse column'}
            >
              <ApperIcon
                name={isCollapsed ? 'ChevronDown' : 'ChevronUp'}
                size={16}
                className="text-gray-600"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Column Content */}
      {!isCollapsed && (
        <div
          ref={setNodeRef}
          className="p-4 space-y-3 min-h-[200px]"
        >
          <SortableContext
            items={items.map(item => item.Id)}
            strategy={verticalListSortingStrategy}
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <ApperIcon name="Inbox" size={32} className="mb-2" />
                <p className="text-sm">No items</p>
              </div>
            ) : (
              items.map(item => (
                <KanbanCard
                  key={item.Id}
                  item={item}
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                />
              ))
            )}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;