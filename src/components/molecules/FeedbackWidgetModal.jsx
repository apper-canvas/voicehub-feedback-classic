import { useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const FeedbackWidgetModal = ({ isOpen, onClose, config }) => {
  const [activeTab, setActiveTab] = useState("idea");
  const [formData, setFormData] = useState({
    type: "idea",
    title: "",
    description: "",
    category: "",
    email: "",
    subscribe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: "idea", label: "💡 Idea", icon: "Lightbulb" },
    { id: "bug", label: "🐛 Bug", icon: "Bug" },
    { id: "general", label: "💬 General", icon: "MessageSquare" }
  ];

  const categories = [
    "Feature Request",
    "User Experience",
    "Performance",
    "Design",
    "Integration",
    "Documentation",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please provide your email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Capture browser info
      const browserInfo = {
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        platform: navigator.platform,
        pageUrl: window.location.href,
        timestamp: new Date().toISOString()
      };

      // In production, this would submit to Edge Function
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Thank you for your feedback!");
      onClose();
      
      // Reset form
      setFormData({
        type: "idea",
        title: "",
        description: "",
        category: "",
        email: "",
        subscribe: false
      });
      setActiveTab("idea");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={cn(
          "fixed z-50 bg-white rounded-2xl shadow-2xl",
          "w-full max-w-2xl max-h-[90vh]",
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "overflow-hidden flex flex-col",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share Your Feedback</h2>
            <p className="text-sm text-gray-600 mt-1">
              Help us improve by sharing your thoughts
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setFormData(prev => ({ ...prev, type: tab.id }));
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative",
                activeTab === tab.id
                  ? "text-primary-600"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ApperIcon name={tab.icon} size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Brief description of your feedback"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about your feedback..."
              required
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          <Select
            label="Category (Optional)"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="">Select a category...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          {/* Screenshot Placeholder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot (Coming Soon)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
              <ApperIcon name="Camera" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                Screenshot capture coming soon
              </p>
            </div>
          </div>

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
            required
            helperText="We'll use this to follow up on your feedback"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="subscribe"
              checked={formData.subscribe}
              onChange={(e) => setFormData(prev => ({ ...prev, subscribe: e.target.checked }))}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="subscribe" className="text-sm text-gray-700">
              Subscribe to updates on this feedback
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Powered by Your Feedback Platform
          </p>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />}
            Submit Feedback
          </Button>
        </div>
      </div>
    </>
  );
};

export default FeedbackWidgetModal;