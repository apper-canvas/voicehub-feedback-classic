import { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CommentInput = ({ 
  className,
  onSubmit,
  onCancel,
  placeholder = "Share your thoughts...",
  submitLabel = "Post Comment",
  cancelLabel = "Cancel",
  showCancel = false,
  autoFocus = false,
  initialValue = ""
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  const handleSubmit = async () => {
    const text = content.trim();
    if (!text || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setContent("");
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    if (onCancel) {
      onCancel();
    }
  };

  const handleInput = (e) => {
    setContent(e.target.innerText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const characterCount = content.length;
  const maxLength = 2000;
  const isNearLimit = characterCount > maxLength * 0.9;
  const isOverLimit = characterCount > maxLength;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-300", className)}>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={cn(
          "min-h-[100px] max-h-[300px] overflow-y-auto p-4 outline-none",
          "prose prose-sm max-w-none",
          "focus:bg-gray-50 transition-colors",
          "text-gray-900 placeholder:text-gray-500"
        )}
        data-placeholder={placeholder}
        autoFocus={autoFocus}
        suppressContentEditableWarning
      >
        {initialValue}
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <div className="flex items-center gap-4">
          <div className={cn(
            "text-sm",
            isOverLimit ? "text-red-600 font-medium" : isNearLimit ? "text-orange-600" : "text-gray-500"
          )}>
            {characterCount} / {maxLength}
          </div>
          
          <div className="text-xs text-gray-500 hidden sm:block">
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Cmd/Ctrl</kbd>
            {" + "}
            <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
            {" to submit"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isOverLimit || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <ApperIcon name="Send" className="w-4 h-4" />
                {submitLabel}
              </>
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default CommentInput;