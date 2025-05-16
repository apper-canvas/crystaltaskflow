/**
 * Project Service - Handles all project-related data operations
 */

// Get projects with optional filters
export const getProjects = async (filters = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Setup query parameters
    const params = {
      fields: ["Name", "description", "progress", "dueDate", "status", "Tags", "Owner"],
      orderBy: [
        {
          field: "CreatedOn",
          direction: "desc"
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

    const response = await apperClient.fetchRecords("project", params);

    if (!response || !response.data) {
      return [];
    }

    // Transform the response to match the expected project structure
    return response.data.map(project => ({
      id: project.Id.toString(),
      name: project.Name,
      description: project.description || '',
      progress: project.progress || 0,
      dueDate: project.dueDate || new Date().toISOString().split('T')[0],
      status: project.status || 'planning',
      tags: project.Tags || [],
      owner: project.Owner || null
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Get a single project by ID
export const getProjectById = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById("project", projectId);

    if (!response || !response.data) {
      return null;
    }

    const project = response.data;

    return {
      id: project.Id.toString(),
      name: project.Name,
      description: project.description || '',
      progress: project.progress || 0,
      dueDate: project.dueDate || new Date().toISOString().split('T')[0],
      status: project.status || 'planning',
      tags: project.Tags || [],
      owner: project.Owner || null
    };
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Transform the input data to match the database schema
    const record = {
      Name: projectData.name,
      description: projectData.description || '',
      progress: projectData.progress || 0,
      dueDate: projectData.dueDate || new Date().toISOString().split('T')[0],
      status: projectData.status || 'planning',
      Tags: projectData.tags || []
    };

    const params = {
      records: [record]
    };

    const response = await apperClient.createRecord("project", params);

    if (response && response.success && response.results && response.results[0] && response.results[0].success) {
      return {
        id: response.results[0].data.Id.toString(),
        ...projectData
      };
    } else {
      throw new Error("Failed to create project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = { RecordIds: [projectId] };
    const response = await apperClient.deleteRecord("project", params);
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    throw error;
  }
};