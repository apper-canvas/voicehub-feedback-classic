import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { changelogService } from '@/services/api/changelogService';

const CreateChangelogModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    version: '',
    title: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    visibility: 'public',
    updates: [],
    tags: [],
    notifySubscribers: false
  });

  const [currentUpdate, setCurrentUpdate] = useState({
    category: 'New Feature',
    title: '',
    description: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedVersion, setSuggestedVersion] = useState('');

  useEffect(() => {
    if (isOpen && !initialData) {
      loadSuggestedVersion();
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        version: initialData.version || '',
        title: initialData.title || '',
        description: initialData.description || '',
        releaseDate: initialData.releaseDate ? initialData.releaseDate.split('T')[0] : new Date().toISOString().split('T')[0],
        status: initialData.status || 'draft',
        visibility: initialData.visibility || 'public',
        updates: initialData.updates || [],
        tags: initialData.tags || [],
        notifySubscribers: initialData.notifySubscribers || false
      });
    } else {
      setFormData({
        version: '',
        title: '',
        description: '',
        releaseDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        visibility: 'public',
        updates: [],
        tags: [],
        notifySubscribers: false
      });
    }
  }, [initialData, isOpen]);

  const loadSuggestedVersion = async () => {
    try {
      const version = await changelogService.getNextVersion();
      setSuggestedVersion(version);
      if (!formData.version) {
        setFormData(prev => ({ ...prev, version }));
      }
    } catch (error) {
      console.error('Failed to load suggested version:', error);
    }
  };

  const validateForm = () => {
    if (!formData.version.trim()) {
      toast.error('Version number is required');
      return false;
    }
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (formData.updates.length === 0) {
      toast.error('At least one update item is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      toast.error('Failed to save changelog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUpdate = () => {
    if (!currentUpdate.title.trim() || !currentUpdate.description.trim()) {
      toast.error('Update title and description are required');
      return;
    }

    const newUpdate = {
      id: Date.now(),
      ...currentUpdate
    };

    setFormData(prev => ({
      ...prev,
      updates: [...prev.updates, newUpdate]
    }));

    setCurrentUpdate({
      category: 'New Feature',
      title: '',
      description: ''
    });
  };

  const handleRemoveUpdate = (updateId) => {
    setFormData(prev => ({
      ...prev,
      updates: prev.updates.filter(u => u.id !== updateId)
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-premium w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Edit Changelog' : 'Create New Changelog'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Document your latest features, improvements, and fixes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Version and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version Number *
                </label>
                <Input
                  value={formData.version}
                  onChange={(e) => handleChange('version', e.target.value)}
                  placeholder="e.g., 2.5.0"
                  required
                />
                {suggestedVersion && !initialData && (
                  <p className="text-xs text-gray-500 mt-1">
                    Suggested: {suggestedVersion}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date *
                </label>
                <Input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleChange('releaseDate', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Brief, compelling headline for this release"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide an overview of what's included in this release..."
                rows={4}
                required
              />
            </div>

            {/* Update Items */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Update Items *</h3>
              
              {/* Existing Updates */}
              {formData.updates.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.updates.map((update) => (
                    <div key={update.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <ApperIcon name={getCategoryIcon(update.category)} size={16} className="mt-0.5 text-gray-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" size="sm">{update.category}</Badge>
                          <span className="font-medium text-sm text-gray-900">{update.title}</span>
                        </div>
                        <p className="text-sm text-gray-600">{update.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveUpdate(update.id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Update */}
              <div className="space-y-3">
                <Select
                  value={currentUpdate.category}
                  onChange={(e) => setCurrentUpdate(prev => ({ ...prev, category: e.target.value }))}
                >
                  {changelogService.CATEGORY_OPTIONS.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>

                <Input
                  value={currentUpdate.title}
                  onChange={(e) => setCurrentUpdate(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Update title"
                />

                <Textarea
                  value={currentUpdate.description}
                  onChange={(e) => setCurrentUpdate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this update..."
                  rows={2}
                />

                <Button
                  type="button"
                  onClick={handleAddUpdate}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Update Item
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <Select
                  value={formData.visibility}
                  onChange={(e) => handleChange('visibility', e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Select>
              </div>
            </div>

            {/* Notify Subscribers */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="notify"
                checked={formData.notifySubscribers}
                onChange={(e) => handleChange('notifySubscribers', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="notify" className="text-sm text-gray-700">
                Send email notification to subscribers
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {initialData ? 'Update' : 'Create'} Changelog
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateChangelogModal;