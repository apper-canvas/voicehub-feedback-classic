import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

const navigationItems = [
    {
      name: "Feedback Boards",
      href: "/",
      icon: "LayoutGrid",
      description: "View all feedback boards"
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      icon: "Map",
      description: "Product development timeline"
},
    {
      name: "Changelog",
      href: "/changelog", 
      icon: "FileText",
      description: "Latest updates and releases"
    },
    {
      name: "Search",
      href: "/search",
      icon: "Search",
      description: "Find feedback across boards",
      badge: "Coming Soon", 
      disabled: true
    }
  ];

  const adminItems = [
    {
      name: "Manage Boards",
      href: "/admin/boards",
      icon: "Settings",
      description: "Board settings and management"
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: "BarChart3",
      description: "Feedback insights and metrics",
      badge: "Coming Soon",
      disabled: true
    }
  ];

  const NavItem = ({ item, onClick }) => {
    const isActive = location.pathname === item.href;
    
    if (item.disabled) {
      return (
        <div className="relative px-3 py-2 text-gray-400 cursor-not-allowed">
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <ApperIcon name={item.icon} className="w-5 h-5" />
            <div className="flex-1">
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-400">{item.description}</div>
            </div>
            {item.badge && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full font-medium">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      );
}

    return (
      <NavLink
        to={item.href}
        onClick={onClick}
        className="relative block"
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-lg" />
            )}
            <div className="relative flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <ApperIcon name={item.icon} className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className={cn(
                  "text-xs",
                  isActive ? "text-white/80" : "text-gray-500"
                )}>
                  {item.description}
                </div>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-2 py-1 text-xs rounded-full font-medium",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-100 text-gray-600"
                )}>
                  {item.badge}
                </span>
              )}
            </div>
          </>
        )}
      </NavLink>
    );
  };

  // Desktop Sidebar Content
  const SidebarContent = ({ onItemClick }) => (
    <div className="h-screen bg-white border-r border-gray-200 p-6 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="MessageSquare" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">VoiceHub</h1>
            <p className="text-xs text-gray-500">Feedback Platform</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Main
        </h3>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.href} item={item} onClick={onItemClick} />
          ))}
        </nav>
      </div>

      {/* Admin Section */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Administration
        </h3>
        <nav className="space-y-1">
          {adminItems.map((item) => (
            <NavItem key={item.href} item={item} onClick={onItemClick} />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>© 2024 VoiceHub</p>
          <p className="mt-1">Feedback Management Platform</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible on lg+ */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ApperIcon name="Menu" className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageSquare" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold gradient-text">VoiceHub</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto h-full">
              {/* Main Navigation */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Main
                </h3>
                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavItem 
                      key={item.href} 
                      item={item} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                    />
                  ))}
                </nav>
              </div>

              {/* Admin Section */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Administration
                </h3>
                <nav className="space-y-1">
                  {adminItems.map((item) => (
                    <NavItem 
                      key={item.href} 
                      item={item} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;