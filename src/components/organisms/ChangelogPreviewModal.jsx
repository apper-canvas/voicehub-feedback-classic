import { format } from 'date-fns';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ChangelogPreviewModal = ({ 
  isOpen, 
  onClose,
  changelog,
  onEdit,
  onPublish
}) => {
  if (!isOpen || !changelog) return null;

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-premium w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Changelog Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              This is how your changelog will appear to users
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <article className="bg-white rounded-lg border border-gray-200 shadow-card max-w-3xl mx-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-1">{changelog.version}</div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(changelog.releaseDate), 'MMMM d, yyyy')}
                  </div>
                </div>
                <Badge variant={changelog.status === 'published' ? 'default' : 'accent'}>
                  {changelog.status}
                </Badge>
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
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {changelog.description}
              </p>
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

            {/* Tags */}
            {changelog.tags && changelog.tags.length > 0 && (
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {changelog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onEdit}
            >
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit
            </Button>
            {changelog.status !== 'published' && (
              <Button
                onClick={onPublish}
              >
                <ApperIcon name="Send" size={16} className="mr-2" />
                Publish Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPreviewModal;