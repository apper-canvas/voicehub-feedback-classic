import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import CommentInput from "@/components/molecules/CommentInput";
import CommentItem from "@/components/molecules/CommentItem";
import { postService } from "@/services/api/postService";
import { boardService } from "@/services/api/boardService";
import { commentService } from "@/services/api/commentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SortDropdown from "@/components/molecules/SortDropdown";
import VoteButton from "@/components/molecules/VoteButton";
const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentSort, setCommentSort] = useState("newest");
  const currentUserId = "user-1"; // Mock - would come from auth
  const loadPostData = async () => {
try {
      setLoading(true);
      setError("");
      
      const postData = await postService.getById(postId);
      setPost(postData);
      
      // Load board data
      if (postData.boardId) {
        try {
          const boardData = await boardService.getById(postData.boardId);
          setBoard(boardData);
        } catch (boardError) {
          console.warn("Failed to load board data:", boardError);
        }
      }
      
      // Load comments
      await loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const commentsData = await commentService.getByPostId(postId);
      setComments(sortComments(commentsData, commentSort));
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const sortComments = (commentsArray, sortType) => {
    const sorted = [...commentsArray];
    
    switch (sortType) {
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "top":
        return sorted.sort((a, b) => b.votes - a.votes);
      case "newest":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  useEffect(() => {
    if (postId) {
      loadPostData();
    }
  }, [postId]);

  useEffect(() => {
    if (comments.length > 0) {
      setComments(sortComments(comments, commentSort));
    }
  }, [commentSort]);

const handleVote = async (postId, hasVoted) => {
    try {
      await postService.vote(postId, hasVoted);
      // Update local state
      setPost(prevPost => ({
        ...prevPost,
        votes: hasVoted ? prevPost.votes + 1 : Math.max(0, prevPost.votes - 1),
        hasVoted
      }));
    } catch (error) {
      throw error; // Re-throw to be handled by VoteButton component
    }
  };

  const handleCommentVote = async (commentId, hasVoted) => {
    try {
      await commentService.voteComment(commentId, hasVoted);
      await loadComments();
    } catch (error) {
      throw error;
    }
  };

  const handleAddComment = async (content) => {
    try {
      await commentService.create({
        postId,
        content,
        authorId: currentUserId,
        author: "Current User"
      });
      
      await loadComments();
      
      // Update post comment count
      setPost(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));
      
      toast.success("Comment posted successfully");
    } catch (error) {
      toast.error("Failed to post comment");
      throw error;
    }
  };

  const handleReply = async (parentId, content) => {
    try {
      await commentService.create({
        postId,
        parentId,
        content,
        authorId: currentUserId,
        author: "Current User"
      });
      
      await loadComments();
      
      setPost(prev => ({
        ...prev,
        commentCount: (prev.commentCount || 0) + 1
      }));
    } catch (error) {
      throw error;
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await commentService.update(commentId, { content });
      await loadComments();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.delete(commentId);
      await loadComments();
      
      setPost(prev => ({
        ...prev,
        commentCount: Math.max(0, (prev.commentCount || 1) - 1)
      }));
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleEdit = () => {
    toast.info("Edit functionality coming soon");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    
    try {
      await postService.delete(post.Id);
      toast.success("Post deleted successfully");
      navigate(`/boards/${post.boardId}`);
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      planned: "planned",
      "in-progress": "in-progress",
      completed: "completed",
      cancelled: "cancelled"
    };
    return variants[status] || "default";
  };

const handleBackToBoard = () => {
    if (post?.boardId) {
      navigate(`/boards/${post.boardId}`);
    } else {
      navigate("/");
    }
  };
  const isAuthor = post?.authorId === currentUserId;
  const isAdmin = currentUserId === "admin-1"; // Mock admin check
  const canEditDelete = isAuthor || isAdmin;

if (loading) {
    return <Loading type="post-detail" />;
  }

  if (error) {
    return (
      <Error 
        title="Failed to load post"
        message="We couldn't load the post details. Please try again."
        onRetry={loadPostData}
      />
    );
  }

  if (!post) {
    return (
      <Error 
        title="Post not found"
        message="The post you're looking for doesn't exist or has been removed."
        showRetry={false}
      />
    );
  }

return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main Content */}
        <div className="space-y-6 min-w-0">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToBoard}
              className="flex-shrink-0"
            >
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              Back to Board
            </Button>
            
            {board && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-lg">{board.icon}</span>
                <span className="font-medium">{board.name}</span>
              </div>
            )}
          </div>

          {/* Post Header with Sticky Voting */}
          <div className="bg-white rounded-lg shadow-card border">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Vote Panel - Sticky on Desktop */}
                <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-3">
                  <VoteButton
                    postId={post.Id}
                    votes={post.votes}
                    hasVoted={post.hasVoted}
                    onVote={handleVote}
                    size="lg"
                    className="flex-shrink-0"
                  />
                  <span className="text-xs text-gray-500 hidden md:block text-center">
                    votes
                  </span>
                </div>

                {/* Post Info */}
                <div className="flex-1 min-w-0">
                  {/* Title and Status */}
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1">
                      {post.title}
                    </h1>
                    
                    <Badge 
                      variant={getStatusVariant(post.status)}
                      size="lg"
                      className="flex-shrink-0"
                    >
                      {post.status}
                    </Badge>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-medium">
                      {post.author?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{post.author}</span>
                        {isAuthor && <Badge variant="primary" size="sm">Author</Badge>}
                      </div>
                      <p className="text-sm text-gray-500">
                        Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-gray-200">
                    {canEditDelete && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleEdit}
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleShare}
                    >
                      <ApperIcon name="Share2" className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toast.info("More options coming soon")}
                      className="ml-auto"
                    >
                      <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="bg-white rounded-lg shadow-card border p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-lg shadow-card border p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Discussion ({comments.length})
              </h2>
              
              <SortDropdown
                value={commentSort}
                onSortChange={setCommentSort}
              />
            </div>

            {/* Comment Input */}
            <div className="mb-8">
              <CommentInput
                onSubmit={handleAddComment}
                placeholder="Share your thoughts on this post..."
                submitLabel="Post Comment"
              />
            </div>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map(comment => (
                  <CommentItem
                    key={comment.Id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onVote={handleCommentVote}
                    onReply={handleReply}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                  />
                ))}
              </div>
            ) : (
              <Empty
                icon="MessageSquare"
                title="No comments yet"
                message="Be the first to share your thoughts on this post!"
                showAction={false}
              />
            )}
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-lg shadow-card border p-6 sticky top-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Post Details
              </h3>
              
              <div className="space-y-4">
                {/* Views */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Eye" className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-semibold text-gray-900">{post.viewCount || 0}</p>
                  </div>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="MessageSquare" className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Comments</p>
                    <p className="font-semibold text-gray-900">{comments.length}</p>
                  </div>
                </div>

                {/* Votes */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="ChevronUp" className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Votes</p>
                    <p className="font-semibold text-gray-900">{post.votes}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Timeline
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {post.updatedAt !== post.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(post.updatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {board && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Board
                </h3>
                
                <button
                  onClick={handleBackToBoard}
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-2xl">{board.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{board.name}</p>
                    <p className="text-sm text-gray-500 truncate">{board.description}</p>
                  </div>
                  <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;