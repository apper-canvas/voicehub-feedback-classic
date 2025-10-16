import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import ChangelogWidget from "@/components/molecules/ChangelogWidget";
import ChangelogWidgetModal from "@/components/molecules/ChangelogWidgetModal";
import { changelogService } from "@/services/api/changelogService";
import { getViewedChangelogIds, markAllAsViewed } from "@/utils/changelogStorage";

const Layout = () => {
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [latestChangelogs, setLatestChangelogs] = useState([]);
  const [hasUnreadChangelogs, setHasUnreadChangelogs] = useState(false);

  useEffect(() => {
    loadLatestChangelogs();
  }, []);

  const loadLatestChangelogs = async () => {
    try {
      const changelogs = await changelogService.getLatestPublished(5);
      setLatestChangelogs(changelogs);

      // Check for unread changelogs
      const viewedIds = getViewedChangelogIds();
      const hasUnread = changelogs.some(cl => !viewedIds.includes(cl.Id));
      setHasUnreadChangelogs(hasUnread);
    } catch (error) {
      console.error("Error loading latest changelogs:", error);
    }
  };

  const handleOpenChangelogModal = () => {
    setShowChangelogModal(true);
    
    // Mark all as viewed when modal opens
    if (latestChangelogs.length > 0) {
      const changelogIds = latestChangelogs.map(cl => cl.Id);
      markAllAsViewed(changelogIds);
      setHasUnreadChangelogs(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="lg:flex">
        {/* Desktop Sidebar - Static positioning */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0">
          <Header />
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Changelog Widget */}
      <ChangelogWidget
        onClick={handleOpenChangelogModal}
        hasUnread={hasUnreadChangelogs}
        position="bottom-right"
      />

      {/* Changelog Widget Modal */}
      <ChangelogWidgetModal
        isOpen={showChangelogModal}
        onClose={() => setShowChangelogModal(false)}
        changelogs={latestChangelogs}
      />
    </div>
  );
};

export default Layout;