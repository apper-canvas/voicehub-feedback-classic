import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full status-badge";
  
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    planned: "bg-blue-50 text-blue-700 border border-blue-200",
    "in-progress": "bg-orange-50 text-orange-700 border border-orange-200", 
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white",
    accent: "bg-gradient-to-r from-accent-500 to-pink-600 text-white"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2"
  };
  
  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;