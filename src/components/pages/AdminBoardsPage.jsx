import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import BoardCard from "@/components/molecules/BoardCard";
import SearchBar from "@/components/molecules/SearchBar";
import CreateBoardModal from "@/components/organisms/CreateBoardModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { boardService } from "@/services/api/boardService";

const AdminBoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);

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
        board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBoards(filtered);
    } else {
      setFilteredBoards(boards);
    }
  }, [searchQuery, boards]);

  const handleCreateBoard = async (boardData) => {
    await boardService.create(boardData);
    await loadBoards();
  };

  const handleEditBoard = (board) => {
    setEditingBoard(board);
    setIsCreateModalOpen(true);
  };

  const handleUpdateBoard = async (boardData) => {
    await boardService.update(editingBoard.Id, boardData);
    await loadBoards();
    setEditingBoard(null);
  };

  const handleDeleteBoard = (board) => {
    setDeletingBoard(board);
  };

  const confirmDeleteBoard = async () => {
    try {
      await boardService.delete(deletingBoard.Id);
      toast.success("Board deleted successfully!");
      await loadBoards();
    } catch (error) {
      toast.error("Failed to delete board");
    } finally {
      setDeletingBoard(null);
    }
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
          icon="Settings"
          title="No feedback boards yet"
          message="Create your first feedback board to start collecting and organizing user feedback."
          actionLabel="Create First Board"
          onAction={handleCreateFirstBoard}
        />
        <CreateBoardModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingBoard(null);
          }}
          onSubmit={handleCreateBoard}
          board={editingBoard}
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
            Board Management
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create, edit, and manage your feedback boards. Control visibility, settings, and organization.
          </p>
        </div>

        {/* Search Bar and Actions */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search boards by name or description..."
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              autoFocus={false}
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="primary"
              size="lg"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              Create Board
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="LayoutGrid" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{boards.length}</p>
              <p className="text-gray-600">Total Boards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Globe" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {boards.filter(b => b.visibility === "public").length}
              </p>
              <p className="text-gray-600">Public Boards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Lock" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {boards.filter(b => b.visibility === "private").length}
              </p>
              <p className="text-gray-600">Private Boards</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-card border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="MessageSquare" className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {boards.reduce((sum, board) => sum + (board.postCount || 0), 0)}
              </p>
              <p className="text-gray-600">Total Posts</p>
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
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredBoards.length} Board{filteredBoards.length !== 1 ? "s" : ""}
            </h2>
            <div className="text-sm text-gray-500">
              Click on any board to view details or use the action buttons to edit
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board) => (
              <BoardCard 
                key={board.Id} 
                board={board} 
                showActions={true}
                onEdit={handleEditBoard}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create/Edit Board Modal */}
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingBoard(null);
        }}
        onSubmit={editingBoard ? handleUpdateBoard : handleCreateBoard}
        board={editingBoard}
      />

      {/* Delete Confirmation Modal */}
      {deletingBoard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Board</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the "{deletingBoard.name}" board? 
                This will permanently remove the board and all associated posts.
              </p>
              
              <div className="flex gap-3 justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setDeletingBoard(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onClick={confirmDeleteBoard}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete Board
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBoardsPage;