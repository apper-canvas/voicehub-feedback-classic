import { getApperClient } from "@/services/apperClient";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Roadmap Service with ApperClient Database Integration
// Table: roadmap_c
// Updateable Fields: Name, Tags, title_c, description_c, status_c, priority_c, 
//                    category_c, start_date_c, due_date_c, progress_c, assignee_c,
//                    linked_feedback_count_c, tags_c, visibility_c

export const roadmapService = {
  // Fetch all roadmap items
  async getAll() {
    try {
      await delay(300);
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "linked_feedback_count_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "visibility_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('roadmap_c', params);

      if (!response?.data?.length) {
        return [];
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching roadmap items:", error?.response?.data?.message || error);
      return [];
    }
  },

  // Fetch single roadmap item by ID
  async getById(id) {
    try {
      await delay(200);
      const apperClient = getApperClient();

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "progress_c" } },
          { field: { Name: "assignee_c" } },
          { field: { Name: "linked_feedback_count_c" } },
          { field: { Name: "tags_c" } },
          { field: { Name: "visibility_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await apperClient.getRecordById('roadmap_c', id, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching roadmap item ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  // Create new roadmap item (only updateable fields)
  async create(item) {
    try {
      await delay(300);
      const apperClient = getApperClient();

      // Only include updateable fields
      const record = {};
      if (item.Name) record.Name = item.Name;
      if (item.Tags) record.Tags = item.Tags;
      if (item.title_c) record.title_c = item.title_c;
      if (item.description_c) record.description_c = item.description_c;
      if (item.status_c) record.status_c = item.status_c;
      if (item.priority_c) record.priority_c = item.priority_c;
      if (item.category_c) record.category_c = item.category_c;
      if (item.start_date_c) record.start_date_c = item.start_date_c;
      if (item.due_date_c) record.due_date_c = item.due_date_c;
      if (item.progress_c !== undefined) record.progress_c = parseInt(item.progress_c);
      if (item.assignee_c) record.assignee_c = item.assignee_c;
      if (item.linked_feedback_count_c !== undefined) record.linked_feedback_count_c = parseInt(item.linked_feedback_count_c);
      if (item.tags_c) record.tags_c = item.tags_c;
      if (item.visibility_c) record.visibility_c = item.visibility_c;

      const params = {
        records: [record]
      };

      const response = await apperClient.createRecord('roadmap_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create roadmap item:`, failed);
          return null;
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating roadmap item:", error?.response?.data?.message || error);
      return null;
    }
  },

  // Update roadmap item (only updateable fields)
  async update(id, data) {
    try {
      await delay(300);
      const apperClient = getApperClient();

      // Only include updateable fields
      const record = { Id: parseInt(id) };
      if (data.Name) record.Name = data.Name;
      if (data.Tags) record.Tags = data.Tags;
      if (data.title_c) record.title_c = data.title_c;
      if (data.description_c) record.description_c = data.description_c;
      if (data.status_c) record.status_c = data.status_c;
      if (data.priority_c) record.priority_c = data.priority_c;
      if (data.category_c) record.category_c = data.category_c;
      if (data.start_date_c) record.start_date_c = data.start_date_c;
      if (data.due_date_c) record.due_date_c = data.due_date_c;
      if (data.progress_c !== undefined) record.progress_c = parseInt(data.progress_c);
      if (data.assignee_c) record.assignee_c = data.assignee_c;
      if (data.linked_feedback_count_c !== undefined) record.linked_feedback_count_c = parseInt(data.linked_feedback_count_c);
      if (data.tags_c) record.tags_c = data.tags_c;
      if (data.visibility_c) record.visibility_c = data.visibility_c;

      const params = {
        records: [record]
      };

      const response = await apperClient.updateRecord('roadmap_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update roadmap item:`, failed);
          return null;
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating roadmap item:", error?.response?.data?.message || error);
      return null;
    }
  },

  // Delete roadmap item
  async delete(id) {
    try {
      await delay(300);
      const apperClient = getApperClient();

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('roadmap_c', params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete roadmap item:`, failed);
          return false;
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting roadmap item:", error?.response?.data?.message || error);
      return false;
    }
  },

  // Update roadmap item status (specialized method)
  async updateStatus(id, status) {
    try {
      await delay(200);
      const apperClient = getApperClient();

      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('roadmap_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update roadmap status:`, failed);
          return null;
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating roadmap status:", error?.response?.data?.message || error);
      return null;
    }
  }
};

// Status options
export const STATUS_OPTIONS = [
  'Backlog',
  'Planned',
  'In Progress',
  'Shipped'
];

// Priority options
export const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High', emoji: '🔥' },
  { value: 'Medium', label: 'Medium', emoji: '⭐' },
  { value: 'Low', label: 'Low', emoji: '💡' }
];

// Category options
export const CATEGORY_OPTIONS = [
  'Features',
  'Improvements',
  'Bug Fixes',
  'Technical Debt',
  'Research'
];