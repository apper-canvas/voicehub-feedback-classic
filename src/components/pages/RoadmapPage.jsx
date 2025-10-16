import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addMonths, eachMonthOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { roadmapService } from "@/services/api/roadmapService";
import { voteService } from "@/services/api/voteService";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import RoadmapItemModal from "@/components/organisms/RoadmapItemModal";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import RoadmapCard from "@/components/molecules/RoadmapCard";
import KanbanBoard from "@/components/molecules/KanbanBoard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const RoadmapPage = () => {
const [roadmapItems, setRoadmapItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [viewMode, setViewMode] = useState('kanban'); // 'timeline', 'kanban', or 'list'
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // Timeline configuration
  const timelineStart = new Date('2024-10-01');
  const timelineEnd = new Date('2025-06-30');
  const months = eachMonthOfInterval({ start: timelineStart, end: timelineEnd });
  const currentDate = new Date();

  useEffect(() => {
    loadRoadmapItems();
  }, []);

useEffect(() => {
    applyFilters();
  }, [roadmapItems, filters, sortField, sortDirection]);

  const sortItems = (items) => {
    const sorted = [...items].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle special cases
      if (sortField === 'dueDate') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortField === 'progress') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortField === 'votes') {
aVal = voteCounts[a.Id] || 0;
        bVal = voteCounts[b.Id] || 0;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

const { user } = useSelector((state) => state.user);
  const [voteCounts, setVoteCounts] = useState({});
  const [isVoting, setIsVoting] = useState(false);

  // Load vote counts for all visible items
  const loadVoteCounts = useCallback(async () => {
    if (!filteredItems || filteredItems.length === 0) return;

    try {
      const counts = {};
      await Promise.all(
        filteredItems.map(async (item) => {
          const count = await voteService.getVoteCountByPostId(item.Id);
          counts[item.Id] = count;
        })
      );
      setVoteCounts(counts);
    } catch (error) {
      console.error('Error loading vote counts:', error);
      toast.error('Failed to load vote counts');
    }
  }, [filteredItems]);

  // Handle vote toggle
  const handleVoteToggle = async (itemId) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    if (isVoting) return;

    setIsVoting(true);
    try {
      const result = await voteService.toggleVote(itemId, user.userId);
      
      // Update local vote count
      setVoteCounts(prev => ({
        ...prev,
        [itemId]: result.action === 'added' 
          ? (prev[itemId] || 0) + 1 
          : Math.max(0, (prev[itemId] || 0) - 1)
      }));

      toast.success(result.action === 'added' ? 'Vote added!' : 'Vote removed');
    } catch (error) {
      toast.error(error.message || 'Failed to update vote');
    } finally {
      setIsVoting(false);
    }
  };

  // Load vote counts when filtered items change
  useEffect(() => {
    loadVoteCounts();
  }, [loadVoteCounts]);

  const loadRoadmapItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await roadmapService.getAll();
      setRoadmapItems(items);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load roadmap items');
    } finally {
      setLoading(false);
    }
  };

const applyFilters = () => {
    let filtered = [...roadmapItems];

    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.assignee.toLowerCase().includes(searchLower)
      );
    }

    const sorted = sortItems(filtered);
    setFilteredItems(sorted);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
  };

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

const handleSubmitItem = async (itemData) => {
    try {
      if (selectedItem) {
        await roadmapService.update(selectedItem.Id, itemData);
        toast.success('Roadmap item updated successfully');
      } else {
        await roadmapService.create(itemData);
        toast.success('Roadmap item created successfully');
      }
      await loadRoadmapItems();
      handleCloseModal();
    } catch (error) {
      throw error;
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await roadmapService.updateStatus(itemId, newStatus);
      await loadRoadmapItems();
      toast.success(`Item moved to ${newStatus}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await roadmapService.delete(itemId);
      await loadRoadmapItems();
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const groupItemsByStatus = (items) => {
    const grouped = {
      'Planned': [],
      'In Progress': [],
      'Completed': [],
      'On Hold': [],
      'Research': []
    };

    items.forEach(item => {
      if (grouped[item.status]) {
        grouped[item.status].push(item);
      }
    });

    return grouped;
  };

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadRoadmapItems} />;
  }

const groupedItems = groupItemsByStatus(filteredItems);

  const getPriorityIcon = (priority) => {
    const icons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    return icons[priority] || '⚪';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planned': 'bg-gray-500',
      'In Progress': 'bg-blue-500',
      'Completed': 'bg-green-500',
      'On Hold': 'bg-yellow-500',
      'Research': 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getProgressColor = (progress) => {
    const value = parseFloat(progress) || 0;
    if (value >= 80) return 'bg-green-500';
    if (value >= 50) return 'bg-blue-500';
    if (value >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ChevronsUpDown" size={14} className="text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ApperIcon name="ChevronUp" size={14} className="text-primary-600" />
      : <ApperIcon name="ChevronDown" size={14} className="text-primary-600" />;
  };

  return (
<div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="Map" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Roadmap</h1>
              <p className="text-gray-600 text-sm">
{viewMode === 'kanban' ? 'Kanban board view' : viewMode === 'list' ? 'List view with sortable columns' : 'Timeline view of product development'}
              </p>
            </div>
          </div>

<div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="Columns3" size={16} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="Table2" size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ApperIcon name="Calendar" size={16} />
                Timeline
              </button>
            </div>

            <Button onClick={handleOpenCreateModal} className="btn-press">
              <ApperIcon name="Plus" size={18} />
              Add Item
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            {roadmapService.STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>

          <Select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            {roadmapService.PRIORITY_OPTIONS.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.emoji} {priority.label}
              </option>
            ))}
          </Select>

          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {roadmapService.CATEGORY_OPTIONS.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          <SearchBar
            placeholder="Search roadmap..."
            onSearch={handleSearch}
            initialValue={filters.search}
          />
        </div>

        {/* Legend - Only show for Timeline view */}
        {viewMode === 'timeline' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-gray-700">Status:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-gray-600">Backlog</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-gray-600">Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600">Shipped</span>
              </div>
            </div>
          </div>
        )}
      </div>

{/* View Content */}
{filteredItems.length === 0 ? (
        <Empty
          title="No roadmap items found"
          message="Start building your product roadmap by adding your first item."
          actionLabel="Add First Item"
          onAction={handleOpenCreateModal}
        />
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      <SortIcon field="title" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center gap-2">
                      Priority
                      <SortIcon field="priority" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      <SortIcon field="category" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center gap-2">
                      Due Date
                      <SortIcon field="dueDate" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('progress')}
                  >
                    <div className="flex items-center gap-2">
                      Progress
                      <SortIcon field="progress" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('votes')}
                  >
                    <div className="flex items-center gap-2">
                      Votes
                      <SortIcon field="votes" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => {
const voteCount = voteCounts[item.Id] || 0;
                  const progressValue = parseFloat(item.progress) || 0;
                  
                  return (
                    <tr key={item.Id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline text-left"
                        >
                          {item.title}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`${getStatusColor(item.status)} text-white border-0`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPriorityIcon(item.priority)}</span>
                          <span className="text-sm text-gray-700 capitalize">{item.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{item.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${getProgressColor(item.progress)}`}
                              style={{ width: `${progressValue}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-12 text-right">
                            {progressValue}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
<div className="flex items-center gap-2">
                          <ApperIcon name="ThumbsUp" size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{voteCounts[selectedItem?.Id] || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <ApperIcon name="Pencil" size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.Id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
<KanbanBoard
          items={filteredItems}
          onStatusChange={handleStatusChange}
          onEditItem={handleOpenEditModal}
          onDeleteItem={handleDeleteItem}
        />
      ) : (
        <div className="bg-white rounded-2xl shadow-card p-6">
          {/* Timeline Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Timeline View</h2>
              <div className="text-sm text-gray-600">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} shown
              </div>
            </div>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Month Headers */}
            <div className="flex gap-4 mb-6 pb-4 border-b-2 border-gray-300 overflow-x-auto">
              {months.map((month, index) => (
                <div key={index} className="flex-shrink-0 min-w-[280px]">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      {format(month, 'MMMM yyyy')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(month, 'QQQ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Date Indicator */}
            {currentDate >= timelineStart && currentDate <= timelineEnd && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{
                  left: `${((currentDate - timelineStart) / (timelineEnd - timelineStart)) * 100}%`
                }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500 text-white text-xs rounded whitespace-nowrap">
                  Today
                </div>
              </div>
            )}

            {/* Swimlanes by Status */}
            <div className="space-y-8">
              {Object.entries(groupedItems).map(([status, items]) => (
                items.length > 0 && (
                  <div key={status} className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {status} ({items.length})
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {items.map((item) => (
                        <RoadmapCard
                          key={item.Id}
                          item={item}
                          onClick={() => handleOpenEditModal(item)}
                        />
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
{/* Modal */}
      <RoadmapItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitItem}
        item={selectedItem}
      />
    </div>
  );
};

export default RoadmapPage;