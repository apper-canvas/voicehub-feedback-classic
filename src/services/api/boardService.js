import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const boardService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('board_c', {
        fields: [
          { "field": { "Name": "name_c" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "emoji_c" } },
          { "field": { "Name": "color_c" } },
          { "field": { "Name": "post_count_c" } },
          { "field": { "Name": "member_count_c" } }
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching boards:", error?.response?.data?.message || error);
      toast.error("Failed to load boards");
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('board_c', parseInt(id), {
        fields: [
          { "field": { "Name": "name_c" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "emoji_c" } },
          { "field": { "Name": "color_c" } },
          { "field": { "Name": "post_count_c" } },
          { "field": { "Name": "member_count_c" } }
        ]
      });

      if (!response.success || !response.data) {
        throw new Error("Board not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching board ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(boardData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.createRecord('board_c', {
        records: [{
          name_c: boardData.name,
          description_c: boardData.description,
          emoji_c: boardData.emoji,
          color_c: boardData.color,
          post_count_c: 0,
          member_count_c: 1
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Board created successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating board:", error?.response?.data?.message || error);
      toast.error("Failed to create board");
      return null;
    }
  },

  async update(id, boardData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const updatePayload = {
        Id: parseInt(id)
      };

      if (boardData.name) updatePayload.name_c = boardData.name;
      if (boardData.description) updatePayload.description_c = boardData.description;
      if (boardData.emoji) updatePayload.emoji_c = boardData.emoji;
      if (boardData.color) updatePayload.color_c = boardData.color;

      const response = await apperClient.updateRecord('board_c', {
        records: [updatePayload]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Board updated successfully!");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating board:", error?.response?.data?.message || error);
      toast.error("Failed to update board");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('board_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Board deleted successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting board:", error?.response?.data?.message || error);
      toast.error("Failed to delete board");
      return false;
    }
  },

  async incrementPostCount(boardId) {
    try {
      const board = await this.getById(boardId);
      if (board) {
        const newCount = (board.post_count_c || 0) + 1;
        await this.update(boardId, { post_count_c: newCount });
      }
    } catch (error) {
      console.error("Error incrementing post count:", error);
    }
  },

  async decrementPostCount(boardId) {
    try {
      const board = await this.getById(boardId);
      if (board && board.post_count_c > 0) {
        const newCount = board.post_count_c - 1;
        await this.update(boardId, { post_count_c: newCount });
      }
    } catch (error) {
      console.error("Error decrementing post count:", error);
    }
  }
};