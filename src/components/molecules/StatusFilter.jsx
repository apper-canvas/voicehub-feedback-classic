import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const StatusFilter = ({ 
  className, 
  activeStatus = "all",
  onStatusChange,
  counts = {}
}) => {
  const statuses = [
    { key: "all", label: "All", variant: "default" },
    { key: "planned", label: "Planned", variant: "planned" },
    { key: "in-progress", label: "In Progress", variant: "in-progress" },
    { key: "completed", label: "Completed", variant: "completed" },
    { key: "cancelled", label: "Cancelled", variant: "cancelled" }
  ];

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {statuses.map((status) => {
        const isActive = activeStatus === status.key;
        const count = counts[status.key] || 0;
        
        return (
          <button
            key={status.key}
            onClick={() => onStatusChange(status.key)}
            className={cn(
              "transition-all duration-200 transform hover:scale-105",
              isActive && "ring-2 ring-primary-500 ring-offset-2"
            )}
          >
            <Badge 
              variant={isActive ? "primary" : status.variant}
              size="md"
              className="cursor-pointer"
            >
              {status.label}
              {count > 0 && (
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs font-medium",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-200 text-gray-700"
                )}>
                  {count}
                </span>
              )}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};

export default StatusFilter;