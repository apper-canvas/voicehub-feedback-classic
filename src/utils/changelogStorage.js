// LocalStorage utility for tracking viewed changelogs

const STORAGE_KEY = 'voicehub_viewed_changelogs';

/**
 * Get all viewed changelog IDs from localStorage
 * @returns {number[]} Array of changelog IDs that have been viewed
 */
export const getViewedChangelogIds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading viewed changelogs:', error);
    return [];
  }
};

/**
 * Mark a changelog as viewed
 * @param {number} changelogId - The changelog ID to mark as viewed
 */
export const markChangelogAsViewed = (changelogId) => {
  try {
    const viewedIds = getViewedChangelogIds();
    if (!viewedIds.includes(changelogId)) {
      viewedIds.push(changelogId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedIds));
    }
  } catch (error) {
    console.error('Error marking changelog as viewed:', error);
  }
};

/**
 * Mark multiple changelogs as viewed
 * @param {number[]} changelogIds - Array of changelog IDs to mark as viewed
 */
export const markAllAsViewed = (changelogIds) => {
  try {
    const viewedIds = getViewedChangelogIds();
    const newIds = changelogIds.filter(id => !viewedIds.includes(id));
    if (newIds.length > 0) {
      const updatedIds = [...viewedIds, ...newIds];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
    }
  } catch (error) {
    console.error('Error marking changelogs as viewed:', error);
  }
};

/**
 * Check if a changelog has been viewed
 * @param {number} changelogId - The changelog ID to check
 * @returns {boolean} True if the changelog has been viewed
 */
export const hasViewedChangelog = (changelogId) => {
  const viewedIds = getViewedChangelogIds();
  return viewedIds.includes(changelogId);
};

/**
 * Clear all viewed changelog records
 */
export const clearViewedChangelogs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing viewed changelogs:', error);
  }
};