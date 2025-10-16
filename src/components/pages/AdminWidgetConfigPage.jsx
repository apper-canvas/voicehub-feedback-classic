import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import FeedbackWidget from "@/components/molecules/FeedbackWidget";
import FeedbackWidgetModal from "@/components/molecules/FeedbackWidgetModal";
import { widgetService } from "@/services/api/widgetService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const AdminWidgetConfigPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    widgetType: "floating-button",
    position: "bottom-right",
    buttonColor: "#6366F1",
    buttonText: "Feedback",
    iconName: "MessageSquare",
    size: "medium",
    showOnPages: "*",
    language: "en",
    customCss: ""
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState("html");
  const [embedCode, setEmbedCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    loadWidgetConfig();
  }, []);

  useEffect(() => {
    generateEmbedCode();
  }, [widgetConfig, selectedFramework]);

  const loadWidgetConfig = async () => {
    try {
      setLoading(true);
      const configs = await widgetService.getAll();
      if (configs.length > 0) {
        setWidgetConfig(configs[0]);
      }
    } catch (err) {
      setError("Failed to load widget configuration");
      toast.error("Failed to load widget configuration");
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedCode = async () => {
    const code = await widgetService.generateEmbedCode(widgetConfig, selectedFramework);
    setEmbedCode(code);
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      const configs = await widgetService.getAll();
      if (configs.length > 0) {
        await widgetService.update(configs[0].Id, widgetConfig);
      } else {
        await widgetService.create(widgetConfig);
      }
      toast.success("Widget configuration saved successfully!");
    } catch (err) {
      toast.error("Failed to save widget configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setWidgetConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopiedCode(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      toast.error("Failed to copy embed code");
    }
  };

  const positionOptions = [
    { value: "bottom-right", label: "Bottom Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "top-right", label: "Top Right" },
    { value: "top-left", label: "Top Left" },
    { value: "center-right", label: "Center Right" },
    { value: "center-left", label: "Center Left" }
  ];

  const sizeOptions = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" }
  ];

  const iconOptions = [
    "MessageSquare", "Lightbulb", "Bug", "Heart", "Star", "Sparkles"
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading type="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Error message={error} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Widget Configuration</h1>
            <p className="text-gray-600 mt-2">
              Customize and generate embeddable feedback widgets for your website
            </p>
          </div>
          <Button
            onClick={handleSaveConfig}
            variant="primary"
            disabled={saving}
          >
            {saving && <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />}
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              {/* Widget Type */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Widget Type</h3>
                <Select
                  value={widgetConfig.widgetType}
                  onChange={(e) => handleConfigChange("widgetType", e.target.value)}
                >
                  <option value="floating-button">Floating Button</option>
                  <option value="inline-form">Inline Form (Coming Soon)</option>
                  <option value="sidebar">Sidebar (Coming Soon)</option>
                </Select>
              </div>

              {/* Appearance Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
                <div className="space-y-4">
                  {/* Position */}
                  <Select
                    label="Position"
                    value={widgetConfig.position}
                    onChange={(e) => handleConfigChange("position", e.target.value)}
                  >
                    {positionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>

                  {/* Button Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Color
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={widgetConfig.buttonColor}
                        onChange={(e) => handleConfigChange("buttonColor", e.target.value)}
                        className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <Input
                        value={widgetConfig.buttonColor}
                        onChange={(e) => handleConfigChange("buttonColor", e.target.value)}
                        placeholder="#6366F1"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Button Text */}
                  <Input
                    label="Button Text"
                    value={widgetConfig.buttonText}
                    onChange={(e) => handleConfigChange("buttonText", e.target.value)}
                    placeholder="Feedback"
                  />

                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {iconOptions.map(icon => (
                        <button
                          key={icon}
                          onClick={() => handleConfigChange("iconName", icon)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all",
                            widgetConfig.iconName === icon
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <ApperIcon name={icon} size={20} className="mx-auto" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <Select
                    label="Size"
                    value={widgetConfig.size}
                    onChange={(e) => handleConfigChange("size", e.target.value)}
                  >
                    {sizeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                <div className="space-y-4">
                  <Input
                    label="Show on Pages (URL Pattern)"
                    value={widgetConfig.showOnPages}
                    onChange={(e) => handleConfigChange("showOnPages", e.target.value)}
                    placeholder="* (all pages)"
                    helperText="Use * for all pages, or specific paths like /products/*"
                  />

                  <Select
                    label="Language"
                    value={widgetConfig.language}
                    onChange={(e) => handleConfigChange("language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Select>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom CSS (Optional)
                    </label>
                    <textarea
                      value={widgetConfig.customCss}
                      onChange={(e) => handleConfigChange("customCss", e.target.value)}
                      placeholder=".feedback-widget { /* custom styles */ }"
                      className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              {/* Live Preview */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <Button
                    onClick={() => setShowPreviewModal(true)}
                    variant="secondary"
                    size="sm"
                  >
                    <ApperIcon name="Eye" size={16} />
                    Test Modal
                  </Button>
                </div>
                <div className="relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-96 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    Preview of your website
                  </div>
                  <FeedbackWidget
                    config={widgetConfig}
                    onClick={() => setShowPreviewModal(true)}
                  />
                </div>
              </div>

              {/* Embed Code */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Embed Code</h3>
                
                {/* Framework Selector */}
                <div className="flex gap-2 mb-4">
                  {["html", "react", "vue"].map(framework => (
                    <button
                      key={framework}
                      onClick={() => setSelectedFramework(framework)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                        selectedFramework === framework
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {framework.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Code Display */}
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono max-h-64">
                    {embedCode}
                  </pre>
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ApperIcon 
                      name={copiedCode ? "Check" : "Copy"} 
                      size={16} 
                      className="text-gray-100"
                    />
                  </button>
                </div>

                {/* Installation Instructions */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-2 mb-2">
                    <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">
                        Installation Instructions
                      </h4>
                      <div className="text-sm text-blue-800 space-y-1">
                        {selectedFramework === "html" && (
                          <>
                            <p>1. Copy the code above</p>
                            <p>2. Paste it before the closing &lt;/body&gt; tag in your HTML</p>
                            <p>3. Replace YOUR_PROJECT_ID with your actual project ID</p>
                          </>
                        )}
                        {selectedFramework === "react" && (
                          <>
                            <p>1. Install: npm install @your-app/feedback-widget</p>
                            <p>2. Import the component in your App.jsx</p>
                            <p>3. Add the FeedbackWidget component with your projectId</p>
                          </>
                        )}
                        {selectedFramework === "vue" && (
                          <>
                            <p>1. Install: npm install @your-app/feedback-widget</p>
                            <p>2. Import in your main Vue component</p>
                            <p>3. Add the feedback-widget component with your projectId</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Notice */}
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex gap-2">
                    <ApperIcon name="AlertTriangle" size={16} className="text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 text-sm mb-1">
                        Infrastructure Required
                      </h4>
                      <p className="text-sm text-amber-800">
                        This embed code requires Edge Functions and CDN hosting to work on external websites. 
                        Contact support for deployment assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <FeedbackWidgetModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          config={widgetConfig}
        />
      )}
    </div>
  );
};

export default AdminWidgetConfigPage;