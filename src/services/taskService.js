/**
 * Task Service - Handles all task-related data operations
 */

// Get tasks with optional filters
export const getTasks = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Setup query parameters
    const params = {
      fields: ["Name", "title", "description", "status", "priority", "project", "assignee"],
      orderBy: [
        {
          field: "CreatedOn",
          direction: "desc"
        }
      ],
      expands: [
        {
          name: "project",
          alias: "projectDetails"
        }
      ]
    };

    // Add filters if provided
    if (filters.status) {
      params.where = [
        {
          fieldName: "status",
          operator: "ExactMatch",
          values: [filters.status]
        }
      ];
    }

    if (filters.projectId) {
      params.where = params.where || [];
      params.where.push({
        fieldName: "project",
        operator: "ExactMatch",
        values: [filters.projectId]
      });
    }

    const response = await apperClient.fetchRecords("task1", params);

    // Ensure proper handling of empty or missing response data
    if (!response || !response.data || !Array.isArray(response.data)) {
      console.log("API returned empty or invalid response data structure", response);
      return [];
    }
    return response.data.map(task => ({
      id: task.Id.toString(),
      title: task.title || task.Name,
      description: task.description || '',
      status: task.status || 'backlog',
      priority: task.priority || 'medium',
      projectId: task.project?.toString() || null,
      assignee: {
        id: '1', // Using fixed ID as the backend stores just the name
        name: task.assignee || 'Unassigned',
        avatar: getAvatarForAssignee(task.assignee)
      },
      projectDetails: task.projectDetails
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // Re-throw the error to be handled by the component
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Transform the input data to match the database schema
    const record = {
      Name: taskData.title, // Using title as the Name field
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'backlog',
      priority: taskData.priority || 'medium',
      project: taskData.projectId || null,
      assignee: taskData.assignee?.name || ''
    };

    const params = {
      records: [record]
    };

    const response = await apperClient.createRecord("task1", params);

    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return {
        id: response.results[0].data.Id.toString(),
        ...taskData
      };
    } else {
      throw new Error("Failed to create task");
    }
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update a task's status (for drag and drop)
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [{
        Id: taskId,
        status: newStatus
      }]
    };

    const response = await apperClient.updateRecord("task1", params);
    
    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return true;
    } else {
      throw new Error("Failed to update task status");
    }
  } catch (error) {
    console.error(`Error updating task status for task ${taskId}:`, error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = { RecordIds: [taskId] };
    const response = await apperClient.deleteRecord("task1", params);
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};

// Helper function to get avatar URL based on assignee name
function getAvatarForAssignee(name) {
  const assigneeMap = { 'Sarah Chen': 1, 'Michael Johnson': 2, 'Emma Smith': 3, 'Alex Turner': 4, 'James Wilson': 5 };
  const index = assigneeMap[name] || 1;
  return `https://i.pravatar.cc/150?img=${index}`;
}