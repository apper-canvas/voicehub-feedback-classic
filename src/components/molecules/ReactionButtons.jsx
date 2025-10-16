import { useState } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const ReactionButtons = ({ 
  className,
  reactions = { like: 0, love: 0, celebrate: 0 },
  onReact
}) => {
  const [animating, setAnimating] = useState(null);

  const reactionConfig = [
    { 
      type: 'like', 
      icon: 'ThumbsUp', 
      label: 'Like',
      color: 'text-blue-600',
      hoverColor: 'hover:bg-blue-50'
    },
    { 
      type: 'love', 
      icon: 'Heart', 
      label: 'Love',
      color: 'text-red-600',
      hoverColor: 'hover:bg-red-50'
    },
    { 
      type: 'celebrate', 
      icon: 'Sparkles', 
      label: 'Celebrate',
      color: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-50'
    }
  ];

  const handleReaction = async (type) => {
    setAnimating(type);
    await onReact(type);
    
    // Reset animation after a short delay
    setTimeout(() => {
      setAnimating(null);
    }, 300);
  };

  const formatCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {reactionConfig.map(({ type, icon, label, color, hoverColor }) => (
        <button
          key={type}
          onClick={() => handleReaction(type)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white transition-all',
            hoverColor,
            'hover:border-gray-300',
            animating === type && 'animate-pulse-scale'
          )}
          title={label}
        >
          <ApperIcon 
            name={icon} 
            size={16} 
            className={cn(
              'transition-colors',
              reactions[type] > 0 ? color : 'text-gray-400'
            )}
          />
          <span className={cn(
            'text-sm font-medium transition-colors',
            reactions[type] > 0 ? color : 'text-gray-600'
          )}>
            {formatCount(reactions[type])}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReactionButtons;