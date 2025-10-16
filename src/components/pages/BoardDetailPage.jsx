import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import BoardHeader from "@/components/organisms/BoardHeader";
import PostCard from "@/components/molecules/PostCard";
import StatusFilter from "@/components/molecules/StatusFilter";
import TagFilter from "@/components/molecules/TagFilter";
import SortDropdown from "@/components/molecules/SortDropdown";
import SearchBar from "@/components/molecules/SearchBar";
import SubmitFeedbackModal from "@/components/organisms/SubmitFeedbackModal";
import { boardService } from "@/services/api/boardService";
import { postService } from "@/services/api/postService";

const BoardDetailPage = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});

  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [boardData, postsData] = await Promise.all([
        boardService.getById(boardId),
        postService.getByBoardId(boardId)
      ]);
      
      setBoard(boardData);
      setPosts(postsData);
      
      // Extract available tags
      const allTags = postsData.reduce((tags, post) => {
        return [...tags, ...(post.tags || [])];
      }, []);
      setAvailableTags([...new Set(allTags)]);
      
      // Calculate status counts
      const counts = postsData.reduce((acc, post) => {
        acc[post.status] = (acc[post.status] || 0) + 1;
        acc.all = (acc.all || 0) + 1;
        return acc;
      }, {});
      setStatusCounts(counts);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      loadBoardData();
    }

    // Listen for submit feedback modal events from header
    const handleOpenSubmitModal = () => setIsSubmitModalOpen(true);
    window.addEventListener("openSubmitModal", handleOpenSubmitModal);
    
    return () => {
      window.removeEventListener("openSubmitModal", handleOpenSubmitModal);
    };
  }, [boardId]);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = [...posts];
    
    // Status filter
    if (activeStatus !== "all") {
      filtered = filtered.filter(post => post.status === activeStatus);
    }
    
    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post => 
        selectedTags.some(tag => post.tags?.includes(tag))
      );
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort posts
    postService.sort(filtered, sortBy).then(sorted => {
      setFilteredPosts(sorted);
    });
  }, [posts, activeStatus, selectedTags, sortBy, searchQuery]);

  const handleVote = async (postId, hasVoted) => {
    try {
      await postService.vote(postId, hasVoted);
      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.Id === postId 
            ? { 
                ...post, 
                votes: hasVoted ? post.votes + 1 : Math.max(0, post.votes - 1),
                hasVoted 
              }
            : post
        )
      );
    } catch (error) {
      throw error; // Re-throw to be handled by VoteButton component
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    await postService.create({
      ...feedbackData,
      boardId: boardId
    });
    await loadBoardData(); // Reload to show new post
  };

  const handleTagToggle = (tag) => {
    if (tag === null) {
      // Clear all tags
      setSelectedTags([]);
    } else if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleOpenSubmitModal = () => {
    setIsSubmitModalOpen(true);
  };

  if (loading) {
    return <Loading type="board-detail" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load board"
        message="We couldn't load the board details. Please try again."
        onRetry={loadBoardData}
      />
    );
  }

  if (!board) {
    return (
      <Error 
        title="Board not found"
        message="The board you're looking for doesn't exist or has been removed."
        showRetry={false}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Board Header */}
      <BoardHeader 
        board={board}
        onSubmitFeedback={handleOpenSubmitModal}
      />

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg p-6 shadow-card border">
        <div className="space-y-6">
          {/* Search and Sort */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search posts in this board..."
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
            </div>
            <div className="flex-shrink-0">
              <SortDropdown
                value={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
            <StatusFilter
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              counts={statusCounts}
            />
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Tags</h3>
              <TagFilter
                tags={availableTags}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
          )}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        posts.length === 0 ? (
          <Empty
            icon="MessageSquare"
            title="No feedback posts yet"
            message="Be the first to share your feedback and help shape this product."
            actionLabel="Submit First Feedback"
            onAction={handleOpenSubmitModal}
          />
        ) : (
          <Empty
            icon="Search"
            title="No posts match your filters"
            message="Try adjusting your search terms or filters to see more results."
            actionLabel="Clear All Filters"
            onAction={() => {
              setSearchQuery("");
              setActiveStatus("all");
              setSelectedTags([]);
            }}
          />
        )
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.Id}
              post={post}
              onVote={handleVote}
            />
          ))}
        </div>
      )}

      {/* Submit Feedback Modal */}
      <SubmitFeedbackModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmitFeedback}
        boards={board ? [board] : []}
        selectedBoardId={boardId}
      />
    </div>
  );
};

export default BoardDetailPage;