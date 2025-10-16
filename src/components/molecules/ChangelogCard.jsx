import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import ReactionButtons from '@/components/molecules/ReactionButtons';

const ChangelogCard = ({ 
  changelog, 
  className,
  onReact,
  viewMode = 'card', // 'card', 'compact', or 'timeline'
  clickable = true
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);

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

  const getCategoryColor = (category) => {
    const colors = {
      'New Feature': 'bg-blue-100 text-blue-700',
      'Improvement': 'bg-purple-100 text-purple-700',
      'Bug Fix': 'bg-red-100 text-red-700',
      'Technical': 'bg-gray-100 text-gray-700',
      'Breaking Change': 'bg-orange-100 text-orange-700',
      'Removed': 'bg-amber-100 text-amber-700',
      'Documentation': 'bg-green-100 text-green-700',
      'Security': 'bg-indigo-100 text-indigo-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const handleShare = () => {
    const url = `${window.location.origin}/changelog/v${changelog.version.replace(/\./g, '-')}`;
    if (navigator.share) {
      navigator.share({
        title: `${changelog.version}: ${changelog.title}`,
        text: changelog.description,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      // In a real app, would show toast notification
    }
  };

  const handleCardClick = () => {
    if (clickable) {
      navigate(`/changelog/v${changelog.version.replace(/\./g, '-')}`);
    }
  };

  const shouldTruncate = changelog.description.length > 200 && !expanded;

  if (viewMode === 'compact') {
    return (
      <div 
        className={cn(
          'flex items-center gap-4 p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors',
          clickable && 'cursor-pointer',
          className
        )}
        onClick={handleCardClick}
      >
        <div className="flex-shrink-0">
          <div className="text-2xl font-bold text-primary-600">{changelog.version}</div>
          <div className="text-xs text-gray-500">{format(new Date(changelog.releaseDate), 'MMM d, yyyy')}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{changelog.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">{changelog.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {changelog.updates.slice(0, 3).map((update, index) => (
            <Badge key={index} variant="secondary" size="sm" className={getCategoryColor(update.category)}>
              {update.category}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'timeline') {
    return (
      <div className={cn('flex gap-4', className)}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
            {changelog.version}
          </div>
          <div className="w-0.5 h-full bg-gray-200 mt-2" />
        </div>
        <div className="flex-1 pb-8">
          <div className="text-sm text-gray-500 mb-2">{format(new Date(changelog.releaseDate), 'MMMM d, yyyy')}</div>
          <div 
            className={cn(
              'bg-white rounded-lg border border-gray-200 p-4',
              clickable && 'cursor-pointer hover:border-primary-300 transition-colors'
            )}
            onClick={handleCardClick}
          >
            <h3 className="font-semibold text-gray-900 mb-2">{changelog.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{changelog.description}</p>
            <div className="flex flex-wrap gap-2">
              {changelog.updates.map((update, index) => (
                <Badge key={index} variant="secondary" size="sm" className={getCategoryColor(update.category)}>
                  <ApperIcon name={getCategoryIcon(update.category)} size={12} className="mr-1" />
                  {update.category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default card view
  return (
    <article 
      className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-card hover:shadow-lg transition-all card-hover',
        clickable && 'cursor-pointer',
        className
      )}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-3xl font-bold text-primary-600 mb-1">{changelog.version}</div>
            <div className="text-sm text-gray-500">{format(new Date(changelog.releaseDate), 'MMMM d, yyyy')}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <ApperIcon name="Share2" size={18} className="text-gray-600" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{changelog.title}</h2>
        <div className="flex flex-wrap gap-2">
          {[...new Set(changelog.updates.map(u => u.category))].map((category, index) => (
            <Badge key={index} variant="secondary" className={getCategoryColor(category)}>
              <ApperIcon name={getCategoryIcon(category)} size={12} className="mr-1" />
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="p-6 border-b border-gray-100">
        <p className={cn('text-gray-700 leading-relaxed', shouldTruncate && 'line-clamp-3')}>
          {changelog.description}
        </p>
        {changelog.description.length > 200 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
          >
            {expanded ? (
              <>
                Show less
                <ApperIcon name="ChevronUp" size={14} />
              </>
            ) : (
              <>
                Read more
                <ApperIcon name="ChevronDown" size={14} />
              </>
            )}
          </button>
        )}
      </div>

      {/* Updates List */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">What's New</h3>
        <div className="space-y-3">
          {changelog.updates.map((update, index) => (
            <div key={index} className="flex gap-3">
              <div className={cn('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', getCategoryColor(update.category))}>
                <ApperIcon name={getCategoryIcon(update.category)} size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{update.title}</h4>
                <p className="text-sm text-gray-600">{update.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reactions and Actions */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <ReactionButtons 
            reactions={changelog.reactions}
            onReact={(type) => {
              if (onReact) onReact(changelog.Id, type);
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="MessageSquare" size={16} />
            Comments
          </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center py-4">
              Comments feature coming soon...
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default ChangelogCard;