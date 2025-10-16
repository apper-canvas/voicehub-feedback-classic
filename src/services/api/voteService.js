import { getApperClient } from '@/services/apperClient';

// Delay helper for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get vote count for a specific post/roadmap item
 * @param {number} postId - The ID of the post to count votes for
 * @returns {Promise<number>} - Number of votes
 */
export const getVoteCountByPostId = async (postId) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    if (!apperClient) {
      console.error('ApperClient not initialized');
      return 0;
    }

    const response = await apperClient.fetchRecords('vote_c', {
      fields: [{"field": {"Name": "Id"}}],
      where: [{
        "FieldName": "postId_c",
        "Operator": "EqualTo",
        "Values": [parseInt(postId)]
      }]
    });

    if (!response.success) {
      console.error('Failed to fetch vote count:', response.message);
      return 0;
    }

    return response.data?.length || 0;
  } catch (error) {
    console.error('Error fetching vote count:', error?.response?.data?.message || error);
    return 0;
  }
};

/**
 * Check if a user has voted for a specific post
 * @param {number} postId - The ID of the post
 * @param {string} userId - The user's ID
 * @returns {Promise<boolean>} - Whether user has voted
 */
export const hasUserVoted = async (postId, userId) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    if (!apperClient || !userId) {
      return false;
    }

    const response = await apperClient.fetchRecords('vote_c', {
      fields: [{"field": {"Name": "Id"}}],
      where: [
        {
          "FieldName": "postId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(postId)]
        },
        {
          "FieldName": "userId_c",
          "Operator": "EqualTo",
          "Values": [userId]
        }
      ]
    });

    if (!response.success) {
      console.error('Failed to check user vote:', response.message);
      return false;
    }

    return response.data?.length > 0;
  } catch (error) {
    console.error('Error checking user vote:', error?.response?.data?.message || error);
    return false;
  }
};

/**
 * Toggle vote for a post (add if not voted, remove if already voted)
 * @param {number} postId - The ID of the post
 * @param {string} userId - The user's ID
 * @returns {Promise<{success: boolean, action: 'added'|'removed'}>}
 */
export const toggleVote = async (postId, userId) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    if (!apperClient) {
      throw new Error('ApperClient not initialized');
    }

    if (!userId) {
      throw new Error('User must be authenticated to vote');
    }

    // First check if user has already voted
    const existingVote = await apperClient.fetchRecords('vote_c', {
      fields: [{"field": {"Name": "Id"}}],
      where: [
        {
          "FieldName": "postId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(postId)]
        },
        {
          "FieldName": "userId_c",
          "Operator": "EqualTo",
          "Values": [userId]
        }
      ]
    });

    if (!existingVote.success) {
      throw new Error(existingVote.message || 'Failed to check existing vote');
    }

    // If vote exists, remove it
    if (existingVote.data && existingVote.data.length > 0) {
      const voteId = existingVote.data[0].Id;
      const deleteResponse = await apperClient.deleteRecord('vote_c', {
        RecordIds: [voteId]
      });

      if (!deleteResponse.success) {
        throw new Error(deleteResponse.message || 'Failed to remove vote');
      }

      return { success: true, action: 'removed' };
    }

    // If no vote exists, add it
    const createResponse = await apperClient.createRecord('vote_c', {
      records: [{
        postId_c: parseInt(postId),
        userId_c: userId
      }]
    });

    if (!createResponse.success) {
      throw new Error(createResponse.message || 'Failed to add vote');
    }

    return { success: true, action: 'added' };
  } catch (error) {
    console.error('Error toggling vote:', error?.response?.data?.message || error);
    throw error;
  }
};

/**
 * Get all votes by a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of vote records
 */
export const getVotesByUserId = async (userId) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    if (!apperClient || !userId) {
      return [];
    }

    const response = await apperClient.fetchRecords('vote_c', {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "postId_c"}},
        {"field": {"Name": "createdAt"}}
      ],
      where: [{
        "FieldName": "userId_c",
        "Operator": "EqualTo",
        "Values": [userId]
      }]
    });

    if (!response.success) {
      console.error('Failed to fetch user votes:', response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error('Error fetching user votes:', error?.response?.data?.message || error);
    return [];
  }
};

export const voteService = {
  getVoteCountByPostId,
  hasUserVoted,
  toggleVote,
  getVotesByUserId
};