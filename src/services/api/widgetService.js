import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = 'widget_config_c';

// Utility function for realistic API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all widget configurations
export const getAll = async (boardId = null) => {
  await delay(300);
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "name_c" } },
        { field: { Name: "type_c" } },
        { field: { Name: "position_c" } },
        { field: { Name: "settings_c" } },
        { field: { Name: "is_active_c" } },
        { field: { Name: "board_id_c" } }
      ]
    };

    // Add board filter if provided
    if (boardId) {
      params.where = [{
        FieldName: "board_id_c",
        Operator: "EqualTo",
        Values: [parseInt(boardId)]
      }];
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);

    if (!response?.data?.length) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching widget configurations:", error?.response?.data?.message || error);
    return [];
  }
};

// Get widget configuration by ID
export const getById = async (id) => {
  await delay(300);
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Id" } },
        { field: { Name: "name_c" } },
        { field: { Name: "type_c" } },
        { field: { Name: "position_c" } },
        { field: { Name: "settings_c" } },
        { field: { Name: "is_active_c" } },
        { field: { Name: "board_id_c" } }
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);

    if (!response?.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching widget configuration ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

// Create new widget configuration
export const create = async (data) => {
  await delay(300);
  try {
    const apperClient = getApperClient();

    // Validate required fields
    if (!data.name_c || !data.type_c) {
      console.error("Missing required fields: name_c and type_c are required");
      return null;
    }

    const params = {
      records: [{
        name_c: data.name_c,
        type_c: data.type_c,
        position_c: data.position_c || 0,
        settings_c: data.settings_c || "{}",
        is_active_c: data.is_active_c !== undefined ? data.is_active_c : true,
        board_id_c: data.board_id_c ? parseInt(data.board_id_c) : null
      }]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to create widget configuration:`, failed);
      }

      return successful.length > 0 ? successful[0].data : null;
    }

    return null;
  } catch (error) {
    console.error("Error creating widget configuration:", error?.response?.data?.message || error);
    return null;
  }
};

// Update widget configuration
export const update = async (id, data) => {
  await delay(300);
  try {
    const apperClient = getApperClient();

    const params = {
      records: [{
        Id: parseInt(id),
        ...(data.name_c !== undefined && { name_c: data.name_c }),
        ...(data.type_c !== undefined && { type_c: data.type_c }),
        ...(data.position_c !== undefined && { position_c: data.position_c }),
        ...(data.settings_c !== undefined && { settings_c: data.settings_c }),
        ...(data.is_active_c !== undefined && { is_active_c: data.is_active_c }),
        ...(data.board_id_c !== undefined && { board_id_c: data.board_id_c ? parseInt(data.board_id_c) : null })
      }]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to update widget configuration:`, failed);
      }

      return successful.length > 0 ? successful[0].data : null;
    }

    return null;
  } catch (error) {
    console.error("Error updating widget configuration:", error?.response?.data?.message || error);
    return null;
  }
};

// Delete widget configuration
export const deleteWidget = async (id) => {
  await delay(300);
  try {
    const apperClient = getApperClient();

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      return false;
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to delete widget configuration:`, failed);
        return false;
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting widget configuration:", error?.response?.data?.message || error);
    return false;
  }
};

export const widgetService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteWidget
};