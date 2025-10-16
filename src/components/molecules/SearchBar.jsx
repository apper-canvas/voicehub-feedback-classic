import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className, 
  placeholder = "Search...", 
  onSearch,
  value: controlledValue,
  onChange: controlledOnChange,
  showIcon = true,
  autoFocus = false
}) => {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const onChange = controlledOnChange || setInternalValue;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    onChange("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      {showIcon && (
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
      )}
      
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 py-3",
          "focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white focus:outline-none",
          "transition-all duration-200",
          showIcon ? "pl-12 pr-12" : "px-4"
        )}
      />
      
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;