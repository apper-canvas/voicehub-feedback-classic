import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import CreateChangelogModal from '@/components/organisms/CreateChangelogModal';
import ChangelogPreviewModal from '@/components/organisms/ChangelogPreviewModal';
import ApperIcon from '@/components/ApperIcon';
import { changelogService } from '@/services/api/changelogService';
import { cn } from '@/utils/cn';

const AdminChangelogsPage = () => {
  const [changelogs, setChangelogs] = useState([]);
  const [filteredChangelogs, setFilteredChangelogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingChangelog, setEditingChangelog] = useState(null);
  const [previewingChangelog, setPreviewingChangelog] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'version', 'reactions'

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [changelogs, searchQuery, statusFilter, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [changelogsData, statsData] = await Promise.all([
        changelogService.getAll(),
        changelogService.getStats()
      ]);
      setChangelogs(changelogsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load changelogs');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...changelogs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(changelog => 
        changelog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        changelog.version.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(changelog => changelog.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      } else if (sortBy === 'version') {
        return b.version.localeCompare(a.version);
      } else if (sortBy === 'reactions') {
        const aTotal = a.reactions.like + a.reactions.love + a.reactions.celebrate;
        const bTotal = b.reactions.like + b.reactions.love + b.reactions.celebrate;
        return bTotal - aTotal;
      }
      return 0;
    });

    setFilteredChangelogs(filtered);
  };

  const handleCreateChangelog = async (changelogData) => {
    try {
      if (editingChangelog) {
        await changelogService.update(editingChangelog.Id, changelogData);
        toast.success('Changelog updated successfully');
      } else {
        await changelogService.create(changelogData);
        toast.success('Changelog created successfully');
      }
      await loadData();
      setIsCreateModalOpen(false);
      setEditingChangelog(null);
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = (changelog) => {
    setEditingChangelog(changelog);
    setIsCreateModalOpen(true);
  };

  const handlePreview = (changelog) => {
    setPreviewingChangelog(changelog);
    setIsPreviewModalOpen(true);
  };

  const handlePublish = async (changelogId) => {
    try {
      await changelogService.publish(changelogId);
      toast.success('Changelog published successfully');
      await loadData();
      setIsPreviewModalOpen(false);
    } catch (err) {
      toast.error('Failed to publish changelog');
    }
  };

  const handleDelete = async (changelog) => {
    if (!confirm(`Are you sure you want to delete version ${changelog.version}?`)) {
      return;
    }

    try {
      await changelogService.delete(changelog.Id);
      toast.success('Changelog deleted successfully');
      await loadData();
    } catch (err) {
      toast.error('Failed to delete changelog');
    }
  };

  const handleDuplicate = async (changelog) => {
    try {
      await changelogService.duplicate(changelog.Id);
      toast.success('Changelog duplicated successfully');
      await loadData();
    } catch (err) {
      toast.error('Failed to duplicate changelog');
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      scheduled: 'accent'
    };
    return variants[status] || 'secondary';
  };

  if (loading) {
    return <Loading type="spinner" className="py-20" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to Load Changelogs"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Changelogs</h1>
            <p className="text-gray-600 mt-1">Manage your release notes and updates</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Create Changelog
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <ApperIcon name="FileText" size={24} className="text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Published</p>
                  <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                </div>
                <ApperIcon name="CheckCircle" size={24} className="text-green-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Drafts</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
                </div>
                <ApperIcon name="Edit" size={24} className="text-yellow-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reactions</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalReactions}</p>
                </div>
                <ApperIcon name="Heart" size={24} className="text-blue-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by title or version..."
              onSearch={setSearchQuery}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="version">Sort by Version</option>
              <option value="reactions">Sort by Reactions</option>
            </select>
          </div>
        </div>
      </div>

      {/* Changelogs Table */}
      {filteredChangelogs.length === 0 ? (
        <Empty
          icon="FileText"
          title="No Changelogs Found"
          description="Create your first changelog to get started"
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <ApperIcon name="Plus" size={18} className="mr-2" />
              Create Changelog
            </Button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reactions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredChangelogs.map((changelog) => (
                  <tr key={changelog.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary-600">{changelog.version}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{changelog.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(changelog.releaseDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadge(changelog.status)} size="sm">
                        {changelog.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {changelog.reactions.like + changelog.reactions.love + changelog.reactions.celebrate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handlePreview(changelog)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Preview"
                        >
                          <ApperIcon name="Eye" size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleEdit(changelog)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <ApperIcon name="Edit" size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(changelog)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Duplicate"
                        >
                          <ApperIcon name="Copy" size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(changelog)}
                          className="p-1.5 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <ApperIcon name="Trash2" size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateChangelogModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingChangelog(null);
        }}
        onSubmit={handleCreateChangelog}
        initialData={editingChangelog}
      />

      <ChangelogPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setPreviewingChangelog(null);
        }}
        changelog={previewingChangelog}
        onEdit={() => {
          setIsPreviewModalOpen(false);
          handleEdit(previewingChangelog);
        }}
        onPublish={() => handlePublish(previewingChangelog.Id)}
      />
    </div>
  );
};

export default AdminChangelogsPage;