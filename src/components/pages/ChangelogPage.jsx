import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import SearchBar from '@/components/molecules/SearchBar';
import CategoryFilter from '@/components/molecules/CategoryFilter';
import ChangelogCard from '@/components/molecules/ChangelogCard';
import ApperIcon from '@/components/ApperIcon';
import { changelogService } from '@/services/api/changelogService';

const ChangelogPage = () => {
  const [changelogs, setChangelogs] = useState([]);
  const [filteredChangelogs, setFilteredChangelogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [viewMode, setViewMode] = useState('card'); // 'card', 'compact', 'timeline'

  useEffect(() => {
    loadChangelogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [changelogs, searchQuery, selectedCategories, dateRange]);

  const loadChangelogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await changelogService.getAll({ status: 'published' });
      setChangelogs(data);
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
        changelog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        changelog.version.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(changelog =>
        changelog.updates.some(update => 
          selectedCategories.includes(update.category)
        )
      );
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      filtered = filtered.filter(changelog => {
        const releaseDate = new Date(changelog.releaseDate);
        return releaseDate >= start && releaseDate <= end;
      });
    }

    setFilteredChangelogs(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories);
  };

  const handleReact = async (changelogId, reactionType) => {
    try {
      const updated = await changelogService.toggleReaction(changelogId, reactionType);
      setChangelogs(prev => prev.map(c => c.Id === changelogId ? updated : c));
    } catch (err) {
      toast.error('Failed to update reaction');
    }
  };

  const handleSubscribe = () => {
    toast.info('Subscribe feature coming soon!');
  };

  const handleRssFeed = () => {
    toast.info('RSS feed coming soon!');
  };

  const allCategories = changelogService.CATEGORY_OPTIONS.map(cat => cat.value);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Loading type="spinner" className="py-20" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Error 
            title="Failed to Load Changelogs"
            message={error}
            onRetry={loadChangelogs}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                What's New
              </h1>
              <p className="text-gray-600">
                Stay up to date with the latest features, improvements, and fixes
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRssFeed}
                className="gap-2"
              >
                <ApperIcon name="Rss" size={18} />
                RSS Feed
              </Button>
              <Button
                onClick={handleSubscribe}
                className="gap-2"
              >
                <ApperIcon name="Bell" size={18} />
                Subscribe
              </Button>
            </div>
          </div>

          {/* Search and View Mode */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                placeholder="Search changelogs..."
                onSearch={handleSearch}
              />
            </div>
            <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Card View"
              >
                <ApperIcon name="LayoutGrid" size={18} />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'compact' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Compact View"
              >
                <ApperIcon name="List" size={18} />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Timeline View"
              >
                <ApperIcon name="GitCommit" size={18} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              <CategoryFilter
                categories={allCategories}
                selectedCategories={selectedCategories}
                onChange={handleCategoryChange}
              />
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Date Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    placeholder="End date"
                  />
                </div>
                {(dateRange.start || dateRange.end) && (
                  <button
                    onClick={() => setDateRange({ start: '', end: '' })}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-2"
                  >
                    Clear date filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Changelogs List */}
        {filteredChangelogs.length === 0 ? (
          <Empty
            icon="FileText"
            title="No Changelogs Found"
            description={
              searchQuery || selectedCategories.length > 0 || dateRange.start || dateRange.end
                ? "Try adjusting your filters to see more results"
                : "No changelogs have been published yet"
            }
          />
        ) : (
          <div className={viewMode === 'compact' ? 'bg-white rounded-lg border border-gray-200 overflow-hidden' : 'space-y-6'}>
            {filteredChangelogs.map((changelog) => (
              <ChangelogCard
                key={changelog.Id}
                changelog={changelog}
                viewMode={viewMode}
                onReact={handleReact}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {filteredChangelogs.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredChangelogs.length} of {changelogs.length} changelog{changelogs.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogPage;