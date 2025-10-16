import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const ChangelogWidgetModal = ({ 
  isOpen, 
  onClose, 
  changelogs = [],
  className 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSeeAll = () => {
    onClose();
    navigate("/changelog");
    toast.info("Viewing all changelog updates");
  };

  const getCategoryColor = (category) => {
    const colors = {
      "New Feature": "bg-blue-100 text-blue-700",
      "Improvement": "bg-purple-100 text-purple-700",
      "Bug Fix": "bg-red-100 text-red-700",
      "Technical": "bg-gray-100 text-gray-700",
      "Breaking Change": "bg-orange-100 text-orange-700",
      "Removed": "bg-amber-100 text-amber-700",
      "Documentation": "bg-green-100 text-green-700",
      "Security": "bg-indigo-100 text-indigo-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={cn(
          "fixed z-50 bg-white rounded-2xl shadow-2xl",
          "w-full max-w-md max-h-[600px]",
          "bottom-24 right-6",
          "overflow-hidden flex flex-col",
          "animate-in slide-in-from-bottom-4 duration-200",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-center gap-2">
            <ApperIcon name="Sparkles" size={20} className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">What's New</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {changelogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Package" size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent updates</p>
            </div>
          ) : (
            changelogs.map((changelog) => (
              <div
                key={changelog.Id}
                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                {/* Version & Date */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-primary-600">
                    {changelog.version}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(changelog.releaseDate), "MMM d, yyyy")}
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {changelog.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {changelog.description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {changelog.updates.slice(0, 3).map((update, index) => (
                    <Badge
                      key={index}
                      size="sm"
                      className={getCategoryColor(update.category)}
                    >
                      {update.category}
                    </Badge>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleSeeAll}
            variant="primary"
            size="md"
            className="w-full"
          >
            <ApperIcon name="ExternalLink" size={16} />
            See all updates
          </Button>
        </div>
      </div>
    </>
  );
};

export default ChangelogWidgetModal;