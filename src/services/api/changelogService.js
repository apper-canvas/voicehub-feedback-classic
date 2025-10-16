import changelogsData from '@/services/mockData/changelogs.json';

// Simulated delay for realistic API behavior
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Local state management
let changelogs = [...changelogsData];
let nextId = Math.max(...changelogs.map(item => item.Id)) + 1;

// Category options with icons and colors
export const CATEGORY_OPTIONS = [
  { value: 'New Feature', label: 'New Feature', icon: 'Sparkles', color: 'blue' },
  { value: 'Improvement', label: 'Improvement', icon: 'Zap', color: 'purple' },
  { value: 'Bug Fix', label: 'Bug Fix', icon: 'Bug', color: 'red' },
  { value: 'Technical', label: 'Technical', icon: 'Wrench', color: 'gray' },
  { value: 'Breaking Change', label: 'Breaking Change', icon: 'AlertTriangle', color: 'orange' },
  { value: 'Removed', label: 'Removed', icon: 'Trash2', color: 'brown' },
  { value: 'Documentation', label: 'Documentation', icon: 'FileText', color: 'green' },
  { value: 'Security', label: 'Security', icon: 'Shield', color: 'indigo' }
];

// Status options
export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'published', label: 'Published' }
];

// Get all changelogs with optional filtering
const getAll = async (filters = {}) => {
  await delay(300);
  
  let filtered = [...changelogs];
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(item => item.status === filters.status);
  }
  
  // Filter by categories (array of selected categories)
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(item => 
      item.updates.some(update => 
        filters.categories.includes(update.category)
      )
    );
  }
  
  // Filter by date range
  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    filtered = filtered.filter(item => {
      const releaseDate = new Date(item.releaseDate);
      return releaseDate >= start && releaseDate <= end;
    });
  }
  
  // Search in title, description, and update content
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.version.toLowerCase().includes(searchLower) ||
      item.updates.some(update => 
        update.title.toLowerCase().includes(searchLower) ||
        update.description.toLowerCase().includes(searchLower)
      )
    );
  }
  
  // Sort by release date (descending - newest first)
  filtered.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  
  return filtered;
};

// Get latest published changelogs (for widget display)
const getLatestPublished = async (limit = 5) => {
  await delay(200);
  
  const published = changelogs
    .filter(item => item.status === 'published')
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
    .slice(0, limit);
  
  return published;
};

// Get single changelog by ID
const getById = async (id) => {
  await delay(200);
  const changelog = changelogs.find(item => item.Id === parseInt(id));
  if (!changelog) {
    throw new Error('Changelog not found');
  }
  return { ...changelog };
};

const getByVersion = async (version) => {
  await delay(200);
  // Convert URL-safe version format (v1-2-0) back to standard format (1.2.0)
  const standardVersion = version.replace(/^v/, '').replace(/-/g, '.');
  const changelog = changelogs.find(item => item.version === standardVersion);
  if (!changelog) {
    throw new Error('Changelog not found');
  }
  return { ...changelog };
};

const getAdjacentVersions = async (currentVersion) => {
  await delay(200);
  const sorted = [...changelogs]
    .filter(c => c.status === 'published')
    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  
  const currentIndex = sorted.findIndex(c => c.version === currentVersion);
  
  return {
    previous: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null
  };
};

const getRelatedChangelogs = async (changelogId, limit = 3) => {
  await delay(200);
  const current = changelogs.find(c => c.Id === changelogId);
  if (!current) return [];
  
  const currentCategories = [...new Set(current.updates.map(u => u.category))];
  
  const related = changelogs
    .filter(c => c.Id !== changelogId && c.status === 'published')
    .map(c => {
      const categories = [...new Set(c.updates.map(u => u.category))];
      const matchingCategories = categories.filter(cat => currentCategories.includes(cat)).length;
      const dateDiff = Math.abs(new Date(c.releaseDate) - new Date(current.releaseDate));
      
      return {
        ...c,
        score: matchingCategories * 1000 - dateDiff / (1000 * 60 * 60 * 24)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return related;
};

const submitHelpfulFeedback = async (changelogId, wasHelpful) => {
  await delay(300);
  // In a real app, this would save to backend
  // For now, just simulate the operation
  return { success: true, wasHelpful };
};

// Get next version suggestion
const getNextVersion = async () => {
  await delay(100);
  const publishedChangelogs = changelogs.filter(c => c.status === 'published');
  if (publishedChangelogs.length === 0) {
    return '1.0.0';
  }
  
  // Get highest version and increment patch number
  const versions = publishedChangelogs.map(c => c.version);
  const latest = versions.sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if (aParts[i] !== bParts[i]) return bParts[i] - aParts[i];
    }
    return 0;
  })[0];
  
  const parts = latest.split('.').map(Number);
  parts[2]++; // Increment patch version
  return parts.join('.');
};

// Create new changelog
const create = async (changelogData) => {
  await delay(400);
  
  const newChangelog = {
    Id: nextId++,
    version: changelogData.version,
    title: changelogData.title,
    description: changelogData.description,
    releaseDate: changelogData.releaseDate || new Date().toISOString(),
    status: changelogData.status || 'draft',
    visibility: changelogData.visibility || 'public',
    updates: changelogData.updates || [],
    reactions: {
      like: 0,
      love: 0,
      celebrate: 0
    },
    tags: changelogData.tags || [],
    notifySubscribers: changelogData.notifySubscribers || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  changelogs.push(newChangelog);
  return { ...newChangelog };
};

// Update existing changelog
const update = async (id, changelogData) => {
  await delay(400);
  
  const index = changelogs.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Changelog not found');
  }
  
  const updatedChangelog = {
    ...changelogs[index],
    ...changelogData,
    Id: changelogs[index].Id,
    reactions: changelogs[index].reactions, // Preserve reactions
    createdAt: changelogs[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  
  changelogs[index] = updatedChangelog;
  return { ...updatedChangelog };
};

// Delete changelog
const deleteChangelog = async (id) => {
  await delay(300);
  
  const index = changelogs.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Changelog not found');
  }
  
  changelogs.splice(index, 1);
  return { success: true };
};

// Toggle reaction on changelog
const toggleReaction = async (id, reactionType) => {
  await delay(200);
  
  const index = changelogs.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Changelog not found');
  }
  
  if (!['like', 'love', 'celebrate'].includes(reactionType)) {
    throw new Error('Invalid reaction type');
  }
  
  // Simple toggle - increment or decrement
  // In a real app, would track user reactions
  const currentCount = changelogs[index].reactions[reactionType];
  changelogs[index].reactions[reactionType] = Math.max(0, currentCount > 0 ? currentCount - 1 : currentCount + 1);
  
  changelogs[index].updatedAt = new Date().toISOString();
  
  return { ...changelogs[index] };
};

// Publish a draft changelog
const publish = async (id) => {
  await delay(300);
  
  const index = changelogs.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Changelog not found');
  }
  
  changelogs[index].status = 'published';
  changelogs[index].releaseDate = new Date().toISOString();
  changelogs[index].updatedAt = new Date().toISOString();
  
  return { ...changelogs[index] };
};

// Duplicate a changelog
const duplicate = async (id) => {
  await delay(300);
  
  const original = changelogs.find(item => item.Id === parseInt(id));
  if (!original) {
    throw new Error('Changelog not found');
  }
  
  const duplicated = {
    ...original,
    Id: nextId++,
    version: `${original.version}-copy`,
    title: `${original.title} (Copy)`,
    status: 'draft',
    reactions: {
      like: 0,
      love: 0,
      celebrate: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  changelogs.push(duplicated);
  return { ...duplicated };
};

// Get statistics
const getStats = async () => {
  await delay(200);
  
  const published = changelogs.filter(c => c.status === 'published').length;
  const drafts = changelogs.filter(c => c.status === 'draft').length;
  const scheduled = changelogs.filter(c => c.status === 'scheduled').length;
  const totalReactions = changelogs.reduce((sum, c) => 
    sum + c.reactions.like + c.reactions.love + c.reactions.celebrate, 0
  );
  
  return {
    published,
    drafts,
    scheduled,
    total: changelogs.length,
    totalReactions
  };
};

export const changelogService = {
  getAll,
  getLatestPublished,
  getById,
  getByVersion,
  getAdjacentVersions,
  getRelatedChangelogs,
  submitHelpfulFeedback,
  getNextVersion,
  create,
  update,
  delete: deleteChangelog,
  toggleReaction,
  publish,
  duplicate,
  getStats,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS
};