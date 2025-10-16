import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from '@/components/molecules/KanbanColumn';
import KanbanCard from '@/components/molecules/KanbanCard';
import { roadmapService } from '@/services/api/roadmapService';

const KanbanBoard = ({ items, onStatusChange, onEditItem, onDeleteItem }) => {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = roadmapService.STATUS_OPTIONS;

  const getItemsByStatus = (status) => {
    return items.filter(item => item.status === status);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeItem = items.find(item => item.Id === active.id);
    const newStatus = over.id;

    if (activeItem && activeItem.status !== newStatus) {
      onStatusChange(activeItem.Id, newStatus);
    }

    setActiveId(null);
  };

  const activeItem = items.find(item => item.Id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            items={getItemsByStatus(status)}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="rotate-3 opacity-80">
            <KanbanCard
              item={activeItem}
              isDragging
              onEdit={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;