import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { roadmapService } from '@/services/api/roadmapService';

const RoadmapItemModal = ({ isOpen, onClose, onSubmit, item = null }) => {
  const isEditMode = !!item;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Planned',
    priority: 'Medium',
    category: 'Features',
    startDate: '',
    dueDate: '',
    progress: 0,
    assignee: '',
    tags: [],
    visibility: 'Public'
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        status: item.status || 'Planned',
        priority: item.priority || 'Medium',
        category: item.category || 'Features',
        startDate: item.startDate || '',
        dueDate: item.dueDate || '',
        progress: item.progress || 0,
        assignee: item.assignee || '',
        tags: item.tags || [],
        visibility: item.visibility || 'Public'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Planned',
        priority: 'Medium',
        category: 'Features',
        startDate: '',
        dueDate: '',
        progress: 0,
        assignee: '',
        tags: [],
        visibility: 'Public'
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (formData.startDate && formData.dueDate) {
      if (new Date(formData.startDate) > new Date(formData.dueDate)) {
        newErrors.dueDate = 'Due date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save roadmap item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Map" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Roadmap Item' : 'Create Roadmap Item'}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {isEditMode ? 'Update roadmap item details' : 'Add a new item to your product roadmap'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Title */}
            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter roadmap item title"
              error={!!errors.title}
              helperText={errors.title}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div
                contentEditable
                className={cn(
                  "rich-editor min-h-[120px] max-h-[300px] overflow-y-auto",
                  errors.description && "border-red-300 focus:border-red-500"
                )}
                onInput={(e) => handleChange('description', e.currentTarget.textContent)}
                dangerouslySetInnerHTML={{ __html: formData.description }}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Status *"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {roadmapService.STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>

              <Select
                label="Priority *"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                {roadmapService.PRIORITY_OPTIONS.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.emoji} {priority.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Category */}
            <Select
              label="Category *"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              error={!!errors.category}
              helperText={errors.category}
            >
              <option value="">Select a category</option>
              {roadmapService.CATEGORY_OPTIONS.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date *"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                error={!!errors.startDate}
                helperText={errors.startDate}
              />

              <Input
                type="date"
                label="Due Date *"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
              />
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress: {formData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleChange('progress', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Assignee */}
            <Input
              label="Assignee"
              value={formData.assignee}
              onChange={(e) => handleChange('assignee', e.target.value)}
              placeholder="Enter assignee name"
            />

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-primary-900"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Visibility */}
            <Select
              label="Visibility"
              value={formData.visibility}
              onChange={(e) => handleChange('visibility', e.target.value)}
            >
              <option value="Public">Public</option>
              <option value="Internal">Internal</option>
            </Select>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ApperIcon name="Check" size={16} />
                {isEditMode ? 'Update' : 'Create'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapItemModal;