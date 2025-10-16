import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  helperText,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 resize-vertical",
          "focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white focus:outline-none",
          "transition-all duration-200",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50",
          className
        )}
        ref={ref}
        {...props}
      />
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

Textarea.displayName = "Textarea";

export default Textarea;