import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import BoardCard from "@/components/molecules/BoardCard";
import SearchBar from "@/components/molecules/SearchBar";
import CreateBoardModal from "@/components/organisms/CreateBoardModal";
import { boardService } from "@/services/api/boardService";

const BoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const loadBoards = async () => {
    try {
      setLoading(true);
      setError("");
      const boardsData = await boardService.getAll();
      setBoards(boardsData);
      setFilteredBoards(boardsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();

    // Listen for create board modal events from header
    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    window.addEventListener("openCreateBoardModal", handleOpenCreateModal);
    
    return () => {
      window.removeEventListener("openCreateBoardModal", handleOpenCreateModal);
    };
  }, []);

  useEffect(() => {
    // Filter boards based on search query
    if (searchQuery.trim()) {
const filtered = boards.filter(board => 
        board.name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description_c?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBoards(filtered);
    } else {
      setFilteredBoards(boards);
    }
  }, [searchQuery, boards]);

  const handleCreateBoard = async (boardData) => {
    await boardService.create(boardData);
    await loadBoards(); // Reload boards to show the new one
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateFirstBoard = () => {
    setIsCreateModalOpen(true);
  };

  if (loading) {
    return <Loading type="cards" count={6} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load boards"
        message="We couldn't load the feedback boards. Please try again."
        onRetry={loadBoards}
      />
    );
  }

  if (boards.length === 0) {
    return (
      <>
        <Empty
          icon="LayoutGrid"
          title="No feedback boards yet"
          message="Create your first feedback board to start collecting and organizing user feedback."
          actionLabel="Create First Board"
          onAction={handleCreateFirstBoard}
        />
        <CreateBoardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBoard}
        />
      </>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Welcome to VoiceHub
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover feedback boards, share your ideas, and help shape the future of products you care about.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            placeholder="Search boards by name or description..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            autoFocus={false}
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📋</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{boards.length}</p>
              <p className="text-gray-600">Active Boards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">💬</span>
            </div>
            <div>
<p className="text-2xl font-bold text-gray-900">
                {boards.reduce((sum, board) => sum + (board.post_count_c || 0), 0)}
              </p>
              <p className="text-gray-600">Total Posts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">👥</span>
            </div>
            <div>
<p className="text-2xl font-bold text-gray-900">
                {boards.reduce((sum, board) => sum + (board.member_count_c || 0), 0)}
              </p>
              <p className="text-gray-600">Contributors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Boards Grid */}
      {filteredBoards.length === 0 && searchQuery ? (
        <Empty
          icon="Search"
          title="No boards found"
          message={`No boards match "${searchQuery}". Try a different search term or browse all boards.`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery("")}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBoards.map((board) => (
            <BoardCard key={board.Id} board={board} />
          ))}
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBoard}
      />
    </div>
  );
};

export default BoardsPage;