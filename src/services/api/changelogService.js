import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import Error from "@/components/ui/Error";

// Table name from database schema
const TABLE_NAME = 'changelog_c';
// Get all changelogs with optional filters
export const getAllChangelogs = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    // Build where conditions based on filters
    const whereConditions = [];
    
    if (filters.category && filters.category !== 'all') {
      whereConditions.push({
        FieldName: 'category_c',
        Operator: 'EqualTo',
        Values: [filters.category]
      });
    }
    
    if (filters.version) {
      whereConditions.push({
        FieldName: 'version_c',
        Operator: 'EqualTo',
        Values: [filters.version]
      });
    }
    
    if (filters.tag) {
      whereConditions.push({
        FieldName: 'tags_c',
        Operator: 'Contains',
        Values: [filters.tag]
      });
    }
    
    if (filters.search) {
      whereConditions.push({
        FieldName: 'title_c',
        Operator: 'Contains',
        Values: [filters.search]
      });
    }
    
    const params = {
      fields: [
        { field: { Name: 'title_c' } },
        { field: { Name: 'version_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'date_c' } },
        { field: { Name: 'updates_c' } },
        { field: { Name: 'tags_c' } },
        { field: { Name: 'reactions_c' } },
        { field: { Name: 'comments_c' } }
      ],
      where: whereConditions,
      orderBy: [{ fieldName: 'date_c', sorttype: 'DESC' }],
      pagingInfo: { limit: 100, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }
    
    return response.data || [];
  } catch (error) {
    console.error('Error fetching changelogs:', error?.response?.data?.message || error);
    toast.error('Failed to load changelogs');
    return [];
  }
};

// Get a changelog by ID
export const getChangelogById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: 'title_c' } },
        { field: { Name: 'version_c' } },
        { field: { Name: 'category_c' } },
        { field: { Name: 'date_c' } },
        { field: { Name: 'updates_c' } },
        { field: { Name: 'tags_c' } },
        { field: { Name: 'reactions_c' } },
        { field: { Name: 'comments_c' } }
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching changelog ${id}:`, error?.response?.data?.message || error);
    toast.error('Failed to load changelog');
    return null;
  }
};

// Create a new changelog
export const createChangelog = async (changelogData) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [
        {
          title_c: changelogData.title,
          version_c: changelogData.version,
          category_c: changelogData.category,
          date_c: changelogData.date || new Date().toISOString(),
          updates_c: changelogData.updates || [],
          tags_c: changelogData.tags || [],
          reactions_c: JSON.stringify({ likes: 0, hearts: 0, celebrations: 0 }),
          comments_c: JSON.stringify([])
        }
      ]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} changelog:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
        return null;
      }
      
      if (successful.length > 0) {
        toast.success('Changelog created successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error creating changelog:', error?.response?.data?.message || error);
    toast.error('Failed to create changelog');
    return null;
  }
};

// Update an existing changelog
export const updateChangelog = async (id, updates) => {
  try {
    const apperClient = getApperClient();
    
    // Only include Updateable fields
    const updateData = {
      Id: parseInt(id)
    };
    
    if (updates.title !== undefined) updateData.title_c = updates.title;
    if (updates.version !== undefined) updateData.version_c = updates.version;
    if (updates.category !== undefined) updateData.category_c = updates.category;
    if (updates.date !== undefined) updateData.date_c = updates.date;
    if (updates.updates !== undefined) updateData.updates_c = updates.updates;
    if (updates.tags !== undefined) updateData.tags_c = updates.tags;
    if (updates.reactions !== undefined) updateData.reactions_c = JSON.stringify(updates.reactions);
    if (updates.comments !== undefined) updateData.comments_c = JSON.stringify(updates.comments);
    
    const params = {
      records: [updateData]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} changelog:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
        return null;
      }
      
      if (successful.length > 0) {
        toast.success('Changelog updated successfully');
        return successful[0].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating changelog:', error?.response?.data?.message || error);
    toast.error('Failed to update changelog');
    return null;
  }
};
// Delete a changelog
export const deleteChangelog = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);
      
      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} changelog:`, failed);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
        return false;
      }
      
      if (successful.length > 0) {
        toast.success('Changelog deleted successfully');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting changelog:', error?.response?.data?.message || error);
    toast.error('Failed to delete changelog');
    return false;
  }
};

// Get unique versions from all changelogs
export const getVersions = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [{ field: { Name: 'version_c' } }],
      pagingInfo: { limit: 1000, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      return [];
    }
    
    const versions = [...new Set((response.data || []).map(item => item.version_c))];
    return versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  } catch (error) {
    console.error('Error fetching versions:', error);
    return [];
  }
};

// Get unique tags from all changelogs
export const getTags = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [{ field: { Name: 'tags_c' } }],
      pagingInfo: { limit: 1000, offset: 0 }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      return [];
    }
    
    const allTags = (response.data || []).flatMap(item => item.tags_c || []);
    return [...new Set(allTags)].sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

// Get next suggested version based on existing versions
export const getSuggestedVersion = async () => {
  const versions = await getVersions();
  if (versions.length === 0) return '1.0.0';
  
  // Parse the latest version and increment patch number
  const latest = versions[0];
  const parts = latest.split('.');
if (parts.length === 3) {
    const [major, minor, patch] = parts.map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }
  
  return '1.0.0';
};

// Export service object
export const changelogService = {
  getAllChangelogs,
  getChangelogById,
  createChangelog,
  updateChangelog,
  deleteChangelog,
  getVersions,
  getTags,
  getSuggestedVersion
};