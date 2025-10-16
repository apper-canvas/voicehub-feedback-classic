import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const SubmitFeedbackModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  boards = [],
  selectedBoardId = null
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    boardId: selectedBoardId || "",
    tags: [],
    images: [],
    isDraft: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        boardId: selectedBoardId || "",
        tags: [],
        images: [],
        isDraft: false
      });
      setErrors({});
      setTagInput("");
      setIsPreviewMode(false);
    }
  }, [isOpen, selectedBoardId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    if (!formData.boardId) {
      newErrors.boardId = "Please select a board";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        isDraft
      });
      toast.success(isDraft ? "Draft saved!" : "Feedback submitted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 5) {
        handleChange("tags", [...formData.tags, newTag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    handleChange("tags", formData.tags.filter(tag => tag !== tagToRemove));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Submit Feedback</h2>
              <p className="text-sm text-gray-600 mt-1">
                Share your ideas and help shape the product
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Preview Toggle */}
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isPreviewMode
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <ApperIcon name="Eye" className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-white/50"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {isPreviewMode ? (
            /* Preview Mode */
            <div className="p-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <ApperIcon name="ChevronUp" className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {formData.title || "Feedback Title"}
                      </h3>
                      <div className="prose prose-sm text-gray-600 mb-4">
                        {formData.description ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: formData.description.replace(/\n/g, "<br>") 
                          }} />
                        ) : (
                          <p className="text-gray-400">Feedback description will appear here...</p>
                        )}
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Just now</span>
                        <span>•</span>
                        <span>0 votes</span>
                        <span>•</span>
                        <span>0 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title */}
                <Input
                  label="Feedback Title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Brief, descriptive title for your feedback"
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                  className="md:col-span-2"
                />

                {/* Board Selection */}
                <Select
                  label="Select Board"
                  value={formData.boardId}
                  onChange={(e) => handleChange("boardId", e.target.value)}
                  error={Boolean(errors.boardId)}
                  helperText={errors.boardId}
                >
                  <option value="">Choose a feedback board...</option>
                  {boards.map((board) => (
                    <option key={board.Id} value={board.Id}>
                      {board.icon} {board.name}
                    </option>
                  ))}
                </Select>

                {/* Character Count */}
                <div className="flex justify-end text-sm text-gray-500">
                  {formData.title.length}/100 characters
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description
                </label>
                <div
                  contentEditable
                  className={cn(
                    "rich-editor",
                    errors.description && "border-red-300 focus:border-red-500 focus:ring-red-500"
                  )}
                  onBlur={(e) => handleChange("description", e.target.textContent)}
                  onInput={(e) => {
                    handleChange("description", e.target.textContent);
                    if (errors.description) {
                      setErrors(prev => ({ ...prev, description: "" }));
                    }
                  }}
                  data-placeholder="Provide detailed information about your feedback. What problem are you trying to solve? What would you like to see improved?"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Press Enter to add tags (max 5)"
                  helperText="Add relevant tags to help categorize your feedback"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-primary-500 hover:text-primary-700"
                        >
                          <ApperIcon name="X" className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Upload Placeholder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Coming Soon)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                  <ApperIcon name="ImagePlus" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Image upload functionality coming soon
                  </p>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit anonymously
            </label>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              <ApperIcon name="Save" className="w-4 h-4" />
              Save Draft
            </Button>
            
            <Button
              onClick={() => handleSubmit(false)}
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting && <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />}
              Submit Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedbackModal;