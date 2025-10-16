import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  children,
  label,
  error,
  helperText,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900",
            "focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white focus:outline-none",
            "transition-all duration-200 appearance-none cursor-pointer",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
        />
      </div>
      {helperText && (
        <p className={cn(
          "mt-2 text-sm",
          error ? "text-red-600" : "text-gray-600"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;