import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const CreateBoardModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  board = null // For editing existing boards
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "💡",
    color: "blue",
    visibility: "public"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(board);

  useEffect(() => {
    if (isOpen && board) {
      setFormData({
        name: board.name || "",
        description: board.description || "",
        icon: board.icon || "💡",
        color: board.color || "blue",
        visibility: board.visibility || "public"
      });
    } else if (isOpen && !board) {
      setFormData({
        name: "",
        description: "",
        icon: "💡",
        color: "blue",
        visibility: "public"
      });
    }
    setErrors({});
  }, [isOpen, board]);

  const emojiOptions = [
    "💡", "🚀", "🎯", "⭐", "🔥", "💎", "🎨", "📱", 
    "🛠️", "📊", "🔒", "🌟", "📝", "💬", "🎉", "🚨"
  ];

  const colorOptions = [
    { value: "blue", label: "Blue", class: "from-blue-500 to-indigo-600" },
    { value: "green", label: "Green", class: "from-emerald-500 to-teal-600" },
    { value: "purple", label: "Purple", class: "from-purple-500 to-violet-600" },
    { value: "pink", label: "Pink", class: "from-pink-500 to-rose-600" },
    { value: "orange", label: "Orange", class: "from-orange-500 to-amber-600" },
    { value: "red", label: "Red", class: "from-red-500 to-rose-600" }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Board name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Board name must be at least 3 characters";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast.success(`Board ${isEditing ? "updated" : "created"} successfully!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} board`);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Edit Board" : "Create New Board"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing ? "Update board settings and information" : "Set up a new feedback board for your community"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-white/50"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
              <div className={cn(
                "h-20 bg-gradient-to-br rounded-lg p-4 relative",
                colorOptions.find(c => c.value === formData.color)?.class || "from-primary-500 to-secondary-500"
              )}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-xl">
                    {formData.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {formData.name || "Board Name"}
                    </h4>
                    <span className="text-white/80 text-xs px-2 py-1 bg-white/20 rounded-full">
                      {formData.visibility}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Board Name */}
              <Input
                label="Board Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Feature Requests"
                error={Boolean(errors.name)}
                helperText={errors.name}
                className="md:col-span-2"
              />

              {/* Description */}
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what this board is for and what kind of feedback you're looking for..."
                rows={3}
                error={Boolean(errors.description)}
                helperText={errors.description}
                className="md:col-span-2"
              />

              {/* Icon Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleChange("icon", emoji)}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 hover:scale-110",
                        formData.icon === emoji 
                          ? "bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg" 
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleChange("color", color.value)}
                      className={cn(
                        "h-10 rounded-lg bg-gradient-to-r transition-all duration-200 hover:scale-105 relative",
                        color.class,
                        formData.color === color.value && "ring-2 ring-gray-400 ring-offset-2"
                      )}
                    >
                      {formData.color === color.value && (
                        <ApperIcon name="Check" className="absolute inset-0 w-5 h-5 text-white m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <Select
                label="Visibility"
                value={formData.visibility}
                onChange={(e) => handleChange("visibility", e.target.value)}
                className="md:col-span-2"
              >
                <option value="public">Public - Anyone can view and contribute</option>
                <option value="private">Private - Only invited members can access</option>
              </Select>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />}
            {isEditing ? "Update Board" : "Create Board"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;