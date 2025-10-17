import { create, update } from "@/services/api/widgetService";

// Initialize with empty comments array - data will be loaded from backend
let comments = [];
let nextId = 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  async getByPostId(postId) {
    await delay(300);
    const postComments = comments.filter(c => c.postId === parseInt(postId));
    
    // Build nested structure
    const commentMap = {};
    const rootComments = [];
    
    // First pass: create map
    postComments.forEach(comment => {
      commentMap[comment.Id] = { ...comment, replies: [] };
    });
    
    // Second pass: build tree
    postComments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(commentMap[comment.Id]);
        }
      } else {
        rootComments.push(commentMap[comment.Id]);
      }
    });
    
    return rootComments;
  },

  async create(commentData) {
    await delay(400);
    
    const newComment = {
      Id: nextId++,
      postId: parseInt(commentData.postId),
      parentId: commentData.parentId || null,
      authorId: commentData.authorId || "user-1",
      author: commentData.author || "Current User",
      content: commentData.content,
      votes: 0,
      hasVoted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    return { ...newComment, replies: [] };
  },

  async update(id, data) {
    await delay(300);
    
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    comment.content = data.content;
    comment.updatedAt = new Date().toISOString();
    
    return { ...comment };
  },

  async delete(id) {
    await delay(300);
    
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    // Delete comment and all replies
    const deleteRecursive = (commentId) => {
      const replies = comments.filter(c => c.parentId === commentId);
      replies.forEach(reply => deleteRecursive(reply.Id));
      const idx = comments.findIndex(c => c.Id === commentId);
      if (idx !== -1) {
        comments.splice(idx, 1);
      }
    };
    
    deleteRecursive(parseInt(id));
    return true;
  },

  async voteComment(commentId, hasVoted) {
    await delay(200);
    
    const comment = comments.find(c => c.Id === parseInt(commentId));
    if (!comment) {
      throw new Error("Comment not found");
    }
    
    comment.hasVoted = hasVoted;
    comment.votes = hasVoted ? comment.votes + 1 : Math.max(0, comment.votes - 1);
    
    return { ...comment };
  }
};