import roadmapData from '@/services/mockData/roadmap.json';

// Simulated delay for realistic API behavior
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Local state management
let roadmapItems = [...roadmapData];
let nextId = Math.max(...roadmapItems.map(item => item.Id)) + 1;

// Status options
export const STATUS_OPTIONS = [
  'Backlog',
  'Planned',
  'In Progress',
  'Shipped'
];

// Priority options
export const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High', emoji: '🔥' },
  { value: 'Medium', label: 'Medium', emoji: '⭐' },
  { value: 'Low', label: 'Low', emoji: '💡' }
];

// Category options
export const CATEGORY_OPTIONS = [
  'Features',
  'Improvements',
  'Bug Fixes',
  'Technical Debt',
  'Research'
];

// Get all roadmap items with optional filtering
const getAll = async (filters = {}) => {
  await delay(300);
  
  let filtered = [...roadmapItems];
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(item => item.status === filters.status);
  }
  
  // Filter by priority
  if (filters.priority && filters.priority !== 'all') {
    filtered = filtered.filter(item => item.priority === filters.priority);
  }
  
  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(item => item.category === filters.category);
  }
  
  // Search in title, description, and assignee
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.assignee.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by due date (ascending)
  filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  return filtered;
};

// Get single roadmap item by ID
const getById = async (id) => {
  await delay(200);
  const item = roadmapItems.find(item => item.Id === parseInt(id));
  if (!item) {
    throw new Error('Roadmap item not found');
  }
  return { ...item };
};

// Create new roadmap item
const create = async (itemData) => {
  await delay(400);
  
  const newItem = {
    Id: nextId++,
    title: itemData.title,
    description: itemData.description,
    status: itemData.status || 'Planned',
    priority: itemData.priority || 'Medium',
    category: itemData.category,
    startDate: itemData.startDate,
    dueDate: itemData.dueDate,
    progress: itemData.progress || 0,
    assignee: itemData.assignee,
    linkedFeedbackCount: itemData.linkedFeedbackCount || 0,
    tags: itemData.tags || [],
    visibility: itemData.visibility || 'Public',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  roadmapItems.push(newItem);
  return { ...newItem };
};

// Update existing roadmap item
const update = async (id, itemData) => {
  await delay(400);
  
  const index = roadmapItems.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Roadmap item not found');
  }
  
  const updatedItem = {
    ...roadmapItems[index],
    ...itemData,
    Id: roadmapItems[index].Id,
    createdAt: roadmapItems[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  
  roadmapItems[index] = updatedItem;
  return { ...updatedItem };
};

// Delete roadmap item
const deleteItem = async (id) => {
  await delay(300);
  
  const index = roadmapItems.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Roadmap item not found');
  }
  
  roadmapItems.splice(index, 1);
  return { success: true };
};

// Update item status
const updateStatus = async (id, status) => {
  await delay(300);
  
  const index = roadmapItems.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Roadmap item not found');
  }
  
  roadmapItems[index].status = status;
  roadmapItems[index].updatedAt = new Date().toISOString();
  
  // Auto-update progress based on status
  if (status === 'Shipped') {
    roadmapItems[index].progress = 100;
  } else if (status === 'Backlog') {
    roadmapItems[index].progress = 0;
  } else if (status === 'Planned') {
    roadmapItems[index].progress = 25;
  } else if (status === 'In Progress') {
    if (roadmapItems[index].progress < 25) {
      roadmapItems[index].progress = 50;
    }
  }
  
  return { ...roadmapItems[index] };
};

// Update item progress
const updateProgress = async (id, progress) => {
  await delay(300);
  
  const index = roadmapItems.findIndex(item => item.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Roadmap item not found');
  }
  
  roadmapItems[index].progress = Math.max(0, Math.min(100, progress));
  roadmapItems[index].updatedAt = new Date().toISOString();
  
  // Auto-update status based on progress
  if (roadmapItems[index].progress === 100) {
    roadmapItems[index].status = 'Shipped';
  } else if (roadmapItems[index].progress > 50) {
    roadmapItems[index].status = 'In Progress';
  } else if (roadmapItems[index].progress > 0) {
    if (roadmapItems[index].status === 'Backlog') {
      roadmapItems[index].status = 'Planned';
    }
  }
  
  return { ...roadmapItems[index] };
};

// Get items by date range for timeline view
const getByDateRange = async (startDate, endDate) => {
  await delay(300);
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return roadmapItems.filter(item => {
    const itemStart = new Date(item.startDate);
    const itemEnd = new Date(item.dueDate);
    
    return (itemStart <= end && itemEnd >= start);
  });
};

export const roadmapService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteItem,
  updateStatus,
  updateProgress,
  getByDateRange,
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  CATEGORY_OPTIONS
};