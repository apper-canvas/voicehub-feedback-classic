import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { useAuth } from "@/layouts/Root";
const Header = () => {
const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();

  const isOnBoardsPage = location.pathname === "/";
  const isOnBoardDetailPage = location.pathname.startsWith("/boards/");
  const isOnPostDetailPage = location.pathname.startsWith("/posts/");
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      toast.info(`Search functionality coming soon for: "${query}"`);
    }
  };

const handleSubmitFeedback = () => {
    if (isOnBoardDetailPage) {
      // Trigger board's submit feedback modal
      const event = new window.CustomEvent("openSubmitModal");
      window.dispatchEvent(event);
    } else {
      toast.info("Please select a board first to submit feedback");
    }
  };

const getPageTitle = () => {
    if (isOnBoardsPage) return "Feedback Boards";
    if (isOnBoardDetailPage) return "Board Details";
    if (isOnPostDetailPage) return "Post Details";
    if (location.pathname === "/admin/boards") return "Manage Boards";
    if (location.pathname === "/roadmap") return "Product Roadmap";
    return "VoiceHub";
  };

const getPageDescription = () => {
    if (isOnBoardsPage) return "Browse all feedback boards and discover what others are saying";
    if (isOnBoardDetailPage) return "View and vote on feedback posts";
    if (isOnPostDetailPage) return "Full post details and discussion";
    if (location.pathname === "/admin/boards") return "Create and manage your feedback boards";
    if (location.pathname === "/roadmap") return "Visualize and manage your product development timeline";
    return "Feedback management platform";
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Page Title */}
          <div className="flex-1 min-w-0 lg:pl-0 pl-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 gradient-text">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {getPageDescription()}
              </p>
            </div>
          </div>

          {/* Right Section - Search & Actions */}
          <div className="flex items-center gap-4 ml-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:block">
              <SearchBar
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                className="w-80"
              />
            </div>

            {/* Submit Feedback Button */}
            {(isOnBoardsPage || isOnBoardDetailPage) && (
              <Button
                onClick={handleSubmitFeedback}
                variant="primary"
                size="md"
                className="flex-shrink-0"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Submit Feedback</span>
                <span className="sm:hidden">Submit</span>
              </Button>
            )}

{/* Create Board Button - Admin pages */}
            {location.pathname === "/admin/boards" && (
              <Button
                onClick={() => {
                  const event = new window.CustomEvent("openCreateBoardModal");
                  window.dispatchEvent(event);
                }}
                variant="primary"
                size="md"
                className="flex-shrink-0"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span className="hidden sm:inline">Create Board</span>
                <span className="sm:hidden">Create</span>
              </Button>
            )}

            {/* Mobile Search Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="md"
                onClick={() => toast.info("Search functionality coming soon")}
              >
                <ApperIcon name="Search" className="w-5 h-5" />
              </Button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="md"
                onClick={() => toast.info("Notifications coming soon")}
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            </div>

            {/* User Menu */}
<div className="relative">
              <Button
                variant="ghost"
                size="md"
                onClick={logout}
                className="flex items-center gap-2 px-4"
              >
                <ApperIcon name="LogOut" size={18} />
                <span className="text-sm font-medium">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;