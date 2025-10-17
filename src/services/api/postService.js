import { boardService } from "@/services/api/boardService";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";

// ApperClient instance for database operations
// Use getApperClient() to access database tables: post_c, vote_c, comment_c

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage - in-memory arrays
let posts = [];
let comments = [];
let votes = [];

export const postService = {
  async getAll() {
    await delay(300);
    return [...posts];
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(post => post.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    
    // Increment view count
    post.viewCount = (post.viewCount || 0) + 1;
    
    // Get accurate comment count
    const commentCount = comments.filter(c => c.postId === parseInt(id)).length;
    
    return { ...post, commentCount };
  },
  
  async getCommentCount(postId) {
    await delay(100);
    return comments.filter(c => c.postId === parseInt(postId)).length;
  },

  async getByBoardId(boardId) {
    await delay(300);
    return posts.filter(post => post.boardId === boardId.toString());
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      ...postData,
      Id: Math.max(...posts.map(p => p.Id), 0) + 1,
      votes: 0,
      hasVoted: false,
      status: "planned",
      commentCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    
    // Increment board post count
    if (postData.boardId) {
      await boardService.incrementPostCount(postData.boardId);
    }
    
    return { ...newPost };
  },

  async update(id, postData) {
    await delay(400);
    const index = posts.findIndex(post => post.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    posts[index] = {
      ...posts[index],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...posts[index] };
  },

  async delete(id) {
    await delay(300);
    const index = posts.findIndex(post => post.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    const deletedPost = posts.splice(index, 1)[0];
    
    // Decrement board post count
    if (deletedPost.boardId) {
      await boardService.decrementPostCount(deletedPost.boardId);
    }
    
    return { ...deletedPost };
  },

  async vote(postId, hasVoted) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(postId));
    if (!post) {
      throw new Error("Post not found");
    }
    
    const userId = "user-1"; // Mock user ID
    const existingVoteIndex = votes.findIndex(v => 
      v.postId === postId.toString() && v.userId === userId
    );
    
    if (hasVoted && existingVoteIndex === -1) {
      // Add vote
      const newVote = {
        Id: Math.max(...votes.map(v => v.Id), 0) + 1,
        userId,
        postId: postId.toString(),
        createdAt: new Date().toISOString()
      };
      votes.push(newVote);
      post.votes += 1;
      post.hasVoted = true;
    } else if (!hasVoted && existingVoteIndex !== -1) {
      // Remove vote
      votes.splice(existingVoteIndex, 1);
      post.votes = Math.max(0, post.votes - 1);
      post.hasVoted = false;
    }
    
    return { ...post };
  },

  async search(query, filters = {}) {
    await delay(300);
    let filteredPosts = [...posts];
    
    // Text search
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.description.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Status filter
    if (filters.status && filters.status !== "all") {
      filteredPosts = filteredPosts.filter(post => post.status === filters.status);
    }
    
    // Board filter
    if (filters.boardId) {
      filteredPosts = filteredPosts.filter(post => post.boardId === filters.boardId);
    }
    
    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.tags.some(tag => post.tags.includes(tag))
      );
    }
    
    return filteredPosts;
  },

  async sort(postsToSort, sortBy) {
    await delay(100);
    const sorted = [...postsToSort];
    
    switch (sortBy) {
      case "trending": {
        // Mock trending algorithm: votes + recent activity
        return sorted.sort((a, b) => {
          const aScore = a.votes + (a.commentCount * 2) + (new Date(a.updatedAt).getTime() / 1000000000);
          const bScore = b.votes + (b.commentCount * 2) + (new Date(b.updatedAt).getTime() / 1000000000);
          return bScore - aScore;
        });
      }
      case "top":
        return sorted.sort((a, b) => b.votes - a.votes);
      case "newest":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "most-discussed":
        return sorted.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
      default:
        return sorted;
    }
},
  
  async incrementCommentCount(postId) {
    await delay(100);
    const post = posts.find(p => p.Id === parseInt(postId));
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1;
    }
  },
  
  async decrementCommentCount(postId) {
    await delay(100);
    const post = posts.find(p => p.Id === parseInt(postId));
    if (post && post.commentCount > 0) {
      post.commentCount = post.commentCount - 1;
    }
  }
};